import { Head, Link, usePage } from '@inertiajs/react';
import Layout from '../Components/Layout';

export default function Dashboard({ stats, latestAlert }) {
    const { auth } = usePage().props;
    const userName = auth?.user?.name ?? 'Pengguna';

    const {
        total_students, total_classes, total_teachers, total_tingkatan,
        active_alerts, high_severity, resolved_today, in_action,
        by_tingkatan, by_gender,
        class_list, recent_activity,
    } = stats;

    return (
        <>
            <Head title="Dashboard" />
            <Layout title="Dashboard">

                {/* ── Welcome Banner ── */}
                <div
                    className="relative rounded-2xl overflow-hidden mb-6 bg-cover bg-center"
                    style={{ backgroundImage: "url('/images/hero_header.png')" }}
                >
                    {/* Dark overlay to ensure text contrast over any background image */}
                    <div className="absolute inset-0" />

                    <div className="relative z-10 px-7 py-6 flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-black mb-1">
                                Selamat Datang, {userName.split(' ')[0]}
                            </h1>
                            <p className="text-slate-500 text-sm max-w-sm drop-shadow-sm">
                                Bersama kita mewujudkan persekitaran sekolah yang lebih selamat, kondusif dan sejahtera.
                            </p>
                        </div>
                    </div>
                </div>

                {latestAlert && (
                    <div className="mb-6 bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
                        <span className="mt-1 w-2.5 h-2.5 rounded-full bg-amber-500 ring-4 ring-amber-200 flex-shrink-0" />
                        <div className="flex-1">
                            <p className="text-sm font-semibold text-amber-800">Alert CCTV AI Terkini</p>
                            <p className="text-sm text-amber-700 mt-0.5">{latestAlert.student_name} — {latestAlert.alert_label} di {latestAlert.location}</p>
                            <p className="text-xs text-amber-600 mt-1">{latestAlert.date} {latestAlert.time} · {latestAlert.status}</p>
                        </div>
                        <Link href={`/events?event=${latestAlert.id}`} className="text-xs text-amber-700 hover:text-amber-900 font-medium">Semak &rsaquo;</Link>
                    </div>
                )}

                {/* ── 4 Stat Cards ── */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <TopStatCard
                        label="Jumlah Murid"
                        value={total_students.toLocaleString()}
                        color="blue"
                        icon={<IconStudents />}
                    />
                    <TopStatCard
                        label="Jumlah Kelas"
                        value={total_classes}
                        color="green"
                        icon={<IconClasses />}
                    />
                    <TopStatCard
                        label="Jumlah Guru"
                        value={total_teachers}
                        color="orange"
                        icon={<IconTeacher />}
                    />
                    <TopStatCard
                        label="Jumlah Tingkatan"
                        value={total_tingkatan}
                        sub="Tingkatan 1 - 5"
                        color="purple"
                        icon={<IconBuilding />}
                    />
                </div>

                {/* ── Row 2: Bar chart | Donut chart | Aktiviti Terkini ── */}
                <div className="grid lg:grid-cols-3 gap-4 mb-4">

                    {/* Bar chart — Taburan mengikut Tingkatan */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                        <h2 className="text-sm font-semibold text-gray-700 mb-4">
                            Taburan Murid mengikut Tingkatan
                        </h2>
                        <BarChart data={by_tingkatan} />
                    </div>

                    {/* Donut chart — Taburan mengikut Jantina */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex flex-col">
                        <h2 className="text-sm font-semibold text-gray-700 mb-4">
                            Taburan Murid mengikut Jantina
                        </h2>
                        <div className="flex-1 flex items-center justify-center gap-8">
                            <DonutChart
                                total={total_students}
                                lelaki={by_gender['Lelaki'] ?? 0}
                                perempuan={by_gender['Perempuan'] ?? 0}
                            />
                            <div className="space-y-3 text-sm">
                                <div className="flex items-center gap-2">
                                    <span className="w-3 h-3 rounded-full bg-blue-400 flex-shrink-0" />
                                    <div>
                                        <p className="font-medium text-gray-700">Lelaki</p>
                                        <p className="text-gray-500">
                                            {(by_gender['Lelaki'] ?? 0).toLocaleString()}{' '}
                                            ({Math.round(((by_gender['Lelaki'] ?? 0) / total_students) * 100)}%)
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="w-3 h-3 rounded-full bg-rose-400 flex-shrink-0" />
                                    <div>
                                        <p className="font-medium text-gray-700">Perempuan</p>
                                        <p className="text-gray-500">
                                            {(by_gender['Perempuan'] ?? 0).toLocaleString()}{' '}
                                            ({Math.round(((by_gender['Perempuan'] ?? 0) / total_students) * 100)}%)
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Aktiviti Terkini */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-sm font-semibold text-gray-700">Aktiviti Terkini</h2>
                            <Link href="/events" className="text-xs text-blue-500 hover:text-blue-600 font-medium">
                                Lihat Semua &rsaquo;
                            </Link>
                        </div>
                        <div className="space-y-3">
                            {(recent_activity ?? []).map((item, idx) => (
                                <ActivityItem key={idx} item={item} />
                            ))}
                        </div>
                    </div>
                </div>

                {/* ── Row 3: Senarai Kelas | CCTV Map | Ringkasan Keselamatan ── */}
                <div className="grid lg:grid-cols-3 gap-4">

                    {/* Senarai Kelas */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-sm font-semibold text-gray-700">Senarai Kelas</h2>
                            <Link href="/students" className="text-xs text-blue-500 hover:text-blue-600 font-medium">
                                Lihat Semua &rsaquo;
                            </Link>
                        </div>
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-100">
                                    <th className="text-left pb-2 text-xs font-semibold text-gray-500">Kelas</th>
                                    <th className="text-left pb-2 text-xs font-semibold text-gray-500">Tingkatan</th>
                                    <th className="text-right pb-2 text-xs font-semibold text-gray-500">Bil. Murid</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {(class_list ?? []).map((cls) => (
                                    <tr key={cls.kelas}>
                                        <td className="py-2.5 font-medium text-gray-800">{cls.kelas.replace('Tingkatan ', '')}</td>
                                        <td className="py-2.5 text-gray-500">{cls.tingkatan.replace('Tingkatan ', '')}</td>
                                        <td className="py-2.5 text-right font-semibold text-gray-700">{cls.count}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* CCTV Map */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-sm font-semibold text-gray-700">Lokasi CCTV AI (Simulasi)</h2>
                            <Link href="/events" className="text-xs text-blue-500 hover:text-blue-600 font-medium">
                                Lihat Peta &rsaquo;
                            </Link>
                        </div>
                        <SchoolMap />
                    </div>

                    {/* Ringkasan Keselamatan */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                        <h2 className="text-sm font-semibold text-gray-700 mb-4">
                            Ringkasan Keselamatan (Simulasi)
                        </h2>
                        <div className="grid grid-cols-2 gap-3">
                            <SafetyStat
                                value={high_severity}
                                label="Kejadian Kritikal"
                                color="green"
                                icon={<IconCheck />}
                            />
                            <SafetyStat
                                value={active_alerts}
                                label="Amaran"
                                color="yellow"
                                icon={<IconWarning />}
                            />
                            <SafetyStat
                                value={stats.recent_events?.length ?? 5}
                                label="Jumlah Event Hari Ini"
                                color="blue"
                                icon={<IconInfo />}
                            />
                            <SafetyStat
                                value={in_action}
                                label="Dalam Tindakan"
                                color="gray"
                                icon={<IconClock />}
                            />
                        </div>
                    </div>
                </div>

            </Layout>
        </>
    );
}

/* ─────────────────────────────────────────────
   Sub-components
───────────────────────────────────────────── */

function TopStatCard({ label, value, sub, color, icon }) {
    const palette = {
        blue: { bg: 'bg-blue-100', icon: 'bg-blue-200 text-blue-500', val: 'text-blue-700' },
        green: { bg: 'bg-green-100', icon: 'bg-green-200 text-green-500', val: 'text-green-700' },
        orange: { bg: 'bg-orange-100', icon: 'bg-orange-200 text-orange-500', val: 'text-orange-700' },
        purple: { bg: 'bg-purple-100', icon: 'bg-purple-200 text-purple-500', val: 'text-purple-700' },
    };
    const p = palette[color] ?? palette.blue;
    return (
        <div className={`${p.bg} rounded-2xl p-5 flex items-center gap-4`}>
            <div className={`w-12 h-12 rounded-xl ${p.icon} flex items-center justify-center flex-shrink-0`}>
                {icon}
            </div>
            <div>
                <p className="text-xs text-gray-500 font-medium">{label}</p>
                <p className={`text-2xl font-bold ${p.val}`}>{value}</p>
                {sub && <p className="text-xs text-purple-400 mt-0.5">{sub}</p>}
            </div>
        </div>
    );
}

function BarChart({ data }) {
    const entries = Object.entries(data);
    const max = Math.max(...entries.map(([, v]) => v), 1);
    const chartH = 140;
    const barColors = ['#4f9cf9', '#34c38f', '#f6c343', '#8b5cf6', '#f87171'];

    return (
        <div>
            {/* Y-axis labels + bars */}
            <div className="flex items-end gap-2" style={{ height: chartH }}>
                {entries.map(([label, value], idx) => {
                    const barH = Math.round((value / max) * (chartH - 24));
                    return (
                        <div key={label} className="flex-1 flex flex-col items-center gap-1">
                            <span className="text-xs text-gray-500 font-medium">{value}</span>
                            <div
                                className="w-full rounded-t-md transition-all"
                                style={{ height: barH, backgroundColor: barColors[idx % barColors.length] }}
                            />
                        </div>
                    );
                })}
            </div>
            {/* X-axis labels */}
            <div className="flex gap-2 mt-1 border-t border-gray-100 pt-1">
                {entries.map(([label]) => (
                    <div key={label} className="flex-1 text-center text-xs text-gray-400">{label}</div>
                ))}
            </div>
        </div>
    );
}

function DonutChart({ total, lelaki, perempuan }) {
    const r = 48;
    const cx = 64;
    const cy = 64;
    const circumference = 2 * Math.PI * r;
    const lelakiPct = total > 0 ? lelaki / total : 0;
    const lelakiDash = lelakiPct * circumference;
    const perempuanDash = circumference - lelakiDash;

    return (
        <div className="relative flex-shrink-0" style={{ width: 128, height: 128 }}>
            <svg viewBox="0 0 128 128" width="128" height="128">
                {/* background ring */}
                <circle cx={cx} cy={cy} r={r} fill="none" stroke="#f3f4f6" strokeWidth="18" />
                {/* perempuan arc (rose) — drawn first, full circle as base */}
                <circle
                    cx={cx} cy={cy} r={r}
                    fill="none" stroke="#fb7185" strokeWidth="18"
                    strokeDasharray={`${perempuanDash} ${lelakiDash}`}
                    strokeDashoffset={0}
                    transform={`rotate(${-90 + lelakiPct * 360} ${cx} ${cy})`}
                />
                {/* lelaki arc (blue) */}
                <circle
                    cx={cx} cy={cy} r={r}
                    fill="none" stroke="#60a5fa" strokeWidth="18"
                    strokeDasharray={`${lelakiDash} ${perempuanDash}`}
                    strokeDashoffset={0}
                    transform={`rotate(-90 ${cx} ${cy})`}
                />
            </svg>
            {/* centre label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-lg font-bold text-gray-800">{total.toLocaleString()}</span>
                <span className="text-xs text-gray-400">Murid</span>
            </div>
        </div>
    );
}

const activityStyles = {
    critical: { dot: 'bg-red-500', icon: 'text-red-500', bg: 'bg-red-50' },
    high: { dot: 'bg-orange-500', icon: 'text-orange-500', bg: 'bg-orange-50' },
    medium: { dot: 'bg-yellow-500', icon: 'text-yellow-500', bg: 'bg-yellow-50' },
    info: { dot: 'bg-green-500', icon: 'text-green-500', bg: 'bg-green-50' },
};

function ActivityItem({ item }) {
    const s = activityStyles[item.severity] ?? activityStyles.info;
    return (
        <div className="flex items-start gap-3">
            <div className={`w-8 h-8 rounded-lg ${s.bg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                <svg className={`w-4 h-4 ${s.icon}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                        d="M15 10l4.553-2.276A1 1 0 0121 8.723v6.554a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
                </svg>
            </div>
            <div className="flex-1 min-w-0">
                <p className={`text-xs font-semibold ${s.icon} truncate`}>{item.title}</p>
                <p className="text-xs text-gray-500 truncate">{item.sub}</p>
            </div>
            <span className="text-xs text-gray-400 flex-shrink-0 mt-0.5">{item.time}</span>
        </div>
    );
}

function SafetyStat({ value, label, color, icon }) {
    const palette = {
        green: { val: 'text-green-600', bg: 'bg-green-50', ring: 'border-green-200' },
        yellow: { val: 'text-yellow-600', bg: 'bg-yellow-50', ring: 'border-yellow-200' },
        blue: { val: 'text-blue-600', bg: 'bg-blue-50', ring: 'border-blue-200' },
        gray: { val: 'text-gray-600', bg: 'bg-gray-50', ring: 'border-gray-200' },
    };
    const p = palette[color] ?? palette.gray;
    return (
        <div className={`${p.bg} border ${p.ring} rounded-xl p-3 flex items-center gap-3`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${p.bg} border ${p.ring}`}>
                <span className={p.val}>{icon}</span>
            </div>
            <div>
                <p className={`text-xl font-bold ${p.val}`}>{value}</p>
                <p className="text-xs text-gray-500 leading-tight">{label}</p>
            </div>
        </div>
    );
}

function SchoolMap() {
    return (
        <svg viewBox="0 0 280 180" className="w-full h-auto rounded-xl" style={{ background: '#e8f5e9' }}>
            {/* Ground / paths */}
            <rect x="0" y="0" width="280" height="180" rx="8" fill="#c8e6c9" />

            {/* Paths */}
            <rect x="90" y="0" width="16" height="180" fill="#a5d6a7" opacity="0.5" />
            <rect x="0" y="80" width="280" height="16" fill="#a5d6a7" opacity="0.5" />

            {/* Trees */}
            {[[20, 20], [240, 20], [20, 140], [240, 140], [20, 80], [240, 80], [130, 20], [130, 150]].map(([x, y], i) => (
                <g key={i} transform={`translate(${x},${y})`}>
                    <circle r="10" fill="#66bb6a" />
                    <circle r="7" cx="5" cy="-5" fill="#81c784" />
                </g>
            ))}

            {/* Blok A */}
            <rect x="110" y="10" width="60" height="40" rx="4" fill="#5c6bc0" />
            <text x="140" y="35" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">Blok A</text>
            {/* CCTV dot */}
            <circle cx="155" cy="14" r="4" fill="#1a237e" />
            <circle cx="155" cy="14" r="2" fill="white" />

            {/* Blok B */}
            <rect x="185" y="50" width="60" height="40" rx="4" fill="#5c6bc0" />
            <text x="215" y="75" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">Blok B</text>
            <circle cx="230" cy="54" r="4" fill="#1a237e" />
            <circle cx="230" cy="54" r="2" fill="white" />

            {/* Dewan */}
            <rect x="20" y="50" width="55" height="38" rx="4" fill="#ef5350" />
            <text x="47" y="73" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">Dewan</text>
            <circle cx="58" cy="54" r="4" fill="#b71c1c" />
            <circle cx="58" cy="54" r="2" fill="white" />

            {/* Kantin */}
            <rect x="20" y="115" width="55" height="35" rx="4" fill="#ff9800" />
            <text x="47" y="137" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">Kantin</text>
            <circle cx="56" cy="118" r="4" fill="#e65100" />
            <circle cx="56" cy="118" r="2" fill="white" />

            {/* Pintu Utama */}
            <rect x="185" y="115" width="70" height="35" rx="4" fill="#26a69a" />
            <text x="220" y="137" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">Pintu Utama</text>
            <circle cx="244" cy="118" r="4" fill="#004d40" />
            <circle cx="244" cy="118" r="2" fill="white" />

            {/* CCTV legend dot */}
            <circle cx="10" cy="170" r="4" fill="#1a237e" />
            <circle cx="10" cy="170" r="2" fill="white" />
            <text x="18" y="174" fill="#37474f" fontSize="7">Kamera CCTV AI</text>
        </svg>
    );
}

/* ── Icon helpers ── */
function IconStudents() {
    return (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
    );
}
function IconClasses() {
    return (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
    );
}
function IconTeacher() {
    return (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
    );
}
function IconBuilding() {
    return (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M3 21h18M3 10h18M3 7l9-4 9 4M4 10h1v11H4V10zm15 0h1v11h-1V10zM9 10h1v11H9V10zm5 0h1v11h-1V10z" />
        </svg>
    );
}
function IconCheck() {
    return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>;
}
function IconWarning() {
    return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /></svg>;
}
function IconInfo() {
    return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
}
function IconClock() {
    return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
}
