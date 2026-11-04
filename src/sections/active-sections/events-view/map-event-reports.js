import { fDateTime, fToNow } from 'src/utils/format-time';

const personName = (value) => {
  if (!value) return '';
  if (typeof value === 'string') return value;
  return value.name || value.handle || value.email || '';
};

export function mapApiReport(item, index = 0) {
  if (!item || typeof item !== 'object') return null;

  const id = item._id || item.id || `report-${index}`;
  const reason = item.reason || item.category || item.type || item.reportType || '';
  const title = item.title || reason || item.status || 'Report';
  const status = item.status || '';
  const description = item.description || item.details || item.note || item.message || item.quote || '';
  const reportedBy =
    personName(item.reportedBy) ||
    personName(item.reporter) ||
    personName(item.createdBy) ||
    personName(item.user) ||
    '';
  const createdAt = item.createdAt || item.reportedAt || item.updatedAt || '';
  const when = createdAt ? fToNow(createdAt) || fDateTime(createdAt) : '';

  const metaParts = [status, reportedBy ? `reported by ${reportedBy}` : '', when].filter(Boolean);

  return {
    id,
    title,
    reason,
    status,
    description,
    reportedBy,
    createdAt,
    when,
    meta: metaParts.join(' · '),
  };
}

export function mapApiReports(list = []) {
  return (Array.isArray(list) ? list : []).map(mapApiReport).filter(Boolean);
}
