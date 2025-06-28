'use client';
import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { useFavorites } from '@/contexts/FavoriteContext';

export const FavoriteButton = ({ slug }: { slug: string }) => {
  const { isFavorited, toggleFavorite, showToast } = useFavorites();
  const fav = isFavorited(slug);

  const [isBouncing, setIsBouncing] = useState(false);

  const handleClick = () => {
    if (!fav) {
      setIsBouncing(true);
      showToast('Local adicionado aos favoritos!');
    } else {
      showToast('Local removido dos favoritos!');
    }
    toggleFavorite(slug);
  };

  useEffect(() => {
    if (isBouncing) {
      const timeout = setTimeout(() => setIsBouncing(false), 300);
      return () => clearTimeout(timeout);
    }
  }, [isBouncing]);

  return (
    <button
      onClick={handleClick}
      aria-pressed={fav}
      title={fav ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
      className="self-start p-2 rounded-md mt-4 text-white transition-colors hover:bg-white/10 select-none"
    >
      <Heart
        size={24}
        className={`transition-colors duration-300 cursor-pointer ${
          fav ? 'text-red-500' : 'text-white'
        } ${isBouncing ? 'animate-bounce-heart' : ''}`}
      />
    </button>
  );
};
