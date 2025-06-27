import { useEffect, useState } from 'react';
import { gql } from 'graphql-request';
import { hygraph } from '@/api/hygraph';

interface FilmLocation {
  title: string;
  filmTitle: string;
  slug: string;
  latitude: number;
  longitude: number;
  genre: string;
  sceneUrl: string;
  image: string;
  content: string;
}

export function useFilmLocations() {
  const [locations, setLocations] = useState<FilmLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const query = gql`
    query {
      filmLocations(first: 1000) {
        filmTitle
        title
        slug
        latitude
        longitude
        genre
        sceneUrl
        image {
          url
        }
        content
      }
    }
  `;

    const fetchLocations = async () => {
      try {
        setLoading(true);
        const data = await hygraph.request<{ filmLocations: FilmLocation[] }>(query);
        setLocations(data.filmLocations);
      } catch (err: any) {
        setError(err.message || 'Erro ao buscar locais');
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, []);

  return { locations, loading, error };
}
