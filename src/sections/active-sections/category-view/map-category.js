export function getCategoryInterests(category) {
  if (!category || typeof category !== 'object') return [];

  const raw =
    category.interests ??
    category.intrests ??
    category.interest ??
    category.Interest ??
    null;

  if (Array.isArray(raw)) {
    return raw.map((item) => String(item || '').trim()).filter(Boolean);
  }

  if (typeof raw === 'string' && raw.trim()) {
    return [raw.trim()];
  }

  if (typeof category.chipGroup === 'string' && category.chipGroup.trim()) {
    return [category.chipGroup.trim()];
  }

  return [];
}

export function mapCategoryRow(category) {
  if (!category || typeof category !== 'object') return null;

  const id = category._id || category.id || '';
  const interests = getCategoryInterests(category);

  return {
    ...category,
    id,
    _id: id,
    interests,
    interestsLabel: interests.length ? interests.join(', ') : '—',
  };
}
