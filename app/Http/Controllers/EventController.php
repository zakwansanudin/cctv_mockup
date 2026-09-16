<?php

namespace App\Http\Controllers;

use App\Data\MockData;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EventController extends Controller
{
    public function index(Request $request)
    {
        $allEvents = MockData::events();
        $events = $allEvents;

        $severity = $request->input('severity', '');
        $status   = $request->input('status', '');
        $location = $request->input('location', '');

        if ($severity) {
            $events = array_values(array_filter($events, fn($e) => $e['severity'] === $severity));
        }

        if ($status) {
            $events = array_values(array_filter($events, fn($e) => $e['status'] === $status));
        }

        if ($location) {
            $events = array_values(array_filter($events, fn($e) => $e['location_id'] === $location));
        }

        $selectedEvent = null;
        $selectedId = $request->input('event');
        if ($selectedId) {
            $selectedEvent = collect($allEvents)->firstWhere('id', $selectedId);
        }

        $student = $selectedEvent
            ? collect(MockData::students())->firstWhere('id', $selectedEvent['student_id'])
            : null;

        $relatedEvents = $selectedEvent
            ? array_values(array_filter($allEvents, fn ($e) => $e['student_id'] === $selectedEvent['student_id'] && $e['id'] !== $selectedEvent['id']))
            : [];

        return Inertia::render('Events/Index', [
            'events'     => $events,
            'locations'  => MockData::locations(),
            'alertTypes' => MockData::alertTypes(),
            'filters'    => compact('severity', 'status', 'location'),
            'selectedEvent' => $selectedEvent,
            'selectedStudent' => $student,
            'relatedEvents' => array_slice($relatedEvents, 0, 5),
            'user'       => session('user'),
        ]);
    }

    public function show(string $id)
    {
        return redirect()->route('events.index', ['event' => $id]);
    }

    /**
     * Simulate a new incoming CCTV AI event (POST).
     * In a real system this would come from the AI API.
     */
    public function simulate(Request $request)
    {
        $request->validate([
            'student_id'  => 'required',
            'location_id' => 'required',
            'alert_code'  => 'required',
        ]);

        $students    = MockData::students();
        $locations   = MockData::locations();
        $alertTypes  = MockData::alertTypes();

        $student  = collect($students)->firstWhere('id', $request->student_id);
        $location = collect($locations)->firstWhere('id', $request->location_id);
        $alert    = collect($alertTypes)->firstWhere('code', $request->alert_code);

        if (! $student || ! $location || ! $alert) {
            return back()->withErrors(['simulate' => 'Data tidak sah untuk simulasi.']);
        }

        // Build simulated event and flash it to session for display
        $simulated = [
            'id'           => 'SIM-' . strtoupper(substr(md5(uniqid()), 0, 6)),
            'student_id'   => $student['id'],
            'student_name' => $student['name'],
            'kelas'        => $student['kelas'],
            'location_id'  => $location['id'],
            'location'     => $location['name'],
            'zone'         => $location['zone'],
            'alert_code'   => $alert['code'],
            'alert_label'  => $alert['label'],
            'severity'     => $alert['severity'],
            'color'        => $alert['color'],
            'timestamp'    => now()->toDateTimeString(),
            'date'         => now()->format('d/m/Y'),
            'time'         => now()->format('H:i'),
            'status'       => 'Baru',
            'description'  => 'Simulasi: Murid ' . $student['name'] . ' dikesan di ' . $location['name'] . '. Jenis: ' . $alert['label'] . '.',
            'confidence'   => '92%',
            'camera_id'    => 'CAM-SIM',
        ];

        session(['simulated_event' => $simulated]);

        return redirect()->route('events.index')->with('simulated', $simulated);
    }
}
