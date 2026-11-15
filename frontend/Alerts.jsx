import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { BellOff, Check, CheckCheck, X } from 'lucide-react';
import Card from '../components/Card';
import Badge from '../components/Badge';
import Button from '../components/Button';
import Tabs from '../components/Tabs';
import Dropdown from '../components/Dropdown';
import SearchBar from '../components/SearchBar';
import EmptyState from '../components/EmptyState';
import { ListSkeleton } from '../components/LoadingSkeleton';
import { useApp } from '../context/AppContext';
import useLoading from '../hooks/useLoading';
import { ALERT_TYPES, SEVERITY } from '../utils/alertMeta';

const TYPE_OPTIONS = [{ value: 'all', label: 'All types' }, ...Object.entries(ALERT_TYPES).map(([value, t]) => ({ value, label: t.label }))];

/** Alerts feed with search, status and type filters, and read / dismiss actions. */
export default function Alerts() {
  const { alerts, readAlerts, unreadCount, markRead, markAllRead, dismiss } = useApp();
  const [status, setStatus] = useState('all');
  const [type, setType] = useState('all');
  const [q, setQ] = useState('');
  const loading = useLoading([], 500);

  const list = useMemo(() => {
    const term = q.trim().toLowerCase();
    return alerts
      .filter((a) => (status === 'unread' ? !readAlerts.includes(a.id) : status === 'high' ? a.severity === 'high' : true))
      .filter((a) => type === 'all' || a.type === type)
      .filter((a) => !term || `${a.title} ${a.body}`.toLowerCase().includes(term));
  }, [alerts, readAlerts, status, type, q]);

  const tabs = [
    { value: 'all', label: 'All', count: alerts.length },
    { value: 'unread', label: 'Unread', count: unreadCount },
    { value: 'high', label: 'High priority' },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3 py-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">Alerts</h1>
          <p className="mt-2 text-ink/60 dark:text-leaf-100/60">Rain, soil, rotation and market updates for your fields.</p>
        </div>
        <Button variant="secondary" icon={CheckCheck} onClick={markAllRead} disabled={!unreadCount}>Mark all as read</Button>
      </div>

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <Tabs tabs={tabs} value={status} onChange={setStatus} label="Alert status" />
        <div className="flex flex-col gap-3 sm:flex-row">
          <SearchBar value={q} onChange={setQ} placeholder="Search alerts" className="sm:w-64" />
          <Dropdown value={type} onChange={setType} options={TYPE_OPTIONS} label="Alert type" align="right" className="sm:w-44" />
        </div>
      </div>

      {loading ? <ListSkeleton rows={4} /> : list.length ? (
        <ul className="space-y-3">
          {list.map((a) => {
            const meta = ALERT_TYPES[a.type];
            const Icon = meta.icon;
            const unread = !readAlerts.includes(a.id);
            return (
              <li key={a.id}>
                <Card className={`flex gap-4 ${unread ? 'ring-1 ring-leaf-500/40' : ''}`}>
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-leaf-100 text-leaf-700 dark:bg-leaf-500/20 dark:text-leaf-200"><Icon size={20} aria-hidden /></span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge tone={SEVERITY[a.severity].tone}>{SEVERITY[a.severity].label}</Badge>
                      <Badge>{meta.label}</Badge>
                      <span className="text-xs text-ink/50 dark:text-leaf-100/50">{a.time}</span>
                      {unread && <span className="h-2 w-2 rounded-full bg-leaf-500" aria-label="Unread" />}
                    </div>
                    <h2 className="mt-2 font-semibold tracking-tight">{a.title}</h2>
                    <p className="mt-1 text-sm text-ink/70 dark:text-leaf-100/70">{a.body}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {a.fieldId && <Link to={`/fields/${a.fieldId}`}><Button variant="secondary">View field</Button></Link>}
                      {unread && <Button variant="ghost" icon={Check} onClick={() => markRead(a.id)}>Mark as read</Button>}
                      <Button variant="ghost" icon={X} onClick={() => dismiss(a.id)}>Dismiss</Button>
                    </div>
                  </div>
                </Card>
              </li>
            );
          })}
        </ul>
      ) : (
        <EmptyState
          icon={BellOff}
          title={alerts.length ? 'No alerts match' : "You're all caught up"}
          text={alerts.length ? 'Try another filter or search term.' : 'New rain, soil and rotation alerts will appear here.'}
          action={alerts.length ? <Button variant="secondary" onClick={() => { setStatus('all'); setType('all'); setQ(''); }}>Clear filters</Button> : null}
        />
      )}
    </div>
  );
}
