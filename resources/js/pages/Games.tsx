import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

interface Game {
    id: number;
    title: string;
    slug: string;
    description: string;
    thumbnail?: string;
}

interface Props {
    games: Game[];
}

export default function Games({ games }: Props) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Biblioteca de Juegos
                </h2>
            }
        >
            <Head title="Juegos" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {games.length > 0 ? (
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {games.map((game) => (
                                <div
                                    key={game.id}
                                    className="flex flex-col overflow-hidden rounded-lg bg-white shadow-md transition hover:shadow-lg"
                                >
                                    {/* Imagen de Portada */}
                                    <div className="h-48 w-full bg-gray-200">
                                        <img
                                            src={game.thumbnail || 'https://via.placeholder.com/400x225?text=Sin+Imagen'}
                                            alt={game.title}
                                            className="h-full w-full object-cover"
                                        />
                                    </div>

                                    {/* Contenido de la Card */}
                                    <div className="flex flex-1 flex-col p-6">
                                        <h3 className="mb-2 text-xl font-bold text-gray-900">
                                            {game.title}
                                        </h3>
                                        <p className="mb-4 flex-1 text-sm text-gray-600">
                                            {game.description}
                                        </p>

                                        {/* Botón Jugar usando href manual */}
                                        <Link
                                            href={`/games/${game.slug}`}
                                            className="inline-flex justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                        >
                                            Jugar Ahora
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white p-12 text-center shadow-sm sm:rounded-lg">
                            <p className="text-gray-500">No hay juegos disponibles en este momento.</p>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
