import { getDisplayImage } from 'src/constants/upload';
import { fDate } from 'src/utils/format-time';

const SOCIAL_KEYS = ['tiktok', 'instagram', 'x'];

function asObject(value) {
  return value && typeof value === 'object' && !Array.isArray(value) ? value : null;
}

function detectSocialKey(url = '') {
  const value = String(url).toLowerCase();
  if (value.includes('tiktok.com')) return 'tiktok';
  if (value.includes('instagram.com')) return 'instagram';
  if (value.includes('twitter.com') || value.includes('x.com')) return 'x';
  return null;
}

function collectSocialLinks(profile = {}, kv = {}) {
  const result = {};

  [kv.socialLinks, profile.socialLinks, asObject(profile.links)].filter(Boolean).forEach((source) => {
    Object.entries(source).forEach(([key, url]) => {
      if (!url) return;
      const normalized = key === 'twitter' ? 'x' : key;
      result[normalized] = url;
    });
  });

  [kv.links, profile.links].filter(Array.isArray).forEach((links) => {
    links.forEach((item) => {
      if (!item) return;

      if (typeof item === 'string') {
        const key = detectSocialKey(item);
        if (key) result[key] = item;
        return;
      }

      const url = item.url || item.link || item.href;
      if (!url) return;

      const rawKey = (item.key || item.platform || item.type || detectSocialKey(url) || '').toLowerCase();
      const key = rawKey === 'twitter' ? 'x' : rawKey;
      if (SOCIAL_KEYS.includes(key)) result[key] = url;
    });
  });

  return result;
}

function collectWebsite(profile = {}, kv = {}, socialLinks = {}) {
  const direct = kv.websiteUrl || kv.website || profile.websiteUrl || profile.website;
  if (direct) return direct;

  const links = Array.isArray(profile.links) ? profile.links : Array.isArray(kv.links) ? kv.links : [];

  const websiteItem = links.find((item) => {
    if (typeof item === 'string') return !detectSocialKey(item);
    const key = (item?.key || item?.platform || item?.type || '').toLowerCase();
    return key === 'website' || key === 'web' || key === 'url';
  });

  if (typeof websiteItem === 'string') return websiteItem;
  if (websiteItem) return websiteItem.url || websiteItem.link || websiteItem.href || '';

  const leftover = links.find((item) => {
    const url = typeof item === 'string' ? item : item?.url || item?.link;
    return url && !Object.values(socialLinks).includes(url) && !detectSocialKey(url);
  });

  if (typeof leftover === 'string') return leftover;
  return leftover?.url || leftover?.link || leftover?.href || '';
}

function formatPhone(phoneNumber, fallback) {
  if (typeof fallback === 'string' && fallback.trim()) return fallback;
  if (!phoneNumber) return '';
  if (typeof phoneNumber === 'string') return phoneNumber;
  return [phoneNumber.code, phoneNumber.number].filter(Boolean).join(' ');
}

export function mapPortfolioItem(item) {
  const images =
    Array.isArray(item?.images) && item.images.length
      ? item.images
      : [item?.imageUrl, ...(item?.imageUrls || [])].filter(Boolean);

  return {
    ...item,
    id: item?.id || item?._id,
    title: item?.title || '',
    category: item?.category || item?.tags?.[0] || '',
    link: item?.link || '',
    images: images.map((img) => getDisplayImage(img)),
  };
}

export function mapUserDetail(data) {
  if (!data) {
    return {
      id: '',
      kv: {
        name: '',
        image: getDisplayImage(''),
        email: '',
        city: '',
        trust: '',
        portfolio: '',
        websiteUrl: '',
        rating: '',
        reviews: '',
        Bio: '',
        socialLinks: {},
        phone: '',
        language: '',
        status: '',
      },
      portfolioItems: [],
      drops: [],
      reviews: [],
      crafts: [],
      badges: [],
    };
  }

  const basicInfo = data.basicInfo || {};
  const profile = data.profile || {};
  const accountState = data.accountState || {};
  const metadata = data.metadata || {};
  const kv = data.kv || {};
  const socialLinks = collectSocialLinks(profile, kv);
  const portfolioItems = (data.portfolioItems || [])
    .map(mapPortfolioItem)
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
  const reviewsList = Array.isArray(data.reviews) ? data.reviews : [];
  const ratingCount =
    typeof kv.reviews === 'number'
      ? kv.reviews
      : data.reviewsCount ?? (Array.isArray(data.reviews) ? data.reviews.length : kv.reviewsCount);

  return {
    ...data,
    id: basicInfo._id || data.id || data._id || '',
    kv: {
      ...kv,
      name: kv.name || basicInfo.name || '',
      image: getDisplayImage(kv.image || basicInfo.profileIcon),
      email: kv.email || basicInfo.email || '',
      city: kv.city || profile.areaLabel || '',
      trust: kv.trust ?? data.trustScore ?? data.trust ?? profile.trust ?? '',
      portfolio: kv.portfolio ?? data.portfolio ?? portfolioItems.length,
      websiteUrl: collectWebsite(profile, kv, socialLinks),
      rating: kv.rating ?? data.rating ?? profile.rating ?? '',
      reviews: ratingCount,
      Bio: kv.Bio || kv.bio || profile.bio || '',
      socialLinks,
      phone: formatPhone(basicInfo.phoneNumber, kv.phone),
      language: kv.language || basicInfo.language || '',
      status: kv.status || accountState.status || '',
      userType: accountState.userType || kv.userType || '',
      twoFactorAuth: accountState.twoFactorAuth,
      emailVerification: accountState.verificationStatus?.email || '',
      phoneVerification: accountState.verificationStatus?.phoneNumber || '',
      timezone: metadata.timezone || '',
      signup: kv.signup || (metadata.createdAt ? fDate(metadata.createdAt) : ''),
      isOnboardingCompletedDoc: basicInfo.isOnboardingCompletedDoc,
    },
    portfolioItems,
    drops: data.drops || [],
    reviews: reviewsList,
    crafts: data.crafts || [],
    badges: data.badges || [],
  };
}
