import { Link, useLocation } from "wouter";
import { 
  LayoutDashboard, 
  Waves, 
  Network, 
  Cpu, 
  Menu,
  X 
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/layers", label: "Resonance Layers", icon: Waves },
  { href: "/logic", label: "Omni-Choice Logic", icon: Network },
  { href: "/simulations", label: "Quantum Simulations", icon: Cpu },
];

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();

  return (
    <>
      {/* Mobile Toggle */}
      <button 
        className="fixed top-4 right-4 z-50 p-2 md:hidden bg-background border border-primary text-primary"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X /> : <Menu />}
      </button>

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-40 w-64 bg-black/90 border-r border-border/50 backdrop-blur-md transition-transform duration-300 md:translate-x-0 flex flex-col",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-6 border-b border-white/10">
          <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
            OMNI<span className="text-white">TECH</span>
          </h1>
          <p className="text-xs text-muted-foreground font-mono mt-1">
            V.2.4.9 // ONLINE
          </p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {NAV_ITEMS.map((item) => {
            const isActive = location === item.href;
            const Icon = item.icon;
            
            return (
              <Link key={item.href} href={item.href} className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-none transition-all duration-300 group border-l-2",
                isActive 
                  ? "bg-primary/10 border-primary text-primary shadow-[inset_0_0_10px_rgba(6,182,212,0.1)]" 
                  : "border-transparent text-muted-foreground hover:text-foreground hover:bg-white/5 hover:border-white/20"
              )}>
                <Icon className={cn("w-5 h-5", isActive ? "text-primary" : "group-hover:text-white")} />
                <span className="font-mono tracking-wide uppercase text-sm">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <div className="flex items-center justify-between text-xs font-mono text-muted-foreground">
            <span>SYS.STATUS</span>
            <span className="flex items-center gap-2 text-green-500">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              STABLE
            </span>
          </div>
        </div>
      </aside>
    </>
  );
}
