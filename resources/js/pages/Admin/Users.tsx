import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { FormEventHandler, useEffect } from 'react';

interface Props {
    users: any[];
    roles: any[]; // Si decides pasar los roles desde el controlador
    editUser?: any; // Para cuando queramos cargar uno en el formulario
}

export default function Users({ users, editUser }: Props) {
    // 1. Configuración del Formulario con useForm
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
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: 'jugador',
    });

    useEffect(() => {
        if (editUser) {
            setData({
                id: editUser.id,
                name: editUser.name,
                email: editUser.email,
                password: '',
                password_confirmation: '',
                role: editUser.role || 'jugador',
            });
        }
    }, [editUser]);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        if (data.id) {
            put(`/admin/users/${data.id}`, {
                onSuccess: () => reset(),
            });
        } else {
            (post('admin.users.store'),
                {
                    onSuccess: () => reset(),
                });
        }
    };

    const deleteUser = (id: number) => {
        if (confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
            destroy(`/admin/users/${id}`);
        }
    };

    const prepareEdit = (user: any) => {
        setData({
            id: user.id,
            name: user.name,
            email: user.email,
            password: '',
            password_confirmation: '',
            role: user.role,
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl leading-tight font-semibold text-gray-800">
                    USUARIOS
                </h2>
            }
        >
            <Head title="Gestión de Usuarios" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="flex flex-col items-start gap-8 md:flex-row">
                        {/* --- FORMULARIO --- */}
                        <div className="w-full bg-white p-6 shadow sm:rounded-lg md:sticky md:top-6 md:w-1/3">
                            <h3 className="mb-4 text-lg font-bold uppercase">
                                {data.id ? 'Editar Usuario' : 'Nuevo Usuario'}
                            </h3>
                            <form onSubmit={submit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium">
                                        Nombre:
                                    </label>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={(e) =>
                                            setData('name', e.target.value)
                                        }
                                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        required
                                    />
                                    {errors.name && (
                                        <div className="mt-1 text-xs text-red-600">
                                            {errors.name}
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium">
                                        Email:
                                    </label>
                                    <input
                                        type="email"
                                        value={data.email}
                                        onChange={(e) =>
                                            setData('email', e.target.value)
                                        }
                                        className="w-full rounded-md border-gray-300 shadow-sm"
                                        required
                                    />
                                    {errors.email && (
                                        <div className="mt-1 text-xs text-red-600">
                                            {errors.email}
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium">
                                        Password {data.id && '(Opcional)'}:
                                    </label>
                                    <input
                                        type="password"
                                        value={data.password}
                                        onChange={(e) =>
                                            setData('password', e.target.value)
                                        }
                                        className="w-full rounded-md border-gray-300 shadow-sm"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium">
                                        Rol:
                                    </label>
                                    <select
                                        value={data.role}
                                        onChange={(e) =>
                                            setData('role', e.target.value)
                                        }
                                        className="w-full cursor-pointer rounded-md border-gray-300 shadow-sm"
                                    >
                                        <option value="jugador">Jugador</option>
                                        <option value="gestor">Gestor</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="rounded bg-indigo-600 px-4 py-2 text-white shadow hover:bg-indigo-700 disabled:opacity-50"
                                    >
                                        {data.id ? 'Actualizar' : 'Guardar'}
                                    </button>
                                    {data.id && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                reset();
                                                setData('id', '');
                                            }}
                                            className="rounded bg-gray-200 px-4 py-2 shadow hover:bg-gray-300"
                                        >
                                            Cancelar
                                        </button>
                                    )}
                                </div>
                            </form>
                        </div>

                        {/* --- TABLA --- */}
                        <div className="w-full overflow-hidden bg-white shadow sm:rounded-lg md:w-2/3">
                            <div className="max-h-[70vh] overflow-y-auto">
                                <table className="w-full border-collapse text-left">
                                    <thead className="border-b border-gray-200 bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-3 text-sm font-bold uppercase">
                                                ID
                                            </th>
                                            <th className="px-4 py-3 text-sm font-bold uppercase">
                                                Nombre
                                            </th>
                                            <th className="px-4 py-3 text-sm font-bold uppercase">
                                                Email
                                            </th>
                                            <th className="px-4 py-3 text-sm font-bold uppercase">
                                                Rol
                                            </th>
                                            <th className="px-4 py-3 text-center text-sm font-bold uppercase">
                                                Acciones
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {users.map((u) => (
                                            <tr
                                                key={u.id}
                                                className="transition hover:bg-gray-50"
                                            >
                                                <td className="px-4 py-3 text-sm text-gray-600">
                                                    {u.id}
                                                </td>
                                                <td className="px-4 py-3 text-sm font-medium text-gray-900">
                                                    {u.name}
                                                </td>
                                                <td className="px-4 py-3 text-sm text-gray-600">
                                                    {u.email}
                                                </td>
                                                <td className="px-4 py-3 text-sm">
                                                    <span className="px-2 py-1 text-[10px] font-bold text-blue-700 uppercase">
                                                        {u.roles &&
                                                        u.roles.length > 0
                                                            ? u.roles[0].name
                                                            : 'Sin Rol'}
                                                    </span>
                                                </td>
                                                <td className="space-x-3 px-4 py-3 text-center text-sm">
                                                    <button
                                                        onClick={() =>
                                                            prepareEdit(u)
                                                        }
                                                        className="text-indigo-600 hover:text-indigo-900"
                                                    >
                                                        <i className="fa-solid fa-pen"></i>
                                                    </button>

                                                    <button
                                                        onClick={() =>
                                                            deleteUser(u.id)
                                                        }
                                                        className="text-red-600 hover:text-red-900"
                                                    >
                                                        <i className="fa-solid fa-trash"></i>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
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
