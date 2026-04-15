import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

interface Session {
    id: number;
    user: { name: string };
    game: { title: string };
    started_at: string;
    ended_at: string;
    duration: number;
    score: number;
}

export default function Sessions({ sessions }: { sessions: any }) {
    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Historial de Partidas</h2>}
        >
            <Head title="Historial de Partidas" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Usuario</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Juego</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Duración</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Puntos</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {sessions.data.map((session: Session) => (
                                    <tr key={session.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">{session.user.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap font-bold text-indigo-600">{session.game.title}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {new Date(session.started_at).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {session.duration ? `${session.duration}s` : 'En curso...'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap font-mono text-green-600">
                                            {session.score}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Simple paginación si la necesitas */}
                        <div className="mt-4">
                            {/* Aquí irían los links de sessions.links */}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
