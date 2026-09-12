"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
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
  Users,
  Building2,
  Megaphone,
  ClipboardCheck,
  PenSquare,
} from "lucide-react";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  disabled?: boolean;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const studentSections: NavSection[] = [
  {
    title: "",
    items: [{ label: "Dashboard", href: "/dashboard", icon: LayoutDashboard }],
  },
  {
    title: "Student & Academics",
    items: [
      {
        label: "Attendance Hub",
        href: "/dashboard/attendance",
        icon: CalendarCheck,
      },
      {
        label: "Timetable & Classes",
        href: "/dashboard/timetable",
        icon: Calendar,
      },
      {
        label: "Courses & Assignments",
        href: "/dashboard/assignments",
        icon: BookOpen,
      },
      {
        label: "Results & CGPA",
        href: "/dashboard/results",
        icon: GraduationCap,
      },
    ],
  },
  {
    title: "Placement & Career Cell",
    items: [
      {
        label: "Company Drives & Jobs",
        href: "/dashboard/placements",
        icon: Briefcase,
      },
      {
        label: "Application Tracker",
        href: "/dashboard/placements/applications",
        icon: ClipboardList,
      },
      { label: "Resume Builder", href: "/dashboard/resumes", icon: FileText },
      { label: "ATS Resume Analyzer", href: "/dashboard/ats", icon: FileText },
      { label: "DSA Coding Arena", href: "/dashboard/coding", icon: Code2 },
      {
        label: "AI Exam Study Planner",
        href: "/dashboard/study-planner",
        icon: Calendar,
      },
      {
        label: "Placement Statistics",
        href: "/dashboard/placements/stats",
        icon: BarChart3,
        disabled: true,
      },
    ],
  },
  {
    title: "AI Campus Intelligence",
    items: [
      { label: "Campus AI Chat", href: "/dashboard/ai-assistant", icon: Bot },
      { label: "PDF → Smart Notes", href: "/dashboard/notes", icon: FileText },
      {
        label: "PDF / Topic → MCQ Quiz",
        href: "/dashboard/quizzes",
        icon: HelpCircle,
      },
      {
        label: "AI Exam Study Planner",
        href: "/dashboard/study-planner",
        icon: Calendar,
        disabled: true,
      },
    ],
  },
  {
    title: "Campus Living & Facilities",
    items: [
      {
        label: "Hostel & Leave Outpass",
        href: "/dashboard/hostel",
        icon: Bed,
        disabled: true,
      },
      {
        label: "Mess Menu & Food Polls",
        href: "/dashboard/mess",
        icon: UtensilsCrossed,
        disabled: true,
      },
      {
        label: "Grievance / Complaints",
        href: "/dashboard/complaints",
        icon: AlertCircle,
        disabled: true,
      },
      {
        label: "Lost & Found Portal",
        href: "/dashboard/lost-found",
        icon: Search,
        disabled: true,
      },
      {
        label: "Campus Marketplace",
        href: "/dashboard/marketplace",
        icon: ShoppingBag,
        disabled: true,
      },
      {
        label: "Events & Club Hub",
        href: "/dashboard/events",
        icon: PartyPopper,
        disabled: true,
      },
      {
        label: "University Notices",
        href: "/dashboard/notices",
        icon: Bell,
        disabled: true,
      },
    ],
  },
  {
    title: "Smart Tech & Biometrics",
    items: [
      {
        label: "Dynamic QR Attendance",
        href: "/dashboard/qr-attendance",
        icon: QrCode,
      },
    ],
  },
];

const facultySections: NavSection[] = [
  {
    title: "",
    items: [
      { label: "Dashboard", href: "/dashboard/faculty", icon: LayoutDashboard },
    ],
  },
  {
    title: "Teaching",
    items: [
      {
        label: "Take Attendance",
        href: "/dashboard/faculty/attendance",
        icon: CalendarCheck,
      },
      {
        label: "Assignments & Grading",
        href: "/dashboard/faculty/assignments",
        icon: PenSquare,
      },
      {
        label: "Exams & Results",
        href: "/dashboard/faculty/exams",
        icon: ClipboardCheck,
      },
    ],
  },
  {
    title: "DSA Platform",
    items: [
      {
        label: "Manage Coding Problems",
        href: "/dashboard/admin/coding-problems",
        icon: Code2,
      },
    ],
  },
];

const hodSections: NavSection[] = [
  {
    title: "",
    items: [
      { label: "Dashboard", href: "/dashboard/hod", icon: LayoutDashboard },
    ],
  },
  {
    title: "Teaching",
    items: [
      {
        label: "Take Attendance",
        href: "/dashboard/faculty/attendance",
        icon: CalendarCheck,
      },
      {
        label: "Assignments & Grading",
        href: "/dashboard/faculty/assignments",
        icon: PenSquare,
      },
      {
        label: "Exams & Results",
        href: "/dashboard/faculty/exams",
        icon: ClipboardCheck,
      },
    ],
  },
];

const placementSections: NavSection[] = [
  {
    title: "",
    items: [
      {
        label: "Dashboard",
        href: "/dashboard/placement",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    title: "Placement Management",
    items: [
      {
        label: "Companies",
        href: "/dashboard/admin/companies",
        icon: Building2,
      },
      {
        label: "Create Drive",
        href: "/dashboard/placement/drives",
        icon: Briefcase,
      },
    ],
  },
];

const adminSections: NavSection[] = [
  {
    title: "",
    items: [
      { label: "Dashboard", href: "/dashboard/admin", icon: LayoutDashboard },
    ],
  },
   {
    title: 'Academic Management',
    items: [
      { label: 'Departments', href: '/dashboard/admin/departments', icon: Building2 },
      { label: 'Subjects', href: '/dashboard/admin/subjects', icon: BookOpen },
      { label: 'Timetable', href: '/dashboard/admin/timetable', icon: Calendar },
    ],
  },

  {
    title: "Placement Management",
    items: [
      {
        label: "Companies",
        href: "/dashboard/admin/companies",
        icon: Building2,
      },
    ],
  },
  {
    title: "Platform",
    items: [
      {
        label: "Coding Problems",
        href: "/dashboard/admin/coding-problems",
        icon: Code2,
      },
      {
        label: "Announcements",
        href: "/dashboard/admin/announcements",
        icon: Megaphone,
      },
    ],
  },
  {
    title: "Coming Soon",
    items: [
      {
        label: "User Management",
        href: "/dashboard/admin/users",
        icon: Users,
        disabled: true,
      },
      {
        label: "Audit Logs",
        href: "/dashboard/admin/audit-logs",
        icon: FileText,
        disabled: true,
      },
    ],
  },
];

function getSectionsForRole(role?: string): NavSection[] {
  switch (role) {
    case "STUDENT":
      return studentSections;
    case "FACULTY":
      return facultySections;
    case "HOD":
      return hodSections;
    case "PLACEMENT_OFFICER":
      return placementSections;
    case "ADMIN":
    case "SUPER_ADMIN":
      return adminSections;
    default:
      return studentSections;
  }
}

export function Sidebar({
  collapsed,
  onToggle,
}: {
  collapsed: boolean;
  onToggle: () => void;
}) {
  const pathname = usePathname();
  const role = useAuthStore((state) => state.user?.role);
  const sections = getSectionsForRole(role);

  return (
    <aside
      className={`fixed left-0 top-0 z-40 h-screen border-r bg-background transition-all duration-200 ${
        collapsed ? "w-16" : "w-64"
      }`}
    >
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between border-b p-4">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <GraduationCap size={18} />
              </div>
              <div>
                <p className="text-sm font-bold leading-tight">CampusOS</p>
                <p className="text-xs text-muted-foreground leading-tight">
                  Super Campus
                </p>
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

        <TooltipProvider delayDuration={200}>
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
                      const disabledContent = (
                        <div
                          className={`flex items-center gap-2 rounded-md py-2 text-sm text-muted-foreground/50 cursor-not-allowed ${
                            collapsed ? "justify-center px-0" : "px-2"
                          }`}
                        >
                          <Icon size={18} className="shrink-0" />
                          {!collapsed && (
                            <span className="flex-1 truncate">
                              {item.label}
                            </span>
                          )}
                          {!collapsed && (
                            <span className="rounded-full bg-muted px-1.5 py-0.5 text-[10px]">
                              Soon
                            </span>
                          )}
                        </div>
                      );

                      if (collapsed) {
                        return (
                          <Tooltip key={item.href}>
                            <TooltipTrigger asChild>
                              {disabledContent}
                            </TooltipTrigger>
                            <TooltipContent side="right">
                              {item.label} (Coming soon)
                            </TooltipContent>
                          </Tooltip>
                        );
                      }

                      return <div key={item.href}>{disabledContent}</div>;
                    }

                    const linkContent = (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center gap-2 rounded-md py-2 text-sm transition-colors ${
                          isActive
                            ? "bg-primary text-primary-foreground"
                            : "text-foreground hover:bg-muted"
                        } ${collapsed ? "justify-center px-0" : "px-2"}`}
                      >
                        <Icon size={18} className="shrink-0" />
                        {!collapsed && (
                          <span className="flex-1 truncate">{item.label}</span>
                        )}
                      </Link>
                    );

                    if (collapsed) {
                      return (
                        <Tooltip key={item.href}>
                          <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                          <TooltipContent side="right">
                            {item.label}
                          </TooltipContent>
                        </Tooltip>
                      );
                    }

                    return linkContent;
                  })}
                </div>
              </div>
            ))}
          </nav>
        </TooltipProvider>
      </div>
    </aside>
  );
}
