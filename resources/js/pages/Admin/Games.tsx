import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

interface Game {
    id: number | string;
    title: string;
    slug: string;
    description: string;
    thumbnail: string;
    component_name: string;
}

interface Props {
    games: Game[];
}

export default function Games({ games }: Props) {
    const {
        data,
        setData,
        post,
        put,
        delete: destroy,
        processing,
        errors,
        reset,
    } = useForm({
        id: '',
        title: '',
        slug: '',
        description: '',
        thumbnail: '',
        component_name: 'Game', // Valor por defecto
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        if (data.id) {
            put(route('admin.games.update', data.id), {
                onSuccess: () => reset(),
            });
        } else {
            post(route('admin.games.store'), {
                onSuccess: () => reset(),
            });
        }
    };

    const deleteGame = (id: number | string) => {
        if (confirm('¿Estás seguro de que quieres eliminar este juego?')) {
            destroy(route('admin.games.destroy', id));
        }
    };

    const prepareEdit = (game: Game) => {
        setData({
            id: game.id.toString(),
            title: game.title,
            slug: game.slug,
            description: game.description || '',
            thumbnail: game.thumbnail || '',
            component_name: game.component_name,
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 uppercase">
                    Gestor de Juegos
                </h2>
            }
        >
            <Head title="Gestión de Juegos" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="flex flex-col items-start gap-8 md:flex-row">

                        {/* --- FORMULARIO --- */}
                        <div className="w-full bg-white p-6 shadow sm:rounded-lg md:sticky md:top-6 md:w-1/3">
                            <h3 className="mb-4 text-lg font-bold uppercase text-indigo-600">
                                {data.id ? 'Editar Juego' : 'Nuevo Juego'}
                            </h3>
                            <form onSubmit={submit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Título del Juego:</label>
                                    <input
                                        type="text"
                                        value={data.title}
                                        onChange={(e) => setData('title', e.target.value)}
                                        className="mt-1 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        required
                                    />
                                    {errors.title && <p className="mt-1 text-xs text-red-600">{errors.title}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Slug (URL):</label>
                                    <input
                                        type="text"
                                        value={data.slug}
                                        onChange={(e) => setData('slug', e.target.value)}
                                        placeholder="ej: buscador-objetos"
                                        className="mt-1 w-full rounded-md border-gray-300 shadow-sm"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Nombre del Componente React:</label>
                                    <input
                                        type="text"
                                        value={data.component_name}
                                        onChange={(e) => setData('component_name', e.target.value)}
                                        placeholder="ej: Game"
                                        className="mt-1 w-full rounded-md border-gray-300 shadow-sm bg-gray-50 font-mono text-xs"
                                        required
                                    />
                                    <p className="mt-1 text-[10px] text-gray-500 italic">Debe coincidir con la exportación en JS.</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">URL Miniatura:</label>
                                    <input
                                        type="text"
                                        value={data.thumbnail}
                                        onChange={(e) => setData('thumbnail', e.target.value)}
                                        className="mt-1 w-full rounded-md border-gray-300 shadow-sm"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Descripción:</label>
                                    <textarea
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        className="mt-1 w-full rounded-md border-gray-300 shadow-sm"
                                        rows={3}
                                    />
                                </div>

                                <div className="flex gap-2 pt-2">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="flex-1 rounded bg-indigo-600 px-4 py-2 text-white shadow hover:bg-indigo-700 disabled:opacity-50"
                                    >
                                        {data.id ? 'Actualizar' : 'Crear Juego'}
                                    </button>
                                    {data.id && (
                                        <button
                                            type="button"
                                            onClick={() => reset()}
                                            className="rounded bg-gray-200 px-4 py-2 shadow hover:bg-gray-300"
                                        >
                                            Limpiar
                                        </button>
                                    )}
                                </div>
                            </form>
                        </div>

                        {/* --- TABLA --- */}
                        <div className="w-full overflow-hidden bg-white shadow sm:rounded-lg md:w-2/3">
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse text-left">
                                    <thead className="border-b border-gray-200 bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-3 text-xs font-bold uppercase text-gray-500">Juego</th>
                                            <th className="px-4 py-3 text-xs font-bold uppercase text-gray-500">Componente</th>
                                            <th className="px-4 py-3 text-xs font-bold uppercase text-gray-500 text-center">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {games.map((g) => (
                                            <tr key={g.id} className="transition hover:bg-gray-50">
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded bg-gray-200">
                                                            {g.thumbnail ? (
                                                                <img src={g.thumbnail} alt={g.title} className="h-full w-full object-cover" />
                                                            ) : (
                                                                <div className="flex h-full items-center justify-center text-gray-400 text-xs text-center">3D</div>
                                                            )}
                                                        </div>
                                                        <div>
                                                            <div className="text-sm font-bold text-gray-900">{g.title}</div>
                                                            <div className="text-xs text-gray-500 font-mono">/{g.slug}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className="rounded bg-blue-100 px-2 py-1 text-[11px] font-mono text-blue-700">
                                                        {g.component_name}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    <div className="flex justify-center gap-4">
                                                        <button
                                                            onClick={() => prepareEdit(g)}
                                                            className="text-indigo-600 hover:text-indigo-900"
                                                            title="Editar"
                                                        >
                                                            <i className="fa-solid fa-pen-to-square"></i>
                                                        </button>
                                                        <button
                                                            onClick={() => deleteGame(g.id)}
                                                            className="text-red-600 hover:text-red-900"
                                                            title="Eliminar"
                                                        >
                                                            <i className="fa-solid fa-trash"></i>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                        {games.length === 0 && (
                                            <tr>
                                                <td colSpan={3} className="py-10 text-center text-gray-500">
                                                    No hay juegos registrados todavía.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
