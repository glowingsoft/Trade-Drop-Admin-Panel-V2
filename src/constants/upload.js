import placeholderImg from 'src/assets/image/placeholder-img.png';

export const MAX_AVATAR_SIZE = 5242880;

export const ACCEPTED_IMAGE_TYPES = [
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/webp',
  'image/avif',
  'image/gif',
];

export const ACCEPTED_IMAGE_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.webp', '.avif', '.gif'];

export const IMAGE_CDN_BASE =
  import.meta.env.VITE_ASSET_URL || 'https://res.cloudinary.com/dqkayanph/image/upload';

export const PLACEHOLDER_IMAGE = placeholderImg;

export const MISSING_IMAGE_MARKERS = ['noimg.png', 'noimage.png', 'xyz.jpg'];

export function isMissingImage(value) {
  if (!value || typeof value !== 'string') return true;
  const normalized = value.toLowerCase();
  return MISSING_IMAGE_MARKERS.some((marker) => normalized.includes(marker));
}

export function getImageUrl(file) {
  if (!file || typeof file !== 'string') return '';
  if (file.startsWith('http') || file.startsWith('blob:') || file.startsWith('data:')) {
    return file;
  }
  return `${IMAGE_CDN_BASE.replace(/\/$/, '')}/${file.replace(/^\//, '')}`;
}

export function getDisplayImage(file) {
  if (file instanceof File) return file;
  if (isMissingImage(file)) return PLACEHOLDER_IMAGE;
  return getImageUrl(file) || PLACEHOLDER_IMAGE;
}

export function isImagePublicId(value) {
  return typeof value === 'string' && !!value.trim() && !/^(https?:|blob:|data:)/i.test(value);
}
