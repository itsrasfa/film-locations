'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';

type FavoriteContextType = {
  favorites: string[];
  isFavorited: (slug: string) => boolean;
  toggleFavorite: (slug: string) => void;
  showToast: (message: string) => void;
};

const FavoriteContext = createContext<FavoriteContextType | undefined>(
  undefined,
);

export function FavoriteProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('favorites');
    if (stored) {
      setFavorites(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  const isFavorited = (slug: string) => favorites.includes(slug);

  const toggleFavorite = (slug: string) => {
    setFavorites((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug],
    );
  };

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <FavoriteContext.Provider
      value={{ favorites, isFavorited, toggleFavorite, showToast }}
    >
      {children}
      {toastMessage && (
        <div
          role="alert"
          className="fixed top-6 right-6 bg-white/10 text-white px-4 py-2 rounded-md shadow-lg z-50 select-none"
        >
          {toastMessage}
        </div>
      )}
    </FavoriteContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoriteContext);
  if (!context) {
    throw new Error();
  }
  return context;
}
