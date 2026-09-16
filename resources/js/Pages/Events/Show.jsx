import { Head, Link } from '@inertiajs/react';
import Layout from '../../Components/Layout';

const severityConfig = {
    critical: {
        badge:      'bg-purple-900/50 text-purple-300 border-purple-700/30',
        dot:        'bg-purple-400',
        glow:       'shadow-purple-900/50',
        headerBg:   'bg-purple-900/20 border-purple-700/20',
        label:      'Kritikal',
    },
    high: {
        badge:      'bg-red-900/50 text-red-300 border-red-700/30',
        dot:        'bg-red-400',
        glow:       'shadow-red-900/50',
        headerBg:   'bg-red-900/20 border-red-700/20',
        label:      'Tinggi',
    },
    medium: {
        badge:      'bg-yellow-900/50 text-yellow-300 border-yellow-700/30',
        dot:        'bg-yellow-400',
        glow:       'shadow-yellow-900/50',
        headerBg:   'bg-yellow-900/20 border-yellow-700/20',
        label:      'Sederhana',
    },
    info: {
        badge:      'bg-green-900/50 text-green-300 border-green-700/30',
        dot:        'bg-green-400',
        glow:       'shadow-green-900/50',
        headerBg:   'bg-green-900/20 border-green-700/20',
        label:      'Maklumat',
    },
};

const eventStatusStyles = {
    'Baru':         'bg-blue-900/40 text-blue-300 border-blue-700/30',
    'Disemak':      'bg-yellow-900/40 text-yellow-300 border-yellow-700/30',
    'Diselesaikan': 'bg-green-900/40 text-green-300 border-green-700/30',
};

const studentStatusStyles = {
    Aktif:  'bg-green-900/40 text-green-300 border-green-700/30',
    Amaran: 'bg-yellow-900/40 text-yellow-300 border-yellow-700/30',
    Pantau: 'bg-red-900/40 text-red-300 border-red-700/30',
};

export default function EventShow({ event, student, relatedEvents }) {
    const cfg = severityConfig[event.severity] ?? severityConfig.info;

    return (
        <>
            <Head title={`Event ${event.id}`} />
            <Layout title="Detail Event CCTV AI">

                {/* Back */}
                <Link href="/events" className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-white mb-5 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Kembali ke senarai event
                </Link>

                {/* ── Event header ── */}
                <div className={`border rounded-xl p-5 mb-5 ${cfg.headerBg}`}>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                        <div className="flex items-center gap-3 flex-1">
                            <div className={`w-3 h-3 rounded-full ${cfg.dot} ring-4 ring-current ring-opacity-30 flex-shrink-0`} />
                            <div>
                                <div className="flex items-center gap-2 flex-wrap">
                                    <span className="font-mono text-sm text-gray-400">{event.id}</span>
                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${cfg.badge}`}>
                                        {cfg.label} — {event.alert_label}
                                    </span>
                                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium border ${eventStatusStyles[event.status] ?? ''}`}>
                                        {event.status}
                                    </span>
                                </div>
                                <p className="text-gray-300 mt-1 text-sm">{event.description}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-5">
                    {/* ── Event detail ── */}
                    <div className="lg:col-span-2 space-y-5">

                        {/* Event flow diagram */}
                        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
                            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Aliran Event CCTV AI</h3>
                            <div className="flex items-center gap-2 flex-wrap text-xs">
                                {[
                                    { icon: '📷', label: 'CCTV AI Kesan', desc: event.camera_id },
                                    { icon: '⚡', label: 'Event Dijana', desc: event.alert_label },
                                    { icon: '🎯', label: 'Murid Dikenal Pasti', desc: event.student_name },
                                    { icon: '📊', label: 'Event Dipapar', desc: 'Dashboard' },
                                    { icon: '👁', label: 'Semakan Pengguna', desc: event.status },
                                ].map((step, idx, arr) => (
                                    <div key={idx} className="flex items-center gap-2">
                                        <div className="flex flex-col items-center text-center">
                                            <div className="w-10 h-10 rounded-lg bg-gray-800 border border-gray-700 flex items-center justify-center text-lg mb-1">
                                                {step.icon}
                                            </div>
                                            <p className="text-gray-300 font-medium">{step.label}</p>
                                            <p className="text-gray-600">{step.desc}</p>
                                        </div>
                                        {idx < arr.length - 1 && (
                                            <svg className="w-4 h-4 text-gray-700 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Event metadata */}
                        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
                            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Maklumat Event</h3>
                            <div className="grid sm:grid-cols-2 gap-4 text-sm">
                                <MetaItem label="ID Event"        value={event.id}          mono />
                                <MetaItem label="ID Kamera"       value={event.camera_id}    mono />
                                <MetaItem label="Lokasi"          value={event.location} />
                                <MetaItem label="Zon"             value={event.zone} />
                                <MetaItem label="Tarikh"          value={event.date} />
                                <MetaItem label="Masa"            value={event.time} />
                                <MetaItem label="Jenis Alert"     value={event.alert_label} />
                                <MetaItem label="Keyakinan AI"    value={event.confidence} />
                                <MetaItem label="Status"          value={event.status} />
                                <MetaItem label="ID Murid"        value={event.student_id}   mono />
                            </div>
                        </div>

                        {/* Related events */}
                        {relatedEvents.length > 0 && (
                            <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
                                <div className="px-5 py-4 border-b border-gray-800 flex items-center justify-between">
                                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Event Lain — Murid Sama</h3>
                                    <Link href={`/students/${event.student_id}`} className="text-xs text-indigo-400 hover:text-indigo-300">
                                        Semua →
                                    </Link>
                                </div>
                                <div className="divide-y divide-gray-800">
                                    {relatedEvents.map(ev => {
                                        const rc = severityConfig[ev.severity] ?? severityConfig.info;
                                        return (
                                            <Link
                                                key={ev.id}
                                                href={`/events/${ev.id}`}
                                                className="flex items-center gap-3 px-5 py-3 hover:bg-gray-800/40 transition-colors"
                                            >
                                                <span className={`w-2 h-2 rounded-full flex-shrink-0 ${rc.dot}`} />
                                                <span className="font-mono text-xs text-gray-500 w-24 flex-shrink-0">{ev.id}</span>
                                                <span className="text-sm text-gray-300 flex-1">{ev.alert_label}</span>
                                                <span className="text-xs text-gray-500 flex-shrink-0">{ev.date}</span>
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* ── Student mapping panel ── */}
                    <div className="space-y-4">
                        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
                            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Pemetaan Murid</h3>
                            {student ? (
                                <>
                                    {/* Avatar */}
                                    <div className="flex flex-col items-center text-center mb-5">
                                        <div className="w-16 h-16 rounded-xl bg-indigo-600/20 border border-indigo-500/20 flex items-center justify-center text-xl font-bold text-indigo-300 mb-2">
                                            {student.avatar}
                                        </div>
                                        <p className="text-white font-semibold">{student.name}</p>
                                        <p className="text-gray-400 text-sm">{student.kelas}</p>
                                        <span className={`mt-2 inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium border ${studentStatusStyles[student.status] ?? ''}`}>
                                            {student.status}
                                        </span>
                                    </div>

                                    <div className="space-y-2.5 text-sm">
                                        <InfoRow label="ID"      value={student.id}     mono />
                                        <InfoRow label="No. IC"  value={student.ic}     mono />
                                        <InfoRow label="Jantina" value={student.gender} />
                                        <InfoRow label="Umur"    value={`${student.age} tahun`} />
                                        <InfoRow label="Wali"    value={student.wali} />
                                        <InfoRow label="Telefon" value={student.telefon} mono />
                                    </div>

                                    <Link
                                        href={`/students/${student.id}`}
                                        className="mt-5 w-full flex items-center justify-center gap-2 bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 text-indigo-300 text-sm font-medium py-2.5 rounded-lg transition-colors"
                                    >
                                        Lihat Profil Penuh
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </Link>
                                </>
                            ) : (
                                <p className="text-sm text-gray-500 text-center py-8">Profil murid tidak dijumpai.</p>
                            )}
                        </div>

                        {/* Location card */}
                        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
                            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Lokasi Kamera</h3>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-gray-800 border border-gray-700 flex items-center justify-center text-lg flex-shrink-0">
                                    📷
                                </div>
                                <div>
                                    <p className="text-gray-200 font-medium text-sm">{event.location}</p>
                                    <p className="text-gray-500 text-xs">{event.zone}</p>
                                    <p className="text-gray-600 text-xs font-mono">{event.camera_id} · {event.location_id}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Layout>
        </>
    );
}

function MetaItem({ label, value, mono = false }) {
    return (
        <div className="bg-gray-800/50 rounded-lg px-4 py-3">
            <p className="text-xs text-gray-500 mb-0.5">{label}</p>
            <p className={`font-medium ${mono ? 'font-mono text-xs text-gray-300' : 'text-gray-200'}`}>{value}</p>
        </div>
    );
}

function InfoRow({ label, value, mono = false }) {
    return (
        <div className="flex items-center justify-between gap-3">
            <span className="text-gray-500 flex-shrink-0">{label}</span>
            <span className={`text-right ${mono ? 'font-mono text-xs text-gray-300' : 'text-gray-200'}`}>{value}</span>
        </div>
    );
}
