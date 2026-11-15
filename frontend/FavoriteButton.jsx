import { Heart } from 'lucide-react';
import { useApp } from '../context/AppContext';

/** Bookmark toggle, saved to localStorage through the app context. */
export default function FavoriteButton({ id }) {
  const { isFavorite, toggleFavorite } = useApp();
  const fav = isFavorite(id);
  return (
    <button
      type="button"
      aria-pressed={fav}
      aria-label={fav ? 'Remove from favourites' : 'Save to favourites'}
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleFavorite(id); }}
      className="grid h-11 w-11 place-items-center rounded-full bg-ink/5 text-ink transition hover:bg-ink/10 active:scale-90 dark:bg-white/10 dark:text-leaf-50 dark:hover:bg-white/15"
    >
      <Heart size={18} className={fav ? 'fill-red-500 text-red-500' : ''} />
    </button>
  );
}
