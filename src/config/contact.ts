const DEFAULT_WHATSAPP_URL =
  'https://wa.me/51989453142?text=Hola%2C%20quiero%20solicitar%20una%20demostraci%C3%B3n%20de%20Klassia%20para%20mi%20academia.';

const configuredUrl = import.meta.env.PUBLIC_WHATSAPP_URL?.trim();

export const WHATSAPP_URL = configuredUrl?.startsWith('https://wa.me/')
  ? configuredUrl
  : DEFAULT_WHATSAPP_URL;
