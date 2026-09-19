"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  Search,
  Bell,
  Bot,
  QrCode,
  LogOut,
  User,
  ChevronDown,
  BookOpen,
  Briefcase,
  Code2,
  Megaphone,
} from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/auth-store";
import { search as searchApi } from "@/lib/api/search";
import { useAnnouncements } from "@/hooks/queries/use-announcements";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const typeIcons: Record<string, React.ElementType> = {
  subject: BookOpen,
  company: Briefcase,
  "coding-problem": Code2,
  announcement: Megaphone,
};

export function Topbar({ sidebarCollapsed }: { sidebarCollapsed: boolean }) {
  const user = useAuthStore((state) => state.user);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const queryClient = useQueryClient();
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const { data: searchResults, isFetching: searchLoading } = useQuery({
    queryKey: ["global-search", searchQuery],
    queryFn: () => searchApi(searchQuery),
    enabled: searchQuery.trim().length >= 2,
  });

  const { data: announcements } = useAnnouncements(5);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target as Node)
      ) {
        setShowResults(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    clearAuth();
    queryClient.clear();
    router.push("/login");
  };

  const handleResultClick = (href: string) => {
    setShowResults(false);
    setSearchQuery("");
    router.push(href);
  };

  return (
    <header
      className={`sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background px-6 transition-all duration-200 ${
        sidebarCollapsed ? "ml-16" : "ml-64"
      }`}
    >
           <div ref={searchContainerRef} className="relative hidden w-full max-w-md sm:block">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        <input
          className="h-9 w-full rounded-md border border-input bg-muted/30 pl-9 pr-3 text-sm outline-none"
          placeholder="Search subjects, drives, notes, faculty, rooms..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setShowResults(true);
          }}
          onFocus={() => setShowResults(true)}
        />

        {showResults && searchQuery.trim().length >= 2 && (
          <div className="absolute left-0 top-11 z-50 w-full rounded-md border bg-background shadow-lg">
            {searchLoading ? (
              <p className="p-3 text-sm text-muted-foreground">Searching...</p>
            ) : searchResults && searchResults.length > 0 ? (
              <div className="max-h-80 overflow-y-auto py-1">
                {searchResults.map((result) => {
                  const Icon = typeIcons[result.type] ?? Search;
                  return (
                    <button
                      key={`${result.type}-${result.id}`}
                      onClick={() => handleResultClick(result.href)}
                      className="flex w-full items-center gap-3 px-3 py-2 text-left text-sm hover:bg-muted"
                    >
                      <Icon size={14} className="text-muted-foreground" />
                      <div>
                        <p className="font-medium">{result.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {result.subtitle}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <p className="p-3 text-sm text-muted-foreground">
                No results found.
              </p>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center gap-3">
        <Button size="sm" variant="outline" className="gap-1.5">
          <Bot size={14} /> Ask Campus AI
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="gap-1.5"
          onClick={() => router.push("/dashboard/qr-attendance")}
        >
          <QrCode size={14} /> QR Check-in
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="relative rounded-full p-2 hover:bg-muted">
              <Bell size={18} />
              {announcements && announcements.length > 0 && (
                <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <div className="px-3 py-2 text-sm font-semibold">Notifications</div>
            <DropdownMenuSeparator />
            {announcements && announcements.length > 0 ? (
              announcements.map((a) => (
                <DropdownMenuItem
                  key={a._id}
                  className="flex-col items-start gap-0.5 whitespace-normal"
                >
                  <p className="text-sm font-medium">{a.title}</p>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {a.content}
                  </p>
                </DropdownMenuItem>
              ))
            ) : (
              <p className="px-3 py-2 text-sm text-muted-foreground">
                No new notifications.
              </p>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 rounded-md pl-2 pr-1 py-1 hover:bg-muted">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-sm font-medium">
                {user?.name?.charAt(0) ?? "?"}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium leading-tight">
                  {user?.name}
                </p>
                <p className="text-xs text-muted-foreground leading-tight">
                  {user?.role}
                </p>
              </div>
              <ChevronDown size={14} className="text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={() => router.push("/dashboard/profile")}>
              <User size={14} className="mr-2" /> Profile
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut size={14} className="mr-2" /> Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
