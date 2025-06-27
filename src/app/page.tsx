'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useFilmLocations } from '@/hooks/useFilmLocations';
import {
  Film,
  Drama,
  Heart,
  FlaskConical,
  Ghost,
  Laugh,
  Clapperboard,
  BookOpenCheck,
  Sparkles,
  ListFilter,
  Music,
} from 'lucide-react';

export default function Page() {
  const router = useRouter();
  const { locations, loading, error } = useFilmLocations();
  const [map, setMap] = useState<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);
  const [selectedGenre, setSelectedGenre] = useState('all');

  const genreOptions = [
    { label: 'Todos', value: 'all', icon: ListFilter },
    { label: 'Ação', value: 'action', icon: Film },
    { label: 'Drama', value: 'drama', icon: Drama },
    { label: 'Romance', value: 'romance', icon: Heart },
    { label: 'Ficção', value: 'sciFi', icon: FlaskConical },
    { label: 'Terror', value: 'horror', icon: Ghost },
    { label: 'Comédia', value: 'comedy', icon: Laugh },
    { label: 'Animação', value: 'animation', icon: Clapperboard },
    { label: 'Documentário', value: 'documentary', icon: BookOpenCheck },
    { label: 'Fantasia', value: 'fantasy', icon: Sparkles },
    { label: 'Musical', value: 'musical', icon: Music }, // adicionado
  ];

  const filteredLocations =
    selectedGenre === 'all'
      ? locations
      : locations.filter((loc) =>
          loc.genre
            .split(',')
            .map((g) => g.trim().toLowerCase())
            .includes(selectedGenre.toLowerCase()),
        );

  useEffect(() => {
    if (error) console.error(error);
  }, [error]);

  useEffect(() => {
    if (!map && filteredLocations.length > 0) {
      const mapInstance = new maplibregl.Map({
        container: 'map',
        style: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
        center: [0, 20],
        zoom: 2,
        pitch: 0,
        bearing: 0,
        attributionControl: false,
      });

      mapInstance.addControl(new maplibregl.NavigationControl(), 'top-right');

      mapInstance.on('load', () => {
        mapInstance.setPaintProperty(
          'background',
          'background-color',
          '#061016',
        );
        mapInstance.setPaintProperty(
          'water',
          'fill-color',
          'rgba(38, 70, 83, 0.7)',
        );
        mapInstance.setPaintProperty('landuse', 'fill-color', '#576f7c');

        const layers = mapInstance.getStyle().layers;
        layers.forEach((layer) => {
          if (layer.type === 'symbol' && layer.layout?.['text-field']) {
            mapInstance.setPaintProperty(layer.id, 'text-color', '#334e5e');
            mapInstance.setPaintProperty(layer.id, 'text-halo-width', 0.5);
            mapInstance.setPaintProperty(
              layer.id,
              'text-halo-color',
              'rgba(0, 0, 0, 0.3)',
            );
          }
          if (layer.type === 'line' && /boundary|border|line/i.test(layer.id)) {
            try {
              mapInstance.setPaintProperty(layer.id, 'line-color', '#334e5e');
            } catch {}
          }
        });
      });

      setMap(mapInstance);
    }
  }, [map, filteredLocations.length]);

  useEffect(() => {
    if (!map) return;

    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    filteredLocations.forEach((loc) => {
      const marker = new maplibregl.Marker()
        .setLngLat([loc.longitude, loc.latitude])
        .addTo(map);

      marker.getElement().addEventListener('click', () => {
        map.flyTo({
          center: [loc.longitude, loc.latitude],
          zoom: 15,
          pitch: 45,
          bearing: 20,
          speed: 1.2,
          curve: 1.4,
        });
        router.push(`/locations/${loc.slug}`);
      });

      markersRef.current.push(marker);
    });
  }, [map, filteredLocations, router]);

  if (loading) return <div>Carregando mapa...</div>;
  if (error) return <div>Erro ao carregar locais: {error}</div>;

  return (
    <div className="flex flex-col h-screen">
      <header className="backdrop-blur-lg bg-white/1 text-white px-6 py-4 shadow-lg border-b border-white/5">
        <div className="flex flex-col gap-4">
          <div>
            <h1 className="text-2xl font-bold">Where They Filmed</h1>
            <p className="text-sm text-white/70 max-w-2xl mt-1">
              Explore locações reais onde filmes e séries famosas foram gravados
              ao redor do mundo. <br />
              Use os filtros para ver apenas os gêneros que mais te interessam e
              clique nos pontos do mapa para descobrir curiosidades sobre cada
              cenário.
            </p>
          </div>

          <div className="flex gap-2 overflow-x-auto no-scrollbar flex-nowrap">
            {genreOptions.map(({ label, value, icon: Icon }) => (
              <button
                key={value}
                onClick={() => setSelectedGenre(value)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-md border text-sm transition-all duration-200 whitespace-nowrap cursor-pointer ${
                  selectedGenre === value
                    ? 'bg-[#1C3641] text-white border-[#1C3641]'
                    : 'bg-white/2 text-white border-white/10 hover:bg-transparent'
                }`}
              >
                <Icon size={16} />
                {label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div id="map" className="flex-grow" />
      <footer className="backdrop-blur-lg bg-white/1 text-sm text-gray-400 text-center px-6 py-4 shadow-lg">
        Desenvolvido por{' '}
        <a
          href="https://itsrasfa.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-white"
        >
          Rafaela
        </a>
      </footer>
    </div>
  );
}
