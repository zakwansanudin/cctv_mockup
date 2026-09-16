import { Head, Link, router } from '@inertiajs/react';
import { useState, useCallback } from 'react';
import Layout from '../../Components/Layout';

const statusStyles = {
    Aktif:  'bg-green-100 text-green-800 border-green-200',
    Amaran: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    Pantau: 'bg-red-100 text-red-800 border-red-200',
};

const genderIcon = {
    Lelaki:    '♂',
    Perempuan: '♀',
};

export default function StudentsIndex({
    students, total, perPage, currentPage,
    tingkatanOptions, kelasOptions, filters,
}) {
    const [search,    setSearch]    = useState(filters.search    ?? '');
    const [tingkatan, setTingkatan] = useState(filters.tingkatan ?? '');
    const [kelas,     setKelas]     = useState(filters.kelas     ?? '');
    const [status,    setStatus]    = useState(filters.status    ?? '');

    const totalPages = Math.ceil(total / perPage);

    const applyFilters = useCallback((overrides = {}) => {
        const params = {
            search:    overrides.search    ?? search,
            tingkatan: overrides.tingkatan ?? tingkatan,
            kelas:     overrides.kelas     ?? kelas,
            status:    overrides.status    ?? status,
            page:      overrides.page      ?? 1,
        };
        // Strip empty params
        Object.keys(params).forEach(k => { if (!params[k]) delete params[k]; });
        router.get('/students', params, { preserveState: true, replace: true });
    }, [search, tingkatan, kelas, status]);

    function handleSearchKey(e) {
        if (e.key === 'Enter') applyFilters();
    }

    function clearFilters() {
        setSearch(''); setTingkatan(''); setKelas(''); setStatus('');
        router.get('/students', {}, { preserveState: false, replace: true });
    }

    const hasFilters = search || tingkatan || kelas || status;

    return (
        <>
            <Head title="Profil Murid" />
            <Layout title="Profil Murid">

                {/* ── Search & Filter bar ── */}
                <div className="bg-white border border-gray-200 rounded-xl p-4 mb-5 shadow-sm">
                    <div className="flex flex-col sm:flex-row gap-3">
                        {/* Search */}
                        <div className="relative flex-1">
                            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
                            </svg>
                            <input
                                type="text"
                                placeholder="Cari nama atau ID murid…"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                onKeyDown={handleSearchKey}
                                className="w-full bg-gray-50 border border-gray-300 rounded-lg pl-9 pr-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
                            />
                        </div>

                        {/* Filters */}
                        <select
                            value={tingkatan}
                            onChange={e => { setTingkatan(e.target.value); applyFilters({ tingkatan: e.target.value }); }}
                            className="bg-gray-50 border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                        >
                            <option value="">Semua Tingkatan</option>
                            {tingkatanOptions.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>

                        <select
                            value={kelas}
                            onChange={e => { setKelas(e.target.value); applyFilters({ kelas: e.target.value }); }}
                            className="bg-gray-50 border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                        >
                            <option value="">Semua Kelas</option>
                            {kelasOptions.map(k => <option key={k} value={k}>{k}</option>)}
                        </select>

                        <select
                            value={status}
                            onChange={e => { setStatus(e.target.value); applyFilters({ status: e.target.value }); }}
                            className="bg-gray-50 border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                        >
                            <option value="">Semua Status</option>
                            <option value="Aktif">Aktif</option>
                            <option value="Amaran">Amaran</option>
                            <option value="Pantau">Pantau</option>
                        </select>

                        <button
                            onClick={() => applyFilters()}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors flex-shrink-0 shadow-sm"
                        >
                            Cari
                        </button>
                    </div>

                    {hasFilters && (
                        <button onClick={clearFilters} className="mt-3 text-xs text-gray-500 hover:text-red-600 transition-colors">
                            ✕ Padam semua penapis
                        </button>
                    )}
                </div>

                {/* ── Result count ── */}
                <div className="flex items-center justify-between mb-3 px-1">
                    <p className="text-sm text-gray-600">
                        Menunjukkan <span className="text-gray-900 font-medium">{students.length}</span> daripada{' '}
                        <span className="text-gray-900 font-medium">{total}</span> rekod murid
                    </p>
                    <p className="text-sm text-gray-500">Halaman {currentPage} / {totalPages}</p>
                </div>

                {/* ── Table ── */}
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden mb-5 shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-gray-50/75 border-b border-gray-200">
                                    {['ID', 'Nama Murid', 'Kelas', 'Jantina', 'Umur', 'Status', ''].map(h => (
                                        <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {students.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="px-5 py-12 text-center text-gray-500">
                                            Tiada rekod murid dijumpai.
                                        </td>
                                    </tr>
                                ) : students.map(s => (
                                    <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-5 py-3 font-mono text-xs text-gray-500 whitespace-nowrap">{s.id}</td>
                                        <td className="px-5 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-indigo-100 border border-indigo-200 flex items-center justify-center text-xs font-bold text-indigo-700 flex-shrink-0">
                                                    {s.avatar}
                                                </div>
                                                <div>
                                                    <p className="text-gray-900 font-medium">{s.name}</p>
                                                    <p className="text-gray-500 text-xs">{s.ic}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-5 py-3 text-gray-600 whitespace-nowrap">{s.kelas}</td>
                                        <td className="px-5 py-3 text-gray-600 text-center">
                                            <span title={s.gender}>{genderIcon[s.gender] ?? '—'}</span>
                                        </td>
                                        <td className="px-5 py-3 text-gray-600 text-center">{s.age}</td>
                                        <td className="px-5 py-3">
                                            <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium border ${statusStyles[s.status] ?? 'bg-gray-100 text-gray-600 border-gray-200'}`}>
                                                {s.status}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3 text-right">
                                            <Link href={`/students/${s.id}`} className="text-xs font-medium text-indigo-600 hover:text-indigo-800 whitespace-nowrap">
                                                Lihat Profil →
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* ── Pagination ── */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-1">
                        <PageBtn
                            disabled={currentPage <= 1}
                            onClick={() => applyFilters({ page: currentPage - 1 })}
                            label="‹ Sebelum"
                        />
                        {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                            let p;
                            if (totalPages <= 7) {
                                p = i + 1;
                            } else if (currentPage <= 4) {
                                p = i + 1;
                            } else if (currentPage >= totalPages - 3) {
                                p = totalPages - 6 + i;
                            } else {
                                p = currentPage - 3 + i;
                            }
                            return (
                                <button
                                    key={p}
                                    onClick={() => applyFilters({ page: p })}
                                    className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                                        p === currentPage
                                            ? 'bg-indigo-600 text-white shadow-sm'
                                            : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                    }`}
                                >
                                    {p}
                                </button>
                            );
                        })}
                        <PageBtn
                            disabled={currentPage >= totalPages}
                            onClick={() => applyFilters({ page: currentPage + 1 })}
                            label="Seterus ›"
                        />
                    </div>
                )}
            </Layout>
        </>
    );
}

function PageBtn({ onClick, disabled, label }) {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className="px-3 h-9 rounded-lg text-sm font-medium bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-gray-900 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm"
        >
            {label}
        </button>
    );
}