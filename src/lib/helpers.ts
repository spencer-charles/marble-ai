import { JobRecord, RoleType, StatusColor } from '@/types/marble';

export function generateId(prefix = 'id'): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `${prefix}-${crypto.randomUUID()}`;
  }
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function formatRelativeTime(isoOrLegacy: string): string {
  if (!isoOrLegacy) return '';
  const parsed = Date.parse(isoOrLegacy);
  if (Number.isNaN(parsed)) {
    return isoOrLegacy;
  }
  const diffSeconds = Math.max(0, Math.floor((Date.now() - parsed) / 1000));
  if (diffSeconds < 45) return 'Just now';
  const diffMinutes = Math.floor(diffSeconds / 60);
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;
  return new Date(parsed).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  });
}

export function getStatusBadgeClasses(color: StatusColor): string {
  switch (color) {
    case 'emerald':
      return 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30';
    case 'amber':
      return 'bg-amber-500/15 text-amber-300 border border-amber-500/30';
    case 'red':
      return 'bg-red-500/15 text-red-300 border border-red-500/30';
    case 'sky':
    default:
      return 'bg-sky-500/15 text-sky-300 border border-sky-500/30';
  }
}

export function getTimelineRoleBadgeClasses(
  role: 'Sales' | 'PM' | 'Craftsman' | 'Owner'
): string {
  switch (role) {
    case 'Sales':
      return 'bg-sky-500/20 text-sky-300 border-sky-500/40';
    case 'PM':
      return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
    case 'Owner':
      return 'bg-purple-500/20 text-purple-300 border-purple-500/40';
    case 'Craftsman':
    default:
      return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
  }
}

export function getTimelineDotClasses(
  role: 'Sales' | 'PM' | 'Craftsman' | 'Owner',
  type?: string
): string {
  if (type === 'escalation') {
    return 'bg-red-500 ring-4 ring-red-500/20';
  }
  switch (role) {
    case 'Sales':
      return 'bg-sky-400';
    case 'PM':
      return 'bg-emerald-400';
    case 'Owner':
      return 'bg-purple-400';
    case 'Craftsman':
    default:
      return 'bg-amber-400';
  }
}

export function getRoleDisplayLabel(role: RoleType): 'Sales' | 'Craftsman' | 'PM' | 'Owner' {
  switch (role) {
    case 'sales':
      return 'Sales';
    case 'pm':
      return 'PM';
    case 'owner':
      return 'Owner';
    case 'craftsman':
    default:
      return 'Craftsman';
  }
}

export function getActorNameForJob(role: RoleType, job: JobRecord): string {
  switch (role) {
    case 'sales':
      return job.salesRep || 'Marcus Vance';
    case 'pm':
      return job.pm || 'Elena Rostova';
    case 'owner':
      return 'Richard Sterling (Owner/GM)';
    case 'craftsman':
    default:
      if (!job.leadCraftsman || job.leadCraftsman === 'Unassigned') {
        return 'Devon Brooks';
      }
      return job.leadCraftsman.split(' (')[0];
  }
}
