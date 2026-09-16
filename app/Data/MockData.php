<?php

namespace App\Data;

class MockData
{
    // -------------------------------------------------------------------------
    // Users (Admin & Guru) – used for login simulation (no DB)
    // -------------------------------------------------------------------------
    public static function users(): array
    {
        return [
            [
                'id'       => 1,
                'name'     => 'Ahmad Fadzillah',
                'email'    => 'admin@sekolah.edu.my',
                'password' => 'admin123',
                'role'     => 'Admin',
                'avatar'   => 'AF',
            ],
            [
                'id'       => 2,
                'name'     => 'Cikgu Rosnah',
                'email'    => 'guru@sekolah.edu.my',
                'password' => 'guru123',
                'role'     => 'Guru',
                'avatar'   => 'CR',
            ],
        ];
    }

    // -------------------------------------------------------------------------
    // Locations / Camera points
    // -------------------------------------------------------------------------
    public static function locations(): array
    {
        return [
            ['id' => 'LOC-01', 'name' => 'Pintu Pagar Utama',      'zone' => 'Kawasan Masuk'],
            ['id' => 'LOC-02', 'name' => 'Kantin Sekolah',          'zone' => 'Kawasan Tengah'],
            ['id' => 'LOC-03', 'name' => 'Koridor Blok A',          'zone' => 'Blok Akademik'],
            ['id' => 'LOC-04', 'name' => 'Koridor Blok B',          'zone' => 'Blok Akademik'],
            ['id' => 'LOC-05', 'name' => 'Tandas Pelajar Lelaki',   'zone' => 'Kawasan Sanitasi'],
            ['id' => 'LOC-06', 'name' => 'Tandas Pelajar Perempuan','zone' => 'Kawasan Sanitasi'],
            ['id' => 'LOC-07', 'name' => 'Padang Sekolah',          'zone' => 'Kawasan Luar'],
            ['id' => 'LOC-08', 'name' => 'Bilik Guru',              'zone' => 'Pentadbiran'],
            ['id' => 'LOC-09', 'name' => 'Perpustakaan',            'zone' => 'Blok Akademik'],
            ['id' => 'LOC-10', 'name' => 'Pintu Belakang',          'zone' => 'Kawasan Masuk'],
        ];
    }

    // -------------------------------------------------------------------------
    // Alert types
    // -------------------------------------------------------------------------
    public static function alertTypes(): array
    {
        return [
            ['code' => 'PONTENG',   'label' => 'Ponteng Kelas',        'severity' => 'high',   'color' => 'red'],
            ['code' => 'LEWAT',     'label' => 'Kemasukan Lewat',       'severity' => 'medium', 'color' => 'yellow'],
            ['code' => 'KAWASAN',   'label' => 'Kawasan Larangan',      'severity' => 'high',   'color' => 'red'],
            ['code' => 'PERGADUHAN','label' => 'Pergaduhan',            'severity' => 'critical','color' => 'purple'],
            ['code' => 'KELUAR',    'label' => 'Keluar Tanpa Kebenaran','severity' => 'high',   'color' => 'orange'],
            ['code' => 'VANDALISME','label' => 'Vandalisme',            'severity' => 'high',   'color' => 'red'],
            ['code' => 'NORMAL',    'label' => 'Aktiviti Normal',       'severity' => 'info',   'color' => 'green'],
        ];
    }

    // -------------------------------------------------------------------------
    // Students (500 records generated deterministically)
    // -------------------------------------------------------------------------
    public static function students(): array
    {
        $maleNames = [
            'Muhammad Aiman','Ahmad Danial','Muhd Haziq','Nur Aqmal','Aizat Hafizi',
            'Faris Irfan','Zulhafiz','Idris Syafiq','Harith Ridhwan','Azri Hafizuddin',
            'Syahmi Izzuddin','Fikri Amsyar','Razif Haiqal','Danish Arif','Zafran Izzat',
            'Irfan Hariz','Luqmanul Hakim','Ashraf Imran','Hafeez Aiman','Sufian Haikal',
        ];
        $femaleNames = [
            'Nur Syafiqah','Siti Aisyah','Nurul Hidayah','Fatin Nadhirah','Izzatul Husna',
            'Nabilah Arisya','Siti Hajar','Nur Insyirah','Rabiatul Adawiyah','Ummi Kalsum',
            'Siti Khadijah','Nur Afrina','Sharifah Amira','Fadhilah Husna','Zulaikha Iman',
            'Nurhayati Saadah','Aina Batrisyia','Shazwani Humaira','Nurfarhana','Liyana Sofea',
        ];
        $surnames = [
            'bin Abdullah','bin Mohd Nasir','bin Ismail','bin Othman','bin Razali',
            'bin Zainal','bin Hamdan','bin Yusof','binti Abdullah','binti Ahmad',
            'binti Hassan','binti Idris','binti Zainudin','binti Kamaruddin','binti Salleh',
        ];
        $classes = ['1A','1B','1C','2A','2B','2C','3A','3B','3C','4A','4B','4C','5A','5B','5C'];
        $tingkatan = ['Tingkatan 1','Tingkatan 2','Tingkatan 3','Tingkatan 4','Tingkatan 5'];
        $statuses  = ['Aktif','Aktif','Aktif','Aktif','Amaran','Amaran','Pantau'];
        $genders   = ['Lelaki','Perempuan'];

        $students = [];
        for ($i = 1; $i <= 500; $i++) {
            $gender    = $genders[($i % 2)];
            $namePool  = $gender === 'Lelaki' ? $maleNames : $femaleNames;
            $firstName = $namePool[$i % count($namePool)];
            $surname   = $surnames[$i % count($surnames)];
            $tingk     = $tingkatan[($i % 5)];
            $class     = $classes[($i % count($classes))];
            $status    = $statuses[$i % count($statuses)];

            $students[] = [
                'id'        => 'STU-' . str_pad($i, 4, '0', STR_PAD_LEFT),
                'name'      => $firstName . ' ' . $surname,
                'gender'    => $gender,
                'tingkatan' => $tingk,
                'kelas'     => $tingk . ' ' . $class,
                'ic'        => '08' . str_pad($i * 13, 10, '0', STR_PAD_LEFT),
                'age'       => 13 + ($i % 5),
                'wali'      => 'Encik/Puan ' . $surnames[($i + 3) % count($surnames)],
                'telefon'   => '011-' . str_pad($i * 17 % 100000000, 8, '0', STR_PAD_LEFT),
                'status'    => $status,
                'avatar'    => strtoupper(substr($firstName, 0, 2)),
            ];
        }

        return $students;
    }

    // -------------------------------------------------------------------------
    // CCTV Events (simulated alerts)
    // -------------------------------------------------------------------------
    public static function events(): array
    {
        $students    = self::students();
        $locations   = self::locations();
        $alertTypes  = self::alertTypes();
        $statuses    = ['Baru', 'Baru', 'Disemak', 'Diselesaikan'];

        // Base timestamp: today minus up to 7 days
        $baseTime = mktime(7, 0, 0); // 7am today

        $events = [];
        for ($i = 1; $i <= 80; $i++) {
            $student   = $students[($i * 7) % count($students)];
            $location  = $locations[$i % count($locations)];
            $alertType = $alertTypes[$i % count($alertTypes)];
            $offset    = ($i * 1800) % (7 * 86400); // spread over 7 days, 30-min steps
            $timestamp = $baseTime - $offset;

            $events[] = [
                'id'          => 'EVT-' . str_pad($i, 4, '0', STR_PAD_LEFT),
                'student_id'  => $student['id'],
                'student_name'=> $student['name'],
                'kelas'       => $student['kelas'],
                'location_id' => $location['id'],
                'location'    => $location['name'],
                'zone'        => $location['zone'],
                'alert_code'  => $alertType['code'],
                'alert_label' => $alertType['label'],
                'severity'    => $alertType['severity'],
                'color'       => $alertType['color'],
                'timestamp'   => date('Y-m-d H:i:s', $timestamp),
                'date'        => date('d/m/Y', $timestamp),
                'time'        => date('H:i', $timestamp),
                'status'      => $statuses[$i % count($statuses)],
                'description' => 'Murid ' . $student['name'] . ' dikesan oleh sistem AI CCTV di ' . $location['name'] . ' pada ' . date('H:i', $timestamp) . '. Jenis alert: ' . $alertType['label'] . '.',
                'confidence'  => (75 + ($i * 3) % 25) . '%',
                'camera_id'   => 'CAM-' . str_pad(($i % 10) + 1, 2, '0', STR_PAD_LEFT),
            ];
        }

        // Sort newest first
        usort($events, fn($a, $b) => strtotime($b['timestamp']) - strtotime($a['timestamp']));

        return $events;
    }

    // -------------------------------------------------------------------------
    // Dashboard summary stats
    // -------------------------------------------------------------------------
    public static function dashboardStats(): array
    {
        $students = self::students();
        $events   = self::events();

        $totalStudents = count($students);
        $activeAlerts  = count(array_filter($events, fn($e) => $e['status'] === 'Baru'));
        $highSeverity  = count(array_filter($events, fn($e) => in_array($e['severity'], ['high','critical']) && $e['status'] === 'Baru'));
        $resolved      = count(array_filter($events, fn($e) => $e['status'] === 'Diselesaikan'));
        $inAction      = count(array_filter($events, fn($e) => $e['status'] === 'Disemak'));

        // Students by tingkatan (T1–T5)
        $byTingkatan = ['T1' => 0, 'T2' => 0, 'T3' => 0, 'T4' => 0, 'T5' => 0];
        foreach ($students as $s) {
            $map = [
                'Tingkatan 1' => 'T1', 'Tingkatan 2' => 'T2', 'Tingkatan 3' => 'T3',
                'Tingkatan 4' => 'T4', 'Tingkatan 5' => 'T5',
            ];
            $key = $map[$s['tingkatan']] ?? null;
            if ($key) $byTingkatan[$key]++;
        }

        // Students by gender
        $byGender = ['Lelaki' => 0, 'Perempuan' => 0];
        foreach ($students as $s) {
            $byGender[$s['gender']] = ($byGender[$s['gender']] ?? 0) + 1;
        }

        // Class list (unique kelas → tingkatan, student count)
        $classMap = [];
        foreach ($students as $s) {
            $key = $s['kelas'];
            if (!isset($classMap[$key])) {
                $classMap[$key] = ['kelas' => $s['kelas'], 'tingkatan' => $s['tingkatan'], 'count' => 0];
            }
            $classMap[$key]['count']++;
        }
        // Sort by kelas name and take first 5
        ksort($classMap);
        $classList = array_values(array_slice($classMap, 0, 5));

        $byAlert = [];
        foreach ($events as $e) {
            $byAlert[$e['alert_label']] = ($byAlert[$e['alert_label']] ?? 0) + 1;
        }
        arsort($byAlert);

        $byStatus = ['Aktif' => 0, 'Amaran' => 0, 'Pantau' => 0];
        foreach ($students as $s) {
            $byStatus[$s['status']] = ($byStatus[$s['status']] ?? 0) + 1;
        }

        // Recent activity feed (mix of events as activity items)
        $recentActivity = array_map(fn($e) => [
            'type'    => $e['severity'] === 'critical' ? 'alert' : 'event',
            'title'   => $e['alert_label'],
            'sub'     => 'Murid dikesan di ' . explode(' ', $e['location'])[0] . ' ' . (explode(' ', $e['location'])[1] ?? ''),
            'time'    => $e['time'] . ' ' . (intval($e['time']) < 12 ? 'pagi' : 'petang'),
            'severity'=> $e['severity'],
        ], array_slice($events, 0, 5));

        return [
            'total_students'  => $totalStudents,
            'total_classes'   => count($classMap),
            'total_teachers'  => 75,   // simulated
            'total_tingkatan' => 5,
            'active_alerts'   => $activeAlerts,
            'high_severity'   => $highSeverity,
            'resolved_today'  => $resolved,
            'in_action'       => $inAction,
            'by_status'       => $byStatus,
            'by_tingkatan'    => $byTingkatan,
            'by_gender'       => $byGender,
            'class_list'      => $classList,
            'top_alerts'      => array_slice($byAlert, 0, 5, true),
            'recent_activity' => $recentActivity,
            'recent_events'   => array_slice($events, 0, 10),
        ];
    }
}
