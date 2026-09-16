<?php

namespace App\Http\Controllers;

use App\Data\MockData;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AuthController extends Controller
{
    public function showLogin()
    {
        if (session('user')) {
            return redirect()->route('dashboard');
        }

        return Inertia::render('Login');
    }

    public function login(Request $request)
    {
        $request->validate([
            'email'    => 'required|email',
            'password' => 'required',
        ]);

        $users = MockData::users();
        $match = null;

        foreach ($users as $user) {
            if ($user['email'] === $request->email && $user['password'] === $request->password) {
                $match = $user;
                break;
            }
        }

        if (! $match) {
            return back()->withErrors(['email' => 'E-mel atau kata laluan tidak sah.']);
        }

        // Store user (without password) in session
        $session = $match;
        unset($session['password']);
        session(['user' => $session]);

        return redirect()->route('dashboard');
    }

    public function logout(Request $request)
    {
        $request->session()->forget('user');
        return redirect()->route('login');
    }
}
