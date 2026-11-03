import { fDate } from 'src/utils/format-time';

const mapCategory = (category) => {
  if (!category) return { id: '', name: '—' };
  if (typeof category === 'string') return { id: category, name: category };
  return {
    id: category._id || category.id || '',
    name: category.name || category.title || '—',
  };
};

const mapOrganizer = (organizer) => {
  if (!organizer) return { id: '', name: '—', handle: '', profileIcon: '' };
  if (typeof organizer === 'string') return { id: organizer, name: organizer, handle: '', profileIcon: '' };
  return {
    id: organizer._id || organizer.id || '',
    name: organizer.name || '—',
    handle: organizer.handle || '',
    profileIcon: organizer.profileIcon || '',
  };
};

export function mapCircleListRow(circle) {
  const id = circle?._id || circle?.id || '';
  const category = mapCategory(circle?.category);
  const organizer = mapOrganizer(circle?.organizer);

  return {
    id,
    name: circle?.name || '—',
    purpose: circle?.purpose || '—',
    category: category.name,
    categoryId: category.id,
    city: circle?.city || '—',
    privacy: circle?.privacy || '—',
    coverImage: circle?.coverImage || '',
    image: circle?.coverImage || circle?.image || '',
    creatorId: circle?.creatorId || '—',
    conversationId: circle?.conversationId || '—',
    organizer: organizer.name,
    organizerHandle: organizer.handle,
    organizerImage: organizer.profileIcon,
    createdAt: circle?.createdAt ? fDate(circle.createdAt) : '—',
    updatedAt: circle?.updatedAt ? fDate(circle.updatedAt) : '—',
    createdAtRaw: circle?.createdAt || '',
    updatedAtRaw: circle?.updatedAt || '',
    creatorId: circle?.creatorId || '',
    conversationId: circle?.conversationId || '',
    polls: Array.isArray(circle?.polls) ? circle.polls : [],
    poll: circle?.poll ?? null,
    distanceMeters: circle?.distanceMeters,
    location: circle?.location || null,
  };
}
