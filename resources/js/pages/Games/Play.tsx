    import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
    import { Head } from '@inertiajs/react';
    // Importación exacta según tu estructura de carpetas
    import { Game } from '@/Components/Games/pages/Game';

    export default function Play({ game }: { game: any }) {
        // Aquí podrías tener un mapa de componentes si tuvieras más juegos
        const gamesMap: Record<string, React.ComponentType> = {
            Game: Game, // El nombre coincide con el 'component_name' del Seeder
        };

        const SelectedGame = gamesMap[game.component_name];
        return (
            <AuthenticatedLayout
                header={
                    <h2 className="text-xl leading-tight font-semibold text-gray-800">
                        Panel de Juego
                    </h2>
                }
            >
                <Head title="Jugando" />

                <div className="h-[600px] w-full overflow-hidden rounded-xl bg-slate-900">
                    {SelectedGame ? (
                        <SelectedGame />
                    ) : (
                        <p>Componente no encontrado</p>
                    )}
                </div>
            </AuthenticatedLayout>
        );
    }
