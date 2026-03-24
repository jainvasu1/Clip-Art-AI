import axios from 'axios';
import { STABILITY_API_KEY } from '@env';
import { STYLES_LIST } from '../constants/styles';

const STABILITY_URL = 'https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/image-to-image';

export const generateAllStyles = async (imageBase64, onStyleComplete) => {
  const results = {};

  const promises = STYLES_LIST.map(async (style) => {
    try {
      const formData = new FormData();
      formData.append('init_image', {
        uri: `data:image/jpeg;base64,${imageBase64}`,
        type: 'image/jpeg',
        name: 'input.jpg',
      });
      formData.append('init_image_mode', 'IMAGE_STRENGTH');
      formData.append('image_strength', '0.35');
      formData.append('steps', '30');
      formData.append('cfg_scale', '7');
      formData.append('samples', '1');
      formData.append('text_prompts[0][text]', `${style.prompt}, clipart style, high quality`);
      formData.append('text_prompts[0][weight]', '1');
      formData.append('text_prompts[1][text]', 'blurry, bad quality, watermark');
      formData.append('text_prompts[1][weight]', '-1');

      const response = await axios.post(STABILITY_URL, formData, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${STABILITY_API_KEY}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      const base64Image = response.data.artifacts[0].base64;
      results[style.id] = { status: 'success', base64: base64Image };
      onStyleComplete(style.id, { status: 'success', base64: base64Image });
    } catch (error) {
      results[style.id] = { status: 'error' };
      onStyleComplete(style.id, { status: 'error' });
    }
  });

  await Promise.all(promises);
  return results;
};