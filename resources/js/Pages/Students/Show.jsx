import { Head, Link } from '@inertiajs/react';
import Layout from '../../Components/Layout';

const severityConfig = {
    critical: { badge: 'bg-purple-100 text-purple-800 border-purple-200', dot: 'bg-purple-600' },
    high:     { badge: 'bg-red-100 text-red-800 border-red-200',       dot: 'bg-red-600' },
    medium:   { badge: 'bg-yellow-100 text-yellow-800 border-yellow-200', dot: 'bg-yellow-600' },
    info:     { badge: 'bg-green-100 text-green-800 border-green-200',   dot: 'bg-green-600' },
};

const statusStyles = {
    Aktif:  'bg-green-100 text-green-800 border-green-200',
    Amaran: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    Pantau: 'bg-red-100 text-red-800 border-red-200',
};

const eventStatusStyles = {
    'Baru':         'bg-blue-100 text-blue-800 border-blue-200',
    'Disemak':      'bg-yellow-100 text-yellow-800 border-yellow-200',
    'Diselesaikan': 'bg-green-100 text-green-800 border-green-200',
};

export default function StudentShow({ student, events }) {
    return (
        <>
            <Head title={`Profil — ${student.name}`} />
            <Layout title="Profil Murid">

                {/* Back Link */}
                <Link href="/students" className="inline-flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 mb-5 transition-colors font-medium">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Kembali ke senarai
                </Link>

                <div className="grid lg:grid-cols-3 gap-5">
                    {/* ── Profile card ── */}
                    <div className="lg:col-span-1 space-y-4">
                        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                            {/* Avatar */}
                            <div className="flex flex-col items-center text-center mb-5">
                                <div className="w-20 h-20 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-2xl font-bold text-indigo-700 mb-3">
                                    {student.avatar}
                                </div>
                                <h2 className="text-lg font-semibold text-gray-900">{student.name}</h2>
                                <p className="text-gray-500 text-sm">{student.kelas}</p>
                                <span className={`mt-2 inline-flex px-2.5 py-1 rounded-full text-xs font-medium border ${statusStyles[student.status] ?? 'bg-gray-100 text-gray-700 border-gray-200'}`}>
                                    {student.status}
                                </span>
                            </div>

                            {/* Details */}
                            <div className="space-y-3 text-sm">
                                <InfoRow label="ID Murid"   value={student.id}        mono />
                                <InfoRow label="No. IC"     value={student.ic}        mono />
                                <InfoRow label="Jantina"    value={student.gender} />
                                <InfoRow label="Tingkatan"  value={student.tingkatan} />
                                <InfoRow label="Umur"       value={`${student.age} tahun`} />
                                <InfoRow label="Wali"       value={student.wali} />
                                <InfoRow label="Telefon"    value={student.telefon}    mono />
                            </div>
                        </div>

                        {/* Event summary */}
                        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Ringkasan Alert</h3>
                            {events.length === 0 ? (
                                <p className="text-sm text-gray-500 text-center py-4">Tiada alert untuk murid ini.</p>
                            ) : (
                                <div className="space-y-2">
                                    {['critical','high','medium','info'].map(sev => {
                                        const count = events.filter(e => e.severity === sev).length;
                                        if (!count) return null;
                                        const labels = { critical: 'Kritikal', high: 'Tinggi', medium: 'Sederhana', info: 'Maklumat' };
                                        const cfg = severityConfig[sev];
                                        return (
                                            <div key={sev} className="flex items-center justify-between">
                                                <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${cfg.badge.split(' ').filter(c => c.startsWith('text-')).join(' ')}`}>
                                                    <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
                                                    {labels[sev]}
                                                </span>
                                                <span className="text-sm font-semibold text-gray-700">{count}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* ── Event history ── */}
                    <div className="lg:col-span-2">
                        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                            <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50/75">
                                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Sejarah Event CCTV AI</h3>
                                <span className="text-xs text-gray-500">{events.length} rekod</span>
                            </div>

                            {events.length === 0 ? (
                                <div className="px-5 py-12 text-center">
                                    <svg className="w-10 h-10 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <p className="text-gray-500">Tiada event direkodkan untuk murid ini.</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-gray-200">
                                    {events.map(ev => {
                                        const cfg = severityConfig[ev.severity] ?? severityConfig.info;
                                        return (
                                            <div key={ev.id} className="px-5 py-4 hover:bg-gray-50 transition-colors">
                                                <div className="flex items-start justify-between gap-4">
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 flex-wrap mb-1.5">
                                                            <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium border ${cfg.badge}`}>
                                                                <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                                                                {ev.alert_label}
                                                            </span>
                                                            <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium border ${eventStatusStyles[ev.status] ?? 'bg-gray-100 text-gray-700 border-gray-200'}`}>
                                                                {ev.status}
                                                            </span>
                                                            <span className="text-xs text-gray-400 font-mono">{ev.id}</span>
                                                        </div>
                                                        <p className="text-sm text-gray-800 mb-1 font-medium">{ev.description}</p>
                                                        <div className="flex items-center gap-4 text-xs text-gray-500">
                                                            <span>📍 {ev.location}</span>
                                                            <span>🕐 {ev.date} {ev.time}</span>
                                                            <span>🎯 {ev.confidence}</span>
                                                        </div>
                                                    </div>
                                                    <Link
                                                        href={`/events/${ev.id}`}
                                                        className="flex-shrink-0 text-xs font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
                                                    >
                                                        Lihat →
                                                    </Link>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </Layout>
        </>
    );
}

function InfoRow({ label, value, mono = false }) {
    return (
        <div className="flex items-start justify-between gap-3">
            <span className="text-gray-500 flex-shrink-0">{label}</span>
            <span className={`text-right ${mono ? 'font-mono text-xs text-gray-700' : 'text-gray-900 font-medium'}`}>{value}</span>
        </div>
    );
}