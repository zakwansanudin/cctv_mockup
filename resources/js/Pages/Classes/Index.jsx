import { Head, Link } from '@inertiajs/react';
import Layout from '../../Components/Layout';

export default function ClassesIndex({ classes = [] }) {
    const totalStudents = classes.reduce((total, item) => total + Number(item.count || 0), 0);
    const forms = [...new Set(classes.map(item => item.tingkatan))];

    return (
        <>
            <Head title="Pengurusan Kelas" />
            <Layout title="Pengurusan Kelas">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
                    <div>
                        <h1 className="text-xl font-semibold text-gray-800">Pengurusan Kelas</h1>
                        <p className="text-sm text-gray-500 mt-1">Senarai kelas dan jumlah murid berdaftar.</p>
                    </div>
                    <button className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors">+ Tambah Kelas</button>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                    <Summary label="Jumlah Kelas" value={classes.length} color="indigo" />
                    <Summary label="Jumlah Murid" value={totalStudents.toLocaleString()} color="blue" />
                    <Summary label="Tingkatan" value={forms.length} color="green" />
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                        <h2 className="text-sm font-semibold text-gray-700">Senarai Kelas</h2>
                        <span className="text-xs text-gray-500">{classes.length} rekod</span>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wide">
                                <tr><th className="text-left px-5 py-3 font-semibold">Nama Kelas</th><th className="text-left px-5 py-3 font-semibold">Tingkatan</th><th className="text-right px-5 py-3 font-semibold">Bilangan Murid</th><th className="text-right px-5 py-3 font-semibold">Tindakan</th></tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {classes.map((item) => <tr key={item.kelas} className="hover:bg-gray-50"><td className="px-5 py-4 font-medium text-gray-800">{item.kelas}</td><td className="px-5 py-4 text-gray-500">{item.tingkatan}</td><td className="px-5 py-4 text-right font-semibold text-gray-700">{item.count}</td><td className="px-5 py-4 text-right"><Link href={`/students?class=${encodeURIComponent(item.kelas)}`} className="text-xs text-indigo-600 hover:text-indigo-800 font-medium">Lihat Murid</Link></td></tr>)}
                            </tbody>
                        </table>
                    </div>
                </div>
            </Layout>
        </>
    );
}

function Summary({ label, value, color }) {
    const styles = { indigo: 'bg-indigo-50 text-indigo-700', blue: 'bg-blue-50 text-blue-700', green: 'bg-green-50 text-green-700' };
    return <div className={`${styles[color]} rounded-2xl p-5`}><p className="text-xs font-medium opacity-70">{label}</p><p className="text-2xl font-bold mt-1">{value}</p></div>;
}
