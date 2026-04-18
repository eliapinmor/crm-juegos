import { useEffect, useRef, useState, FormEventHandler } from 'react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Register() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [captured, setCaptured] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        foto_base64: '',
    });

    useEffect(() => {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(stream => {
                if (videoRef.current) videoRef.current.srcObject = stream;
            })
            .catch(err => console.error("Error cámara:", err));

        return () => {
            if (videoRef.current?.srcObject) {
                (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    const capturePhoto = () => {
        if (videoRef.current && canvasRef.current) {
            const context = canvasRef.current.getContext('2d');
            if (context) {
                context.drawImage(videoRef.current, 0, 0, 640, 480);
                const dataURL = canvasRef.current.toDataURL('image/jpeg', 0.8);
                setData('foto_base64', dataURL);
                setCaptured(true);
            }
        }
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        };
    };

    return (
        <GuestLayout>
            <Head title="Register" />

            <form onSubmit={submit}>
                <div>
                    <InputLabel htmlFor="name" value="Name" />
                    <TextInput
                        id="name"
                        name="name"
                        value={data.name}
                        className="mt-1 block w-full"
                        autoComplete="name"
                        isFocused={true}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                    />
                    <InputError message={errors.name} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="email" value="Email" />
                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full"
                        autoComplete="username"
                        onChange={(e) => setData('email', e.target.value)}
                        required
                    />
                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="password" value="Password" />
                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                        onChange={(e) => setData('password', e.target.value)}
                        required
                    />
                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="password_confirmation" value="Confirm Password" />
                    <TextInput
                        id="password_confirmation"
                        type="password"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        required
                    />
                    <InputError message={errors.password_confirmation} className="mt-2" />
                </div>

                <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <InputLabel value="Registro Facial Obligatorio" className="mb-2" />

                    <div className="relative mb-2">
                        <video ref={videoRef} autoPlay className="rounded-lg bg-black w-full h-48 object-cover shadow-inner" />
                        <canvas ref={canvasRef} width="640" height="480" className="hidden" />

                        {captured && (
                            <div className="absolute inset-0 flex items-center justify-center bg-green-500 bg-opacity-20 rounded-lg">
                                <span className="bg-white px-3 py-1 rounded-full text-green-600 font-bold shadow-sm border border-green-200">
                                    ✓ Foto Lista
                                </span>
                            </div>
                        )}
                    </div>

                    <PrimaryButton
                        type="button"
                        onClick={capturePhoto}
                        className="w-full justify-center bg-gray-800"
                    >
                        {captured ? '🔄 Repetir Captura' : '📸 Capturar Rostro'}
                    </PrimaryButton>

                    <InputError message={errors.foto_base64} className="mt-2" />
                </div>

                <div className="mt-4 flex items-center justify-end">
                    <Link
                        href='/login'
                        className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                        Already registered?
                    </Link>

                    <PrimaryButton className="ms-4" disabled={processing || !data.foto_base64}>
                        Register
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
