'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  LayoutDashboard,
  Upload,
  History,
  Users,
  FileText,
  ClipboardList,
  Tags,
  LogOut,
  Mic,
} from 'lucide-react';

const studentLinks = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/upload', label: 'Upload Resume', icon: Upload },
  { href: '/interview/setup', label: 'Start Interview', icon: Mic },
  { href: '/history', label: 'History', icon: History },
];

const adminLinks = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/students', label: 'Students', icon: Users },
  { href: '/admin/resumes', label: 'Resumes', icon: FileText },
  { href: '/admin/interviews', label: 'Interviews', icon: ClipboardList },
  { href: '/admin/categories', label: 'Categories', icon: Tags },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const links = user?.role === 'admin' ? adminLinks : studentLinks;

  return (
    <>
      <aside className="hidden w-64 flex-shrink-0 border-r border-slate-200 bg-white md:flex md:flex-col">
        <div className="border-b border-slate-200 p-6">
          <h1 className="text-xl font-bold text-primary-700">AI Interview</h1>
          <p className="text-xs text-slate-500 capitalize">{user?.role} Portal</p>
        </div>
        <nav className="flex-1 space-y-1 p-4">
          {links.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
                pathname === href || pathname.startsWith(href + '/')
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Icon size={18} />
              {label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-slate-200 p-4">
          <p className="mb-2 truncate text-sm font-medium text-slate-700">{user?.name}</p>
          <button
            onClick={logout}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50"
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>

      <nav className="fixed bottom-0 left-0 right-0 z-40 flex border-t border-slate-200 bg-white md:hidden">
        {links.slice(0, 4).map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={`flex flex-1 flex-col items-center py-2 text-xs ${
              pathname === href ? 'text-primary-600' : 'text-slate-500'
            }`}
          >
            <Icon size={18} />
            <span className="mt-0.5 truncate px-1">{label.split(' ')[0]}</span>
          </Link>
        ))}
      </nav>
    </>
  );
}
