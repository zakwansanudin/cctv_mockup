<?php

namespace App\Http\Controllers;

use App\Data\MockData;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $stats = MockData::dashboardStats();

        return Inertia::render('Dashboard', [
            'stats'     => $stats,
            'latestAlert' => $stats['recent_events'][0] ?? null,
            'locations' => MockData::locations(),
            'user'      => session('user'),
        ]);
    }

    public function classes()
    {
        $stats = MockData::dashboardStats();

        return Inertia::render('Classes/Index', [
            'classes' => $stats['class_list'],
            'user' => session('user'),
        ]);
    }

    public function reports()
    {
        $stats = MockData::dashboardStats();

        return Inertia::render('Reports/Index', [
            'stats' => $stats,
            'events' => array_slice(MockData::events(), 0, 12),
            'user' => session('user'),
        ]);
    }
}
