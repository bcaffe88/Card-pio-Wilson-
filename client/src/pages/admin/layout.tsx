import { useEffect } from "react";
import { useLocation, Link } from "wouter";
import { useAdminStore } from "@/lib/admin-store";
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Settings, 
  LogOut, 
  Pizza,
  Menu
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { isAuthenticated, logout } = useAdminStore();
  const [location, setLocation] = useLocation();

  useEffect(() => {
    if (!isAuthenticated) {
      setLocation("/admin/login");
    }
  }, [isAuthenticated, setLocation]);

  if (!isAuthenticated) return null;

  const NavItem = ({ href, icon: Icon, label }: { href: string; icon: any; label: string }) => {
    const isActive = location === href;
    return (
      <Link href={href}>
        <div className={cn(
          "flex items-center gap-3 px-3 py-2 rounded-lg transition-all cursor-pointer",
          isActive 
            ? "bg-primary text-primary-foreground font-medium" 
            : "text-muted-foreground hover:bg-muted hover:text-foreground"
        )}>
          <Icon className="w-5 h-5" />
          <span>{label}</span>
        </div>
      </Link>
    );
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold">W</div>
          <h1 className="text-xl font-heading font-bold tracking-tight">
            Wilson <span className="text-primary">Admin</span>
          </h1>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        <NavItem href="/admin/orders" icon={ShoppingBag} label="Pedidos" />
        <NavItem href="/admin/menu" icon={Pizza} label="Cardápio" />
        <NavItem href="/admin/settings" icon={Settings} label="Configurações" />
      </nav>

      <div className="p-4 border-t border-border">
        <Button 
          variant="ghost" 
          className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={() => {
            logout();
            setLocation("/admin/login");
          }}
        >
          <LogOut className="w-5 h-5 mr-2" />
          Sair
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-64 border-r border-border bg-card">
        <SidebarContent />
      </aside>

      {/* Mobile Header & Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="md:hidden h-16 border-b border-border flex items-center px-4 bg-card">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-64">
              <SidebarContent />
            </SheetContent>
          </Sheet>
          <span className="ml-4 font-heading font-bold text-lg">Painel Admin</span>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-secondary/10">
          <div className="max-w-5xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
