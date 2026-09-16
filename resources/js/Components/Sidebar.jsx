import { useState } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import navItems from './navConfig';

/**
 * Sidebar
 *
 * Props:
 *   open      {boolean}  – whether the sidebar is visible (mobile)
 *   onClose   {function} – called when a nav link is clicked on mobile
 */
export default function Sidebar({ open, onClose }) {
    const { auth } = usePage().props;
    const user = auth?.user;
    const currentPath = window.location.pathname;
    const currentSearch = window.location.search;

    // Track which parent menus are open; default-open if a child is active
    const [openMenus, setOpenMenus] = useState(() => {
        const initial = {};
        navItems.forEach((item) => {
            if (item.children) {
                const anyActive = item.children.some((child) => {
                    const [childPath, childQuery = ''] = child.href.split('?');
                    return (
                        currentPath === childPath &&
                        (!childQuery || currentSearch.includes(childQuery))
                    );
                });
                if (anyActive) initial[item.href] = true;
            }
        });
        return initial;
    });

    function toggleMenu(href) {
        setOpenMenus((prev) => ({ ...prev, [href]: !prev[href] }));
    }

    function isParentActive(item) {
        if (item.children) {
            return item.children.some((child) => {
                const [childPath] = child.href.split('?');
                return currentPath === childPath || currentPath.startsWith(childPath + '/');
            });
        }
        return currentPath === item.href || currentPath.startsWith(item.href + '/');
    }

    function isChildActive(child) {
        const [childPath, childQuery = ''] = child.href.split('?');
        const pathMatch = currentPath === childPath || currentPath.startsWith(childPath + '/');
        const queryMatch = !childQuery || currentSearch.includes(childQuery);
        return pathMatch && queryMatch;
    }

    return (
        <aside className={`
            fixed inset-y-0 left-0 z-30 flex flex-col w-64
            bg-white border-r border-gray-200
            transform transition-transform duration-200 ease-in-out
            ${open ? 'translate-x-0' : '-translate-x-full'}
            lg:relative lg:translate-x-0 lg:flex
        `}>
            {/* ── Graphic Header ── */}
            <div
                className="w-full h-32 flex-shrink-0 bg-cover bg-center"
                style={{ backgroundImage: "url('/images/sidebar_header.png')" }}
            />

            {/* ── Nav links ── */}
            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                {navItems.map((item) => {
                    const active = isParentActive(item);
                    const hasChildren = item.children && item.children.length > 0;
                    const isOpen = openMenus[item.href] ?? false;

                    if (hasChildren) {
                        return (
                            <div key={item.href}>
                                {/* Parent button — toggles submenu */}
                                <button
                                    onClick={() => toggleMenu(item.href)}
                                    className={`
                                        w-full flex items-center gap-3 px-3 py-2.5 rounded-lg
                                        text-sm font-medium transition-colors text-left
                                        ${active
                                            ? 'bg-indigo-50 text-indigo-700'
                                            : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'}
                                    `}
                                >
                                    <span className={`flex-shrink-0 ${active ? 'text-indigo-600' : 'text-gray-400'}`}>
                                        {item.icon}
                                    </span>
                                    <span className="flex-1">{item.label}</span>
                                    {/* Chevron */}
                                    <svg
                                        className={`w-4 h-4 flex-shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''} ${active ? 'text-indigo-600' : 'text-gray-400'}`}
                                        fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>

                                {/* Submenu */}
                                {isOpen && (
                                    <div className="mt-1 ml-4 pl-3 space-y-0.5">
                                        {item.children.map((child) => {
                                            const childActive = isChildActive(child);
                                            return (
                                                <Link
                                                    key={child.href}
                                                    href={child.href}
                                                    onClick={onClose}
                                                    className={`
                                                        flex items-center gap-2.5 px-3 py-2 rounded-lg
                                                        text-sm transition-colors
                                                        ${childActive
                                                            ? 'bg-indigo-50/50 text-indigo-700 font-medium'
                                                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 font-normal'}
                                                    `}
                                                >
                                                    <span className={`flex-shrink-0 ${childActive ? 'text-indigo-600' : 'text-gray-400'}`}>
                                                        {child.icon}
                                                    </span>
                                                    {child.label}
                                                </Link>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        );
                    }

                    // Regular link (no children)
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={onClose}
                            className={`
                                flex items-center gap-3 px-3 py-2.5 rounded-lg
                                text-sm font-medium transition-colors
                                ${active
                                    ? 'bg-indigo-50 text-indigo-700'
                                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'}
                            `}
                        >
                            <span className={active ? 'text-indigo-600' : 'text-gray-400'}>
                                {item.icon}
                            </span>
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            {/* ── Graphic Footer ── */}
            <div
                className="w-full h-80 flex-shrink-0 bg-cover bg-center"
                style={{ backgroundImage: "url('/images/sidebar_footer.png')" }}
            />
        </aside>
    );
}