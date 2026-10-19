import { getDisplayImage } from 'src/constants/upload';
import { fToNow } from 'src/utils/format-time';

import { getDisputeReasonOption } from './dispute-status';

const EMPTY = '—';

const partyInitials = (name) =>
  (name || '')
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || EMPTY;

const mapParty = (party, role) => ({
  id: party?._id || '',
  name: party?.name || EMPTY,
  email: party?.email || '',
  image: getDisplayImage(party?.profileIcon),
  initials: partyInitials(party?.name),
  role,
});

const getTradeSummary = (trade) => {
  if (!trade || typeof trade === 'string') return EMPTY;

  const drop = trade.dropIdDrop;
  const tapIn = trade.tapInIdTapIn;
  const dropLabel = [drop?.needText, drop?.offerText].filter(Boolean).join(' → ');

  if (dropLabel) return dropLabel;
  return tapIn?.yourOffer || drop?.areaLabel || EMPTY;
};

export const mapDisputeDetail = (dispute) => {
  if (!dispute) return null;

  const trade = dispute.tradeId;
  const reasonLabel = getDisputeReasonOption(dispute.reason)?.label || dispute.reason || '';
  const tradeCode =
    typeof trade === 'string' ? trade : trade?.tradeCode || trade?._id || EMPTY;

  return {
    id: dispute._id,
    tradeCode,
    title: dispute.description || reasonLabel || EMPTY,
    reason: dispute.reason || '',
    reasonLabel: reasonLabel || EMPTY,
    raisedBy: dispute.raisedBy?.name || EMPTY,
    against: dispute.against?.name || EMPTY,
    openedLabel: dispute.createdAt ? fToNow(dispute.createdAt) : EMPTY,
    slaLabel: EMPTY,
    partyA: mapParty(dispute.raisedBy, 'Claimant'),
    partyB: mapParty(dispute.against, 'Respondent'),
    claimantStatement: dispute.description || EMPTY,
    respondentStatement: dispute.response || EMPTY,
    evidenceA: Array.isArray(dispute.evidence) ? dispute.evidence : [],
    evidenceB: Array.isArray(dispute.responseEvidence) ? dispute.responseEvidence : [],
    tradeId: typeof trade === 'string' ? trade : trade?._id || EMPTY,
    tradeStatus: typeof trade === 'object' ? trade?.status || EMPTY : EMPTY,
    tradeSummary: getTradeSummary(trade),
    tradeNeed: typeof trade === 'object' ? trade?.dropIdDrop?.needText || '' : '',
    tradeOffer: typeof trade === 'object' ? trade?.dropIdDrop?.offerText || '' : '',
    tradeTapIn: typeof trade === 'object' ? trade?.tapInIdTapIn?.yourOffer || '' : '',
    tradeArea: typeof trade === 'object' ? trade?.dropIdDrop?.areaLabel || '' : '',
    priority: dispute.priority || '',
    status: dispute.status || '',
    outcome: dispute.outcome || '',
    resolutionNote: dispute.resolutionNote || '',
    internalNote: dispute.internalNote || '',
    faultUserId: dispute.faultUserId || '',
  };
};
