import Link from 'next/link';
import {
  GraduationCap,
  CalendarCheck,
  Briefcase,
  FileText,
  Code2,
  Bot,
  ArrowRight,
} from 'lucide-react';

const features = [
  {
    icon: CalendarCheck,
    title: 'Attendance & Academics',
    description: 'Track attendance, timetables, assignments, exams, and CGPA in one place.',
  },
  {
    icon: Briefcase,
    title: 'Placements',
    description: 'Browse drives, check real-time eligibility, and apply with a single click.',
  },
  {
    icon: FileText,
    title: 'Resume & ATS Analyzer',
    description: 'Build a professional resume and score it against real job descriptions.',
  },
  {
    icon: Code2,
    title: 'DSA Practice',
    description: 'Sharpen your problem-solving with a growing bank of coding challenges.',
  },
  {
    icon: Bot,
    title: 'AI Campus Assistant',
    description: 'Ask questions, generate notes from PDFs, and take AI-built quizzes.',
  },
  {
    icon: GraduationCap,
    title: 'Role-based for Everyone',
    description: 'Dedicated dashboards for Students, Faculty, HODs, Admins, and Placement Officers.',
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <header className="border-b">
        <div className="mx-auto flex max-w-6xl items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <GraduationCap size={18} />
            </div>
            <span className="text-lg font-bold">CampusOS</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Login
            </Link>
            <Link
              href="/register"
              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-4xl px-4 py-24 text-center">
        <span className="inline-block rounded-full bg-muted px-4 py-1.5 text-sm font-medium text-muted-foreground">
          One platform for your entire university life
        </span>
        <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl">
          Everything about campus,
          <br />
          in one connected place.
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
          Attendance, academics, placements, resume tools, coding practice, and an AI
          assistant — built for students, faculty, and administrators alike.
        </p>
        <div className="mt-10 flex justify-center gap-4">
          <Link
            href="/register"
            className="flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            Create your account <ArrowRight size={16} />
          </Link>
          <Link
            href="/login"
            className="flex items-center rounded-md border px-6 py-3 text-sm font-medium hover:bg-muted"
          >
            I already have an account
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-4 pb-24">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div key={feature.title} className="rounded-2xl border p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon size={20} />
                </div>
                <h3 className="mt-4 font-semibold">{feature.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="mx-auto max-w-6xl px-4 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} CampusOS — Super Campus Platform
        </div>
      </footer>
    </div>
  );
}