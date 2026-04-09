import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage, Link } from '@inertiajs/react';

export default function Dashboard() {
    // Extraemos el usuario actual
    const { auth } = usePage().props as any;
    const user = auth.user;

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl leading-tight font-semibold text-gray-800">
                    Panel de Control - {user.role.toLowerCase()}
                </h2>
            }
        >
            <Head title="Administrador" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <div className="overflow-hidden border-l-4 border-indigo-500 bg-white p-6 shadow-sm sm:rounded-lg">
                            <h3 className="mb-2 text-lg font-bold">
                                Gestión de Juegos
                            </h3>
                            <p className="mb-4 text-gray-600">
                                Añadir, editar o eliminar títulos de la
                                plataforma.
                            </p>
                            <Link
                                href='/admin/games'
                                className="inline-flex items-center rounded-md border border-transparent bg-indigo-500 px-4 py-2 text-xs font-semibold tracking-widest text-white uppercase transition duration-150 ease-in-out hover:bg-indigo-700 focus:outline-none"
                            >
                                Gestionar Juegos
                            </Link>
                        </div>

                        {user.role === 'admin' && (
                            <div className="overflow-hidden border-l-4 border-indigo-500 bg-white p-6 shadow-sm sm:rounded-lg">
                                <h3 className="mb-2 text-lg font-bold">
                                    Gestión de Usuarios
                                </h3>
                                <p className="mb-4 text-gray-600">
                                    Administrar cuentas, roles y permisos de
                                    acceso.
                                </p>
                                <Link
                                    href='/admin/users'
                                    className="inline-flex items-center rounded-md border border-transparent bg-indigo-500 px-4 py-2 text-xs font-semibold tracking-widest text-white uppercase transition duration-150 ease-in-out hover:bg-indigo-700 focus:outline-none"
                                >
                                    Gestionar Usuarios
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
