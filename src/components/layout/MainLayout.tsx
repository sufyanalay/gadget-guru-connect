
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Laptop, 
  BookOpen, 
  MessageSquare, 
  User, 
  LogOut, 
  Home, 
  Menu, 
  X,
  Settings,
  BarChart3,
  Users,
  FileText
} from 'lucide-react';

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { label: 'Home', path: '/', icon: <Home size={18} /> },
  ];

  // Add authenticated-only routes
  if (isAuthenticated) {
    navItems.push(
      { label: 'Dashboard', path: '/dashboard', icon: <BarChart3 size={18} /> },
      { label: 'Gadget Repair', path: '/gadget-repair', icon: <Laptop size={18} /> },
      { label: 'Academic Help', path: '/academic-help', icon: <BookOpen size={18} /> },
      { label: 'Resources', path: '/resources', icon: <FileText size={18} /> },
      { label: 'Experts', path: '/experts', icon: <Users size={18} /> },
      { label: 'Chat', path: '/chat', icon: <MessageSquare size={18} /> },
      { label: 'Profile', path: '/profile', icon: <User size={18} /> },
    );

    // Add role-specific routes
    if (user?.role === 'teacher' || user?.role === 'technician') {
      navItems.push(
        { label: 'Earnings', path: '/earnings', icon: <BarChart3 size={18} /> },
      );
    }
  } else {
    navItems.push(
      { label: 'Login', path: '/login', icon: <User size={18} /> },
      { label: 'Register', path: '/register', icon: <User size={18} /> },
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-30 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>
            <a href="/" className="flex items-center gap-2 font-bold text-xl">
              <span className="text-primary">Gadget</span>
              <span className="text-accent">Guru</span>
              <span>Connect</span>
            </a>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <a
                key={item.path}
                href={item.path}
                onClick={(e) => {
                  e.preventDefault();
                  navigate(item.path);
                }}
                className={`nav-link flex items-center gap-1.5 ${isActive(item.path) ? 'nav-link-active' : ''}`}
              >
                {item.icon}
                {item.label}
              </a>
            ))}
            {isAuthenticated && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => {
                  logout();
                  navigate('/');
                }}
                className="flex items-center gap-1.5"
              >
                <LogOut size={18} />
                Logout
              </Button>
            )}
          </nav>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-background/95 backdrop-blur pt-16">
          <nav className="container py-8 flex flex-col gap-4">
            {navItems.map((item) => (
              <a
                key={item.path}
                href={item.path}
                onClick={(e) => {
                  e.preventDefault();
                  navigate(item.path);
                  setMobileMenuOpen(false);
                }}
                className={`flex items-center gap-2 p-3 rounded-md ${
                  isActive(item.path) 
                    ? 'bg-primary/10 text-primary font-medium' 
                    : 'hover:bg-muted'
                }`}
              >
                {item.icon}
                {item.label}
              </a>
            ))}
            {isAuthenticated && (
              <Button 
                variant="ghost"
                onClick={() => {
                  logout();
                  navigate('/');
                  setMobileMenuOpen(false);
                }}
                className="flex items-center justify-start gap-2 w-full p-3"
              >
                <LogOut size={18} />
                Logout
              </Button>
            )}
          </nav>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col md:flex-row justify-between items-center gap-4 md:h-16">
          <div className="text-sm text-muted-foreground">
            © 2025 Gadget Guru Connect. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Privacy Policy
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Terms of Service
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
