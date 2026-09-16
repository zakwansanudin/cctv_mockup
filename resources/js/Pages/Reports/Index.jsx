import { Head, Link } from '@inertiajs/react';
import Layout from '../../Components/Layout';

const statusStyles = {
    Baru: 'bg-blue-50 text-blue-700',
    Disemak: 'bg-yellow-50 text-yellow-800',
    Diselesaikan: 'bg-green-50 text-green-700',
};

export default function ReportsIndex({ stats, events = [] }) {
    const severityLabels = { critical: 'Kritikal', high: 'Tinggi', medium: 'Sederhana', info: 'Maklumat' };
    const severityColors = { critical: 'bg-purple-500', high: 'bg-red-500', medium: 'bg-yellow-400', info: 'bg-green-500' };
    const severityCounts = Object.keys(severityLabels).map(key => ({ key, label: severityLabels[key], count: events.filter(event => event.severity === key).length }));
    const chartMax = Math.max(...severityCounts.map(item => item.count), 1);

    return (
        <>
            <Head title="Laporan" />
            <Layout title="Laporan">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
                    <div><h1 className="text-xl font-semibold text-gray-800">Laporan</h1><p className="text-sm text-gray-500 mt-1">Ringkasan aktiviti keselamatan dan event CCTV AI.</p></div>
                    <button className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors">Muat Turun Laporan</button>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <Metric label="Jumlah Event" value={stats.recent_events?.length ?? 0} color="blue" />
                    <Metric label="Amaran Aktif" value={stats.active_alerts} color="yellow" />
                    <Metric label="Kritikal" value={stats.high_severity} color="red" />
                    <Metric label="Diselesaikan" value={stats.resolved_today} color="green" />
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-6">
                    <div className="flex items-center justify-between mb-5">
                        <div><h2 className="text-sm font-semibold text-gray-700">Taburan Event Mengikut Keterukan</h2><p className="text-xs text-gray-500 mt-1">Data event CCTV AI terkini</p></div>
                        <span className="text-xs text-gray-400">Jumlah: {events.length}</span>
                    </div>
                    <div className="space-y-4">
                        {severityCounts.map(item => (
                            <div key={item.key} className="flex items-center gap-3">
                                <span className="w-20 text-xs text-gray-600">{item.label}</span>
                                <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden"><div className={`h-full rounded-full ${severityColors[item.key]}`} style={{ width: `${(item.count / chartMax) * 100}%` }} /></div>
                                <span className="w-6 text-right text-xs font-semibold text-gray-700">{item.count}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between"><h2 className="text-sm font-semibold text-gray-700">Laporan Event CCTV AI</h2><Link href="/events" className="text-xs text-indigo-600 font-medium">Lihat Event &rsaquo;</Link></div>
                    <div className="overflow-x-auto"><table className="w-full text-sm"><thead className="bg-gray-50 text-xs text-gray-500 uppercase tracking-wide"><tr><th className="text-left px-5 py-3 font-semibold">Event</th><th className="text-left px-5 py-3 font-semibold">Murid</th><th className="text-left px-5 py-3 font-semibold">Jenis Alert</th><th className="text-left px-5 py-3 font-semibold">Lokasi</th><th className="text-left px-5 py-3 font-semibold">Status</th><th className="text-right px-5 py-3 font-semibold">Tarikh</th></tr></thead><tbody className="divide-y divide-gray-100">{events.map(event => <tr key={event.id} className="hover:bg-gray-50"><td className="px-5 py-3 font-mono text-xs text-gray-500">{event.id}</td><td className="px-5 py-3 font-medium text-gray-800">{event.student_name}</td><td className="px-5 py-3 text-gray-600">{event.alert_label}</td><td className="px-5 py-3 text-gray-600">{event.location}</td><td className="px-5 py-3"><span className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyles[event.status] ?? 'bg-gray-100 text-gray-600'}`}>{event.status}</span></td><td className="px-5 py-3 text-right text-gray-500">{event.date} {event.time}</td></tr>)}</tbody></table></div>
                </div>
            </Layout>
        </>
    );
}

function Metric({ label, value, color }) {
    const styles = { blue: 'bg-blue-50 text-blue-700', yellow: 'bg-yellow-50 text-yellow-800', red: 'bg-red-50 text-red-800', green: 'bg-green-50 text-green-700' };
    return <div className={`${styles[color]} rounded-2xl p-5`}><p className="text-xs font-medium opacity-70">{label}</p><p className="text-2xl font-bold mt-1">{value}</p></div>;
}
