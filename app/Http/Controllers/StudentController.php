<?php

namespace App\Http\Controllers;

use App\Data\MockData;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StudentController extends Controller
{
    public function index(Request $request)
    {
        $students = MockData::students();

        // Server-side search/filter so we don't send 500 rows on every render
        $search    = $request->input('search', '');
        $tingkatan = $request->input('tingkatan', '');
        $kelas     = $request->input('kelas', '');
        $status    = $request->input('status', '');

        if ($search) {
            $students = array_values(array_filter($students, fn($s) =>
                str_contains(strtolower($s['name']), strtolower($search)) ||
                str_contains(strtolower($s['id']),   strtolower($search))
            ));
        }

        if ($tingkatan) {
            $students = array_values(array_filter($students, fn($s) => $s['tingkatan'] === $tingkatan));
        }

        if ($kelas) {
            $students = array_values(array_filter($students, fn($s) => $s['kelas'] === $kelas));
        }

        if ($status) {
            $students = array_values(array_filter($students, fn($s) => $s['status'] === $status));
        }

        // Paginate manually – send page slice
        $perPage  = 20;
        $page     = max(1, (int) $request->input('page', 1));
        $total    = count($students);
        $slice    = array_slice($students, ($page - 1) * $perPage, $perPage);

        // Build unique filter options from full dataset
        $allStudents = MockData::students();
        $tingkatanOptions = array_values(array_unique(array_column($allStudents, 'tingkatan')));
        $kelasOptions     = array_values(array_unique(array_column($allStudents, 'kelas')));
        sort($kelasOptions);

        return Inertia::render('Students/Index', [
            'students'         => $slice,
            'total'            => $total,
            'perPage'          => $perPage,
            'currentPage'      => $page,
            'tingkatanOptions' => $tingkatanOptions,
            'kelasOptions'     => $kelasOptions,
            'filters'          => compact('search', 'tingkatan', 'kelas', 'status'),
            'user'             => session('user'),
        ]);
    }

    public function show(string $id)
    {
        $students = MockData::students();
        $student  = null;
        foreach ($students as $s) {
            if ($s['id'] === $id) {
                $student = $s;
                break;
            }
        }

        if (! $student) {
            abort(404, 'Murid tidak dijumpai.');
        }

        // Get events related to this student
        $events = array_values(array_filter(MockData::events(), fn($e) => $e['student_id'] === $id));

        return Inertia::render('Students/Show', [
            'student' => $student,
            'events'  => $events,
            'user'    => session('user'),
        ]);
    }
}
