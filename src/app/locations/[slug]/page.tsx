import { notFound } from 'next/navigation';
import { gql } from 'graphql-request';
import { hygraph } from '@/api/hygraph';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface FilmLocation {
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

const genreOptions = [
  { label: 'Ação', value: 'action' },
  { label: 'Drama', value: 'drama' },
  { label: 'Romance', value: 'romance' },
  { label: 'Ficção', value: 'sciFi' },
  { label: 'Terror', value: 'horror' },
  { label: 'Comédia', value: 'comedy' },
  { label: 'Animação', value: 'animation' },
  { label: 'Documentário', value: 'documentary' },
  { label: 'Fantasia', value: 'fantasy' },
  { label: 'Musical', value: 'musical' },
];

async function getLocationBySlug(slug: string): Promise<FilmLocation | null> {
  const query = gql`
    query GetLocationBySlug($slug: String!) {
      filmLocation(where: { slug: $slug }) {
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

  const data = await hygraph.request<{ filmLocation: FilmLocation | null }>(
    query,
    { slug },
  );

  return data.filmLocation;
}

export default async function LocationPage(props: any) {
  const { slug } = props.params;
  const location = await getLocationBySlug(slug);

  if (!location) return notFound();

  return (
    <>
      <main className="min-h-screen text-white px-6 py-10">
        <div className="max-w-6xl mx-auto space-y-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-white hover:text-white/70 transition-colors text-sm"
          >
            <ArrowLeft size={18} />
            Voltar ao mapa
          </Link>

          <div className="backdrop-blur-xl bg-white/5 rounded-2xl p-6 shadow-xl border border-white/10 grid md:grid-cols-2 gap-8 items-start">
            <div className="flex flex-col h-full">
              <h1 className="text-3xl font-bold mb-4">{location.title}</h1>

              <Image
                src={location?.image?.url}
                alt={location.title}
                width={800}
                height={500}
                className="rounded-xl object-cover w-full h-[450px]"
              />
            </div>

            <div className="flex flex-col justify-center h-full space-y-4">
              <div>
                <p className="text-sm text-white/70 uppercase tracking-wide mb-1">
                  Filme/Série
                </p>
                <p className="text-xl font-semibold text-white">
                  {location.filmTitle}
                </p>
              </div>

              <div>
                <p className="text-sm text-white/70 uppercase tracking-wide mb-1">
                  Gênero
                </p>

                <p className="text-base text-white capitalize">
                  {genreOptions.find((opt) =>
                    location.genre
                      .toLowerCase()
                      .includes(opt.value.toLowerCase()),
                  )?.label ?? location.genre}
                </p>
              </div>

              <div>
                <p className="text-sm text-white/70 uppercase tracking-wide mb-1">
                  Descrição
                </p>
                <p className="text-white/90 leading-relaxed text-base">
                  {location.content}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
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
    </>
  );
}
