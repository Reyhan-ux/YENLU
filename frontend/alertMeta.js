import { RefreshCw, Sprout, Sun, TrendingUp, Waves } from 'lucide-react';

// Visual metadata for each alert type.
export const ALERT_TYPES = {
  flood: { label: 'Flood', icon: Waves },
  dry: { label: 'Dry spell', icon: Sun },
  rotation: { label: 'Rotation', icon: RefreshCw },
  planting: { label: 'Planting', icon: Sprout },
  market: { label: 'Market', icon: TrendingUp },
};

export const SEVERITY = {
  high: { label: 'High', tone: 'danger' },
  medium: { label: 'Medium', tone: 'warning' },
  low: { label: 'Low', tone: 'info' },
};
