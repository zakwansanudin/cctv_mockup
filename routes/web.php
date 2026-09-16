<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\EventController;

// ─── Public ──────────────────────────────────────────────────────────────────

Route::get('/', fn () => redirect()->route('login'));

Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
Route::post('/login', [AuthController::class, 'login'])->name('login.post');
Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

// ─── Protected ───────────────────────────────────────────────────────────────

Route::middleware('auth.session')->group(function () {

    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('/classes', [DashboardController::class, 'classes'])->name('classes.index');
    Route::get('/reports', [DashboardController::class, 'reports'])->name('reports.index');

    // Students
    Route::get('/students',         [StudentController::class, 'index'])->name('students.index');
    Route::get('/students/{id}',    [StudentController::class, 'show'])->name('students.show');

    // CCTV Events
    Route::get('/events',           [EventController::class, 'index'])->name('events.index');
    Route::get('/events/{id}',      [EventController::class, 'show'])->name('events.show');
    Route::post('/events/simulate', [EventController::class, 'simulate'])->name('events.simulate');

});
