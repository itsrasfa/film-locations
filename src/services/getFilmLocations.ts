import { gql } from 'graphql-request';
import { hygraph } from '@/api/hygraph';

export interface FilmLocation {
  title: string;
  filmTitle: string;
  slug: string;
  latitude: number;
  longitude: number;
  genre: string;
  sceneUrl: string;
  image: {
    url: string;
  };
  content: string;
}

export async function getFilmLocations(): Promise<FilmLocation[]> {
  const query = gql`
    query {
      filmLocations(first: 1000) {
        slug
        latitude
        longitude
        genre
      }
    }
  `;

  const data = await hygraph.request<{ filmLocations: FilmLocation[] }>(query);
  return data.filmLocations;
}
