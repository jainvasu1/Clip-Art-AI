import axios from 'axios';
import { STABILITY_API_KEY } from '@env';

const STYLE_PROMPTS = {
  cartoon: 'cartoon style, vibrant colors, bold outlines, fun and playful, disney pixar style',
  flat: 'flat illustration style, minimal design, geometric shapes, clean vector art, 2D flat design',
  anime: 'anime style, japanese animation, clean lines, expressive eyes, studio ghibli style',
  pixel: 'pixel art style, 16-bit retro game art, pixelated, game sprite',
  sketch: 'pencil sketch style, hand drawn, black and white outline art, detailed sketch',
};

const STABILITY_URL =
  'https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/image-to-image';

export const generateClipart = async ({
  imageBase64,
  styleId,
  customPrompt = '',
  intensity = 0.35,
  onComplete,
}) => {
  try {
    const stylePrompt = STYLE_PROMPTS[styleId] || STYLE_PROMPTS.cartoon;
    const finalPrompt = customPrompt
      ? `${stylePrompt}, ${customPrompt}, clipart style, high quality`
      : `${stylePrompt}, clipart style, high quality`;

    const formData = new FormData();
    formData.append('init_image', {
      uri: `data:image/jpeg;base64,${imageBase64}`,
      type: 'image/jpeg',
      name: 'input.jpg',
    });
    formData.append('init_image_mode', 'IMAGE_STRENGTH');
    formData.append('image_strength', String(intensity));
    formData.append('steps', '30');
    formData.append('cfg_scale', '7');
    formData.append('samples', '1');
    formData.append('text_prompts[0][text]', finalPrompt);
    formData.append('text_prompts[0][weight]', '1');
    formData.append('text_prompts[1][text]', 'blurry, bad quality, watermark, realistic photo');
    formData.append('text_prompts[1][weight]', '-1');

    const response = await axios.post(STABILITY_URL, formData, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${STABILITY_API_KEY}`,
        'Content-Type': 'multipart/form-data',
      },
    });

    const base64Image = response.data.artifacts[0].base64;
    onComplete(styleId, { status: 'success', base64: base64Image });
  } catch (error) {
    console.log('AI Error:', error?.response?.data || error.message);
    onComplete(styleId, { status: 'error' });
  }
};

export const generateAllStyles = async ({
  imageBase64,
  selectedStyles,
  customPrompt = '',
  intensity = 0.35,
  onStyleComplete,
}) => {
  const promises = selectedStyles.map(styleId =>
    generateClipart({
      imageBase64,
      styleId,
      customPrompt,
      intensity,
      onComplete: onStyleComplete,
    })
  );
  await Promise.all(promises);
};