'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  CalendarCheck,
  Calendar,
  BookOpen,
  GraduationCap,
  Briefcase,
  ClipboardList,
  FileText,
  Code2,
  MessageSquare,
  BarChart3,
  Bot,
  HelpCircle,
  Bed,
  UtensilsCrossed,
  AlertCircle,
  Search,
  ShoppingBag,
  PartyPopper,
  Bell,
  QrCode,
  ChevronLeft,
  ChevronRight,
  GraduationCap as Logo,
} from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
  disabled?: boolean;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const sections: NavSection[] = [
  {
    title: '',
    items: [{ label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard }],
  },
  {
    title: 'Student & Academics',
    items: [
      { label: 'Attendance Hub', href: '/dashboard/attendance', icon: CalendarCheck },
      { label: 'Timetable & Classes', href: '/dashboard/timetable', icon: Calendar },
      { label: 'Courses & Assignments', href: '/dashboard/assignments', icon: BookOpen },
      { label: 'Results & CGPA', href: '/dashboard/results', icon: GraduationCap },
    ],
  },
  {
    title: 'Placement & Career Cell',
    items: [
      { label: 'Company Drives & Jobs', href: '/dashboard/placements', icon: Briefcase },
      { label: 'Application Tracker', href: '/dashboard/placements/applications', icon: ClipboardList },
      { label: 'ATS Resume Analyzer', href: '/dashboard/ats', icon: FileText },
      { label: 'DSA Coding Arena', href: '/dashboard/coding', icon: Code2 },
      { label: 'AI Mock Interview Room', href: '/dashboard/interview', icon: MessageSquare, disabled: true },
      { label: 'Placement Statistics', href: '/dashboard/placements/stats', icon: BarChart3, disabled: true },
    ],
  },
  {
    title: 'AI Campus Intelligence',
    items: [
      { label: 'Campus AI Chat', href: '/dashboard/ai-assistant', icon: Bot },
      { label: 'PDF → Smart Notes', href: '/dashboard/notes', icon: FileText },
      { label: 'PDF / Topic → MCQ Quiz', href: '/dashboard/quizzes', icon: HelpCircle },
      { label: 'AI Exam Study Planner', href: '/dashboard/study-planner', icon: Calendar, disabled: true },
    ],
  },
  {
    title: 'Campus Living & Facilities',
    items: [
      { label: 'Hostel & Leave Outpass', href: '/dashboard/hostel', icon: Bed, disabled: true },
      { label: 'Mess Menu & Food Polls', href: '/dashboard/mess', icon: UtensilsCrossed, disabled: true },
      { label: 'Grievance / Complaints', href: '/dashboard/complaints', icon: AlertCircle, disabled: true },
      { label: 'Lost & Found Portal', href: '/dashboard/lost-found', icon: Search, disabled: true },
      { label: 'Campus Marketplace', href: '/dashboard/marketplace', icon: ShoppingBag, disabled: true },
      { label: 'Events & Club Hub', href: '/dashboard/events', icon: PartyPopper, disabled: true },
      { label: 'University Notices', href: '/dashboard/notices', icon: Bell, disabled: true },
    ],
  },
  {
    title: 'Smart Tech & Biometrics',
    items: [
      { label: 'Dynamic QR Attendance', href: '/dashboard/qr-attendance', icon: QrCode, disabled: true },
    ],
  },
];

export function Sidebar({ collapsed, onToggle }: { collapsed: boolean; onToggle: () => void }) {
  const pathname = usePathname();

  return (
    <aside
      className={`fixed left-0 top-0 z-40 h-screen border-r bg-background transition-all duration-200 ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      <div className="flex h-full flex-col">
        {/* Logo + collapse toggle */}
        <div className="flex items-center justify-between border-b p-4">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Logo size={18} />
              </div>
              <div>
                <p className="text-sm font-bold leading-tight">CampusOS</p>
                <p className="text-xs text-muted-foreground leading-tight">Super Campus</p>
              </div>
            </div>
          )}
          <button
            onClick={onToggle}
            className="rounded-md p-1.5 hover:bg-muted"
            aria-label="Toggle sidebar"
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        {/* Nav sections */}
        <nav className="flex-1 space-y-4 overflow-y-auto p-3">
          {sections.map((section, i) => (
            <div key={i}>
              {section.title && !collapsed && (
                <p className="mb-1 px-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {section.title}
                </p>
              )}
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;

                  if (item.disabled) {
                    return (
                      <div
                        key={item.href}
                        className="flex items-center gap-2 rounded-md px-2 py-2 text-sm text-muted-foreground/50 cursor-not-allowed"
                        title="Coming soon"
                      >
                        <Icon size={16} />
                        {!collapsed && (
                          <span className="flex-1 truncate">{item.label}</span>
                        )}
                        {!collapsed && (
                          <span className="rounded-full bg-muted px-1.5 py-0.5 text-[10px]">Soon</span>
                        )}
                      </div>
                    );
                  }

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-2 rounded-md px-2 py-2 text-sm transition-colors ${
                        isActive
                          ? 'bg-primary text-primary-foreground'
                          : 'text-foreground hover:bg-muted'
                      }`}
                    >
                      <Icon size={16} />
                      {!collapsed && <span className="flex-1 truncate">{item.label}</span>}
                      {!collapsed && item.badge && (
                        <span className="rounded-full bg-muted px-1.5 py-0.5 text-[10px]">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>
    </aside>
  );
}