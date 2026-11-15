import { Link } from 'react-router-dom';
import { ArrowUpRight } from '@phosphor-icons/react';

/**
 * Agro-African card tones:
 * - plain: warm volcanic loam surface with subtle organic border
 * - green: deep evergreen forest
 * - teal / clay: rich Mount Cameroon red volcanic clay / terracotta
 * - amber: sun-ripened maize harvest gold
 * - dark: fertile volcanic basalt
 */
const TONES = {
  plain: 'bg-[#FAF5EE] text-[#1F2421] border border-[#E3D9CC] shadow-sm dark:bg-[#1C1512] dark:text-[#F5EFEB] dark:border-white/10',
  green: 'bg-gradient-to-br from-[#1C5535] to-[#113922] text-white border border-[#276F46] shadow-sm',
  teal: 'bg-gradient-to-br from-[#A04F32] to-[#78361F] text-white border border-[#BA603E] shadow-sm',
  amber: 'bg-gradient-to-br from-[#C68A2C] to-[#996618] text-white border border-[#DB9E39] shadow-sm',
  iris: 'bg-gradient-to-br from-[#4A5D4E] to-[#2F3E32] text-white border border-[#5E7563] shadow-sm',
  dark: 'bg-[#221814] text-[#FAF5EE] border border-[#3A2922] shadow-sm dark:bg-[#140E0C] dark:border-white/10',
};

/**
 * Base tactile card surface designed with rich earthy warmth.
 */
export default function Card({ tone = 'plain', to, onClick, arrow = false, lift = false, className = '', children, ...rest }) {
  const interactive = to || onClick;
  const display = /\b(flex|grid)\b/.test(className) ? '' : 'block';
  const cls = [
    'relative overflow-hidden rounded-2xl p-5 text-left transition duration-200',
    display,
    TONES[tone] || TONES.plain,
    interactive || lift ? 'hover:-translate-y-0.5 hover:shadow-md active:scale-[.99]' : '',
    interactive ? 'cursor-pointer' : '',
    className,
  ].join(' ');

  const inner = (
    <>
      {children}
      {arrow && (
        <span className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-xl bg-white/20 text-white backdrop-blur transition hover:bg-white/30" aria-hidden>
          <ArrowUpRight size={18} weight="bold" />
        </span>
      )}
    </>
  );

  if (to) return <Link to={to} className={cls} {...rest}>{inner}</Link>;
  if (onClick) return <button type="button" onClick={onClick} className={`${cls} w-full`} {...rest}>{inner}</button>;
  return <div className={cls} {...rest}>{inner}</div>;
}
