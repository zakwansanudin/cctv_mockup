import { useState } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

/**
 * AppLayout
 *
 * The root shell for every authenticated page.
 * Owns the mobile sidebar open/close state and wires
 * Sidebar + Navbar + page content together.
 *
 * Props:
 *   title    {string}    – forwarded to Navbar as the page title
 *   children {ReactNode} – page body rendered inside <main>
 */
export default function AppLayout({ title, children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex h-screen bg-gray-100 overflow-hidden">

            {/* Mobile overlay — dims content when sidebar is open */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-20 bg-black/60 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Left column */}
            <Sidebar
                open={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />

            {/* Right column — navbar + scrollable page body */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <Navbar
                    title={title}
                    onMenuToggle={() => setSidebarOpen(true)}
                />

                <main className="flex-1 overflow-y-auto p-4 lg:p-6">
                    {children}
                </main>
            </div>

        </div>
    );
}
