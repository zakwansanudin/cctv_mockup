import { useForm, Head } from '@inertiajs/react';

export default function Login() {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
    });

    function handleSubmit(e) {
        e.preventDefault();
        post('/login');
    }

    return (
        <>
            <Head title="Log Masuk" />
            <div
                className="min-h-screen bg-cover bg-top flex items-center justify-center md:justify-end px-4 sm:px-8 lg:px-20"
                style={{ backgroundImage: "url('/images/login_web_bg.png')" }}
            >

                <div className="relative w-full max-w-md md:mr-4 lg:mr-12">

                    {/* Card */}
                    <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-2xl">
                        <h2 className="text-2xl font-semibold tracking-tight text-black">Selamat Datang</h2>
                        <span className="block text-gray-500 mb-8">Log Masuk ke Sistem Sekolah Selamat</span>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Email */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                                    Alamat E-mel
                                </label>
                                <input
                                    type="email"
                                    value={data.email}
                                    onChange={e => setData('email', e.target.value)}
                                    placeholder="contoh@sekolah.edu.my"
                                    className="w-full bg-gray-100 border border-gray-200 rounded-lg px-4 py-2.5 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                                    autoComplete="email"
                                />
                                {errors.email && (
                                    <p className="text-red-400 text-sm mt-1.5">{errors.email}</p>
                                )}
                            </div>

                            {/* Password */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1.5">
                                    Kata Laluan
                                </label>
                                <input
                                    type="password"
                                    value={data.password}
                                    onChange={e => setData('password', e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full bg-gray-100 border border-gray-200 rounded-lg px-4 py-2.5 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                                    autoComplete="current-password"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-2.5 rounded-lg transition-colors"
                            >
                                {processing ? 'Sedang log masuk…' : 'Log Masuk'}
                            </button>
                        </form>

                        {/* Demo credentials */}
                        <div className="mt-6 pt-6 border-t border-gray-800">
                            <p className="text-xs text-gray-500 mb-3 uppercase tracking-wider font-medium">Akaun Demonstrasi</p>
                            <div className="space-y-2">
                                <DemoCredential
                                    label="Admin"
                                    email="admin@sekolah.edu.my"
                                    password="admin123"
                                    onClick={() => { setData('email', 'admin@sekolah.edu.my'); setData('password', 'admin123'); }}
                                />
                                <DemoCredential
                                    label="Guru"
                                    email="guru@sekolah.edu.my"
                                    password="guru123"
                                    onClick={() => { setData('email', 'guru@sekolah.edu.my'); setData('password', 'guru123'); }}
                                />
                            </div>
                        </div>
                    </div>

                    <p className="text-center text-gray-600 text-xs mt-6">
                        Fasa 1 — Prototype &amp; Proof of Concept
                    </p>
                </div>
            </div>
        </>
    );
}

function DemoCredential({ label, email, password, onClick }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="w-full flex items-center justify-between bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 rounded-lg px-3 py-2.5 text-left transition-colors group"
        >
            <div>
                <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wide">{label}</span>
                <p className="text-gray-300 text-sm">{email}</p>
            </div>
            <div className="text-right">
                <p className="text-gray-500 text-xs font-mono">{password}</p>
                <p className="text-gray-600 text-xs group-hover:text-indigo-400 transition-colors">Isi &rarr;</p>
            </div>
        </button>
    );
}
