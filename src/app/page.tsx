import MapPage from '@/components/Map';
import { FilmLocation, getFilmLocations } from '@/services/getFilmLocations';

export default async function Home() {
  const locations: FilmLocation[] = await getFilmLocations();

  return <MapPage locations={locations} />;
}
