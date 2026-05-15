import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Menu, X, FolderOpen, ChevronDown, Mic, User, Map, ClipboardList, Lightbulb, BookOpen } from "lucide-react";

const HOME_SECTIONS = [
  { id: "journey", label: "Journey" },
  { id: "belong", label: "Belong" },
  { id: "data", label: "The Data" },
  { id: "learnings", label: "Learnings" },
  { id: "team", label: "Team" },
];

const UPLOAD_LINKS = [
  { href: "/interviews", label: "Interviews", icon: Mic },
  { href: "/personas", label: "Personas", icon: User },
  { href: "/journey-maps", label: "Journey Maps", icon: Map },
  { href: "/surveys", label: "Surveys", icon: ClipboardList },
  { href: "/ideation", label: "Ideation", icon: Lightbulb },
  { href: "/resources", label: "Resources", icon: BookOpen },
];

function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function Navbar() {
  const [location, setLocation] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [filesOpen, setFilesOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const isHome = location === "/";

  useEffect(() => {
    if (!isHome) { setActiveSection(null); return; }
    const observer = new IntersectionObserver(
      (entries) => { entries.forEach((e) => { if (e.isIntersecting) setActiveSection(e.target.id); }); },
      { rootMargin: "-30% 0px -60% 0px" }
    );
    HOME_SECTIONS.forEach(({ id }) => { const el = document.getElementById(id); if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, [isHome]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setFilesOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleSectionClick = (id: string) => {
    setMobileOpen(false);
    if (isHome) {
      scrollToSection(id);
    } else {
      setLocation("/");
      setTimeout(() => scrollToSection(id), 300);
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full backdrop-blur-lg bg-background/90 border-b border-border shadow-sm">
      <div className="container mx-auto px-4 md:px-8 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm shadow-sm">
            PS
          </div>
          <span className="font-bold text-foreground text-base tracking-tight hidden sm:block">
            Prototype Squad
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-1">
          {HOME_SECTIONS.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => handleSectionClick(id)}
              data-testid={`nav-section-${id}`}
              className={cn(
                "px-3 py-1.5 rounded-full text-sm font-medium transition-colors hover:bg-secondary",
                isHome && activeSection === id
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {label}
            </button>
          ))}

          {/* Files dropdown */}
          <div className="relative ml-1" ref={dropdownRef}>
            <button
              onClick={() => setFilesOpen((v) => !v)}
              data-testid="button-files-dropdown"
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors hover:bg-secondary",
                filesOpen ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <FolderOpen className="w-4 h-4" />
              Files
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${filesOpen ? "rotate-180" : ""}`} />
            </button>

            {filesOpen && (
              <div className="absolute right-0 top-full mt-2 w-52 bg-card border border-border rounded-2xl shadow-xl overflow-hidden">
                <div className="px-3 py-2 border-b border-border/60">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Upload & View Files</p>
                </div>
                {UPLOAD_LINKS.map(({ href, label, icon: Icon }) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setFilesOpen(false)}
                    data-testid={`dropdown-link-${label.toLowerCase().replace(/\s+/g, "-")}`}
                    className={cn(
                      "flex items-center gap-3 px-4 py-2.5 text-sm transition-colors hover:bg-secondary",
                      location === href ? "text-primary font-medium bg-secondary/60" : "text-foreground"
                    )}
                  >
                    <Icon className="w-4 h-4 text-primary shrink-0" />
                    {label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Mobile hamburger */}
        <button
          className="lg:hidden p-2 rounded-lg hover:bg-secondary transition-colors"
          onClick={() => setMobileOpen((v) => !v)}
          data-testid="button-mobile-menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-border bg-background/95 backdrop-blur px-4 pb-4 pt-2 space-y-1">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2 pt-2 pb-1">Sections</p>
          {HOME_SECTIONS.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => handleSectionClick(id)}
              className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-foreground hover:bg-secondary transition-colors"
            >
              {label}
            </button>
          ))}
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2 pt-3 pb-1">Upload Files</p>
          {UPLOAD_LINKS.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                location === href ? "bg-secondary text-primary" : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
