import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import Layout from '../../Components/Layout';

const severityConfig = {
    critical: { badge: 'bg-purple-100 text-purple-800 border-purple-200', dot: 'bg-purple-600', label: 'Kritikal' },
    high:     { badge: 'bg-red-100 text-red-800 border-red-200',         dot: 'bg-red-500',    label: 'Tinggi' },
    medium:   { badge: 'bg-amber-100 text-amber-800 border-amber-200',   dot: 'bg-amber-500',  label: 'Sederhana' },
    info:     { badge: 'bg-emerald-100 text-emerald-800 border-emerald-200', dot: 'bg-emerald-500', label: 'Maklumat' },
};

const eventStatusStyles = {
    'Baru':         'bg-blue-100 text-blue-800 border-blue-200',
    'Disemak':      'bg-amber-100 text-amber-800 border-amber-200',
    'Diselesaikan': 'bg-emerald-100 text-emerald-800 border-emerald-200',
};

export default function EventsIndex({ events, locations, alertTypes, filters, selectedEvent, selectedStudent, relatedEvents }) {
    const { flash } = usePage().props;
    const [showSimulator, setShowSimulator] = useState(false);
    const [retrievingAlert, setRetrievingAlert] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const perPage = 8;
    const [severity, setSeverity] = useState(filters.severity ?? '');
    const [status,   setStatus]   = useState(filters.status   ?? '');
    const [location, setLocation] = useState(filters.location ?? '');

    const { data, setData, post, processing, errors, reset } = useForm({
        student_id:  '',
        location_id: '',
        alert_code:  '',
    });

    function applyFilters(overrides = {}) {
        const params = {
            severity: overrides.severity ?? severity,
            status:   overrides.status   ?? status,
            location: overrides.location ?? location,
        };
        Object.keys(params).forEach(k => { if (!params[k]) delete params[k]; });
        router.get('/events', params, { preserveState: true, replace: true });
    }

    function submitSimulate(e) {
        e.preventDefault();
        post('/events/simulate', {
            onSuccess: () => { reset(); setShowSimulator(false); },
        });
    }

    // Dummy alert retrieval; replace the timeout with the CCTV API request later.
    function retrieveAlert() {
        setRetrievingAlert(true);
        setTimeout(() => {
            router.get('/dashboard');
        }, 700);
    }

    const selectedCfg = selectedEvent ? (severityConfig[selectedEvent.severity] ?? severityConfig.info) : null;
    const totalPages = Math.max(1, Math.ceil(events.length / perPage));
    const visibleEvents = events.slice((currentPage - 1) * perPage, currentPage * perPage);

    return (
        <>
            <Head title="Event CCTV AI" />
            <Layout title="Event CCTV AI">

                {/* ── Simulated event flash banner ── */}
                {flash?.simulated && (
                    <div className="mb-5 bg-indigo-50 border border-indigo-200 rounded-xl p-4 flex items-start gap-3">
                        <svg className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        <div>
                            <p className="text-sm font-semibold text-indigo-900">Event Simulasi Diterima</p>
                            <p className="text-xs text-indigo-700 mt-0.5">
                                [{flash.simulated.id}] {flash.simulated.student_name} — {flash.simulated.alert_label} @ {flash.simulated.location}
                            </p>
                        </div>
                    </div>
                )}

                {/* ── Toolbar ── */}
                <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-4 mb-5">
                    <div className="flex flex-col sm:flex-row gap-3">
                        <select
                            value={severity}
                            onChange={e => { setSeverity(e.target.value); applyFilters({ severity: e.target.value }); }}
                            className="bg-gray-50 border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                        >
                            <option value="">Semua Keterukan</option>
                            <option value="critical">Kritikal</option>
                            <option value="high">Tinggi</option>
                            <option value="medium">Sederhana</option>
                            <option value="info">Maklumat</option>
                        </select>

                        <select
                            value={status}
                            onChange={e => { setStatus(e.target.value); applyFilters({ status: e.target.value }); }}
                            className="bg-gray-50 border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                        >
                            <option value="">Semua Status</option>
                            <option value="Baru">Baru</option>
                            <option value="Disemak">Disemak</option>
                            <option value="Diselesaikan">Diselesaikan</option>
                        </select>

                        <select
                            value={location}
                            onChange={e => { setLocation(e.target.value); applyFilters({ location: e.target.value }); }}
                            className="bg-gray-50 border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white flex-1"
                        >
                            <option value="">Semua Lokasi</option>
                            {locations.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                        </select>

                        <div className="sm:ml-auto flex flex-col sm:flex-row gap-2">
                            <button onClick={retrieveAlert} disabled={retrievingAlert} className="w-full sm:w-auto flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors">
                                {retrievingAlert ? 'Mengambil…' : 'Ambil Alert Terkini'}
                            </button>
                            <button
                                onClick={() => setShowSimulator(v => !v)}
                                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors shadow-sm"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                                Simulasi Event
                            </button>
                        </div>
                    </div>
                </div>

                {/* ── Simulator panel ── */}
                {showSimulator && (
                    <div className="bg-white border border-indigo-200 shadow-sm rounded-xl p-5 mb-5">
                        <h3 className="text-sm font-semibold text-indigo-900 mb-4 flex items-center gap-2">
                            <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.723v6.554a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
                            </svg>
                            CCTV AI Event Simulator
                        </h3>
                        <form onSubmit={submitSimulate} className="grid sm:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1.5">ID Murid</label>
                                <input
                                    type="text"
                                    placeholder="cth. STU-0001"
                                    value={data.student_id}
                                    onChange={e => setData('student_id', e.target.value)}
                                    className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                                />
                                {errors.student_id && <p className="text-red-600 text-xs mt-1">{errors.student_id}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1.5">Lokasi Kamera</label>
                                <select
                                    value={data.location_id}
                                    onChange={e => setData('location_id', e.target.value)}
                                    className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                                >
                                    <option value="">Pilih lokasi…</option>
                                    {locations.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-600 mb-1.5">Jenis Alert</label>
                                <select
                                    value={data.alert_code}
                                    onChange={e => setData('alert_code', e.target.value)}
                                    className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                                >
                                    <option value="">Pilih jenis alert…</option>
                                    {alertTypes.map(a => <option key={a.code} value={a.code}>{a.label}</option>)}
                                </select>
                            </div>

                            <div className="sm:col-span-3 flex gap-3">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors shadow-sm"
                                >
                                    {processing ? 'Menghantar…' : 'Hantar Event Simulasi'}
                                </button>
                                <button type="button" onClick={() => setShowSimulator(false)} className="text-sm text-gray-600 hover:text-gray-900 px-4 py-2.5 rounded-lg transition-colors">
                                    Batal
                                </button>
                            </div>

                            {errors.simulate && (
                                <p className="sm:col-span-3 text-red-600 text-sm">{errors.simulate}</p>
                            )}
                        </form>

                        {/* Quick fill hints */}
                        <div className="mt-4 pt-4 border-t border-gray-200">
                            <p className="text-xs text-gray-500">ID murid yang sah: STU-0001 hingga STU-0500</p>
                        </div>
                    </div>
                )}

                {/* ── Events count ── */}
                <p className="text-sm text-gray-600 mb-3 px-1">
                    <span className="text-gray-900 font-semibold">{events.length}</span> event dijumpai
                </p>

                {/* ── Event cards ── */}
                {events.length === 0 ? (
                    <div className="bg-white border border-gray-200 shadow-sm rounded-xl px-5 py-16 text-center">
                        <svg className="w-10 h-10 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 10l4.553-2.276A1 1 0 0121 8.723v6.554a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
                        </svg>
                        <p className="text-gray-500">Tiada event dijumpai untuk penapis yang dipilih.</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {visibleEvents.map(ev => {
                            const cfg = severityConfig[ev.severity] ?? severityConfig.info;
                            return (
                                <div key={ev.id} className="bg-white border border-gray-200 shadow-sm hover:border-gray-300 rounded-xl p-4 transition-colors">
                                    <div className="flex items-start gap-4">
                                        {/* Severity indicator */}
                                        <div className={`mt-1.5 w-2.5 h-2.5 rounded-full flex-shrink-0 ${cfg.dot} ring-4 ring-current ring-opacity-20`} />

                                        <div className="flex-1 min-w-0">
                                            <div className="flex flex-wrap items-center gap-2 mb-2">
                                                <span className="font-mono text-xs text-gray-500">{ev.id}</span>
                                                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${cfg.badge}`}>
                                                    {ev.alert_label}
                                                </span>
                                                <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium border ${eventStatusStyles[ev.status] ?? ''}`}>
                                                    {ev.status}
                                                </span>
                                            </div>

                                            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                                                <div className="flex-1">
                                                    <p className="text-gray-900 font-semibold">{ev.student_name}</p>
                                                    <p className="text-gray-500 text-sm">{ev.kelas}</p>
                                                </div>
                                                <div className="text-sm text-gray-600 space-y-0.5 sm:text-right">
                                                    <p>📍 {ev.location}</p>
                                                    <p>🕐 {ev.date} {ev.time}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <Link
                                            href={`/events?${new URLSearchParams({ ...filters, event: ev.id }).toString()}`}
                                            className="flex-shrink-0 flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
                                        >
                                            Semak
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </Link>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* ── Event detail modal/card ── */}
                {events.length > perPage && (
                    <div className="mt-5 flex items-center justify-between bg-gray-900 border border-gray-800 rounded-xl px-4 py-3">
                        <p className="text-xs text-gray-500">Halaman {currentPage} daripada {totalPages}</p>
                        <div className="flex items-center gap-1.5">
                            <button disabled={currentPage === 1} onClick={() => setCurrentPage(page => Math.max(1, page - 1))} className="px-3 py-1.5 rounded-lg text-xs text-gray-400 hover:text-white hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed">Sebelum</button>
                            {Array.from({ length: totalPages }, (_, index) => index + 1).map(page => <button key={page} onClick={() => setCurrentPage(page)} className={`w-8 h-8 rounded-lg text-xs font-medium ${currentPage === page ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}>{page}</button>)}
                            <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(page => Math.min(totalPages, page + 1))} className="px-3 py-1.5 rounded-lg text-xs text-gray-400 hover:text-white hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed">Seterusnya</button>
                        </div>
                    </div>
                )}

                {selectedEvent && (
                    <div id="event-detail" className="mt-6 bg-white border border-gray-200 shadow-md rounded-xl overflow-hidden">
                        <div className="p-5 border-b border-gray-200 bg-gray-50">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className={`w-2.5 h-2.5 rounded-full ${selectedCfg.dot}`} />
                                        <span className="font-mono text-sm text-gray-500">{selectedEvent.id}</span>
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${selectedCfg.badge}`}>{selectedCfg.label} · {selectedEvent.alert_label}</span>
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${eventStatusStyles[selectedEvent.status]}`}>{selectedEvent.status}</span>
                                    </div>
                                    <p className="text-gray-700 text-sm mt-2">{selectedEvent.description}</p>
                                </div>
                                <Link href="/events" className="text-xs font-medium text-gray-500 hover:text-gray-800">Tutup ×</Link>
                            </div>
                        </div>
                        <div className="grid md:grid-cols-2 gap-5 p-5">
                            <div>
                                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Maklumat Event</h3>
                                <div className="grid grid-cols-2 gap-3 text-sm">
                                    {[["ID Kamera", selectedEvent.camera_id], ["Lokasi", selectedEvent.location], ["Zon", selectedEvent.zone], ["Tarikh", selectedEvent.date], ["Masa", selectedEvent.time], ["Keyakinan AI", selectedEvent.confidence]].map(([label, value]) => (
                                        <div key={label} className="bg-gray-50 border border-gray-200/60 rounded-lg px-3 py-2">
                                            <p className="text-xs text-gray-500">{label}</p>
                                            <p className="text-gray-900 font-semibold">{value}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Pemetaan Murid</h3>
                                {selectedStudent ? (
                                    <div className="bg-gray-50 border border-gray-200/60 rounded-lg p-4">
                                        <p className="text-gray-900 font-bold">{selectedStudent.name}</p>
                                        <p className="text-gray-600 text-sm">{selectedStudent.kelas} · {selectedStudent.id}</p>
                                        <p className="text-gray-600 text-sm mt-2">{selectedStudent.status}</p>
                                        <Link href={`/students/${selectedStudent.id}`} className="inline-block mt-3 text-xs font-medium text-indigo-600 hover:text-indigo-800">Lihat profil murid →</Link>
                                    </div>
                                ) : (
                                    <p className="text-gray-500 text-sm">Profil murid tidak dijumpai.</p>
                                )}
                            </div>
                        </div>
                        {relatedEvents.length > 0 && (
                            <div className="px-5 pb-5 pt-2 border-t border-gray-100">
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Event lain murid sama</p>
                                <div className="flex flex-wrap gap-2">
                                    {relatedEvents.map(ev => (
                                        <Link key={ev.id} href={`/events?event=${ev.id}`} className="text-xs font-medium text-indigo-700 bg-indigo-50 border border-indigo-100 hover:bg-indigo-100 rounded-md px-2.5 py-1.5 transition-colors">
                                            {ev.id} · {ev.alert_label}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </Layout>
        </>
    );
}
