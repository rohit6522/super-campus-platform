import { GraduationCap, BookOpen, Users, Award } from 'lucide-react';

export function AuthBrandPanel() {
  return (
    <div className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-indigo-600 via-blue-600 to-purple-700 p-10 text-white lg:flex lg:w-1/2">
      <div>
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20">
            <GraduationCap size={22} />
          </div>
          <span className="text-xl font-bold">CampusOS</span>
        </div>

        <h1 className="mt-16 text-4xl font-bold leading-tight">
          Welcome back!
          <br />
          Access your classes, grades, events & resources.
        </h1>
        <p className="mt-4 text-white/80">
          Attendance, results, placements, AI assistant & more — all in one place.
        </p>
      </div>

      {/* Decorative floating cards, matching the "campus" feel without hotlinking any image */}
      <div className="relative mt-10 grid grid-cols-2 gap-4">
        <div className="rounded-xl bg-white/10 p-4 backdrop-blur-sm">
          <BookOpen size={20} className="mb-2" />
          <p className="text-sm font-medium">Courses & Attendance</p>
        </div>
        <div className="rounded-xl bg-white/10 p-4 backdrop-blur-sm">
          <Award size={20} className="mb-2" />
          <p className="text-sm font-medium">Placements & Results</p>
        </div>
        <div className="rounded-xl bg-white/10 p-4 backdrop-blur-sm">
          <Users size={20} className="mb-2" />
          <p className="text-sm font-medium">Faculty & Community</p>
        </div>
        <div className="rounded-xl bg-white/10 p-4 backdrop-blur-sm">
          <GraduationCap size={20} className="mb-2" />
          <p className="text-sm font-medium">AI-Powered Learning</p>
        </div>
      </div>

      <p className="text-xs text-white/60">© {new Date().getFullYear()} CampusOS — Super Campus Platform</p>
    </div>
  );
}