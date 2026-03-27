import axios from 'axios';
import { HF_API_TOKEN } from '@env';

const STYLE_PROMPTS = {
  cartoon: 'cartoon style, vibrant colors, bold outlines, disney pixar style, high quality',
  flat: 'flat illustration style, minimal design, geometric shapes, clean vector art',
  anime: 'anime style, japanese animation, clean lines, expressive eyes, studio ghibli',
  pixel: 'pixel art style, 16-bit retro game art, pixelated, game sprite',
  sketch: 'pencil sketch, hand drawn, black and white outline art, detailed',
  clay: 'clay 3D style, soft clay material, pastel colors, cute 3D render',
};

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const generateClipart = async ({
  imageBase64,
  styleId,
  customPrompt = '',
  onComplete,
}) => {
  try {
    const stylePrompt = STYLE_PROMPTS[styleId] || STYLE_PROMPTS.cartoon;
    const finalPrompt = customPrompt
      ? `${stylePrompt}, ${customPrompt}`
      : stylePrompt;

    const response = await axios.post(
      'https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0',
      {
        inputs: finalPrompt,
        parameters: {
          negative_prompt: 'blurry, bad quality, watermark, text, realistic photo',
          num_inference_steps: 20,
          guidance_scale: 7.5,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${HF_API_TOKEN}`,
          'Content-Type': 'application/json',
          Accept: 'image/png',
        },
        responseType: 'arraybuffer',
        timeout: 120000,
      }
    );

    // Convert to base64
    const bytes = new Uint8Array(response.data);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    const base64 = `data:image/png;base64,${btoa(binary)}`;

    onComplete(styleId, { status: 'success', base64 });

  } catch (error) {
    console.log('AI Error:', error?.response?.status, error?.response?.data?.toString() || error.message);
    onComplete(styleId, { status: 'error' });
  }
};

export const generateAllStyles = async ({
  imageBase64,
  selectedStyles,
  customPrompt = '',
  onStyleComplete,
}) => {
  for (const styleId of selectedStyles) {
    await generateClipart({
      imageBase64,
      styleId,
      customPrompt,
      onComplete: onStyleComplete,
    });
  }
};