import { useEffect, useRef, useState, FormEventHandler } from 'react';
import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({
    status,
    canResetPassword,
}: {
    status?: string;
    canResetPassword: boolean;
}) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [captured, setCaptured] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false as boolean,
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

    const captureForLogin = () => {
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
        post('/login', {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Log in" />

            {status && (
                <div className="mb-4 text-sm font-medium text-green-600">
                    {status}
                </div>
            )}

            <form onSubmit={submit}>
                <div>
                    <InputLabel htmlFor="email" value="Email" />
                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full"
                        autoComplete="username"
                        isFocused={true}
                        onChange={(e) => setData('email', e.target.value)}
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
                        autoComplete="current-password"
                        onChange={(e) => setData('password', e.target.value)}
                    />
                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <InputLabel value="Verificación Facial Obligatoria" className="mb-2" />

                    <div className="relative mb-2">
                        <video ref={videoRef} autoPlay className="rounded-lg bg-black w-full h-48 object-cover" />
                        <canvas ref={canvasRef} width="640" height="480" className="hidden" />

                        {captured && (
                            <div className="absolute inset-0 flex items-center justify-center bg-blue-500 bg-opacity-20 rounded-lg">
                                <span className="bg-white px-3 py-1 rounded-full text-blue-600 font-bold shadow-sm">
                                    ✓ Rostro capturado
                                </span>
                            </div>
                        )}
                    </div>

                    <PrimaryButton
                        type="button"
                        onClick={captureForLogin}
                        className="w-full justify-center bg-gray-800"
                    >
                        {captured ? '🔄 Recapturar' : '📸 Capturar para acceder'}
                    </PrimaryButton>

                    <InputError message={errors.foto_base64} className="mt-2" />
                </div>

                <div className="mt-4 block">
                    <label className="flex items-center">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            onChange={(e) => setData('remember', e.target.checked)}
                        />
                        <span className="ms-2 text-sm text-gray-600">Remember me</span>
                    </label>
                </div>

                <div className="mt-4 flex items-center justify-end">
                    {canResetPassword && (
                        <Link
                            href='/password.request'
                            className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                            Forgot your password?
                        </Link>
                    )}

                    <PrimaryButton className="ms-4" disabled={processing || !data.foto_base64}>
                        Log in
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
