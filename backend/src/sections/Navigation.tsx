import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '@/hooks/useAuth';
import { Shield } from 'lucide-react';

interface NavigationProps {
  onNavigate: (id: string) => void;
}

export default function Navigation({ onNavigate }: NavigationProps) {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, isAdmin, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 100);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Programs', id: 'programs' },
    { label: 'About', id: 'about' },
    { label: 'Vision', id: 'vision' },
    { label: 'Contact', id: 'contact' },
  ];

  const handleNavClick = (id: string) => {
    onNavigate(id);
    setMobileOpen(false);
  };

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          backgroundColor: scrolled ? 'rgba(26,26,26,0.9)' : 'transparent',
          backdropFilter: scrolled ? 'blur(12px)' : 'none',
        }}
      >
        <div className="mx-auto flex items-center justify-between" style={{ maxWidth: 1280, padding: '0 clamp(1.5rem, 4vw, 3rem)', height: 64 }}>
          {/* Wordmark */}
          <button onClick={() => handleNavClick('hero')} className="flex items-center gap-2 group">
            <span className="font-display font-medium text-[#faf8f3] text-xl tracking-tight transition-all duration-300 group-hover:tracking-wider">BICTA</span>
            <span className="w-px h-4 bg-[#c9a84c]" />
            <span className="font-body font-medium text-[0.6875rem] uppercase tracking-[0.15em] text-[#c9a84c]">ELITE</span>
          </button>

          {/* Center Links - Desktop */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className="relative font-body font-medium text-[0.8125rem] uppercase tracking-[0.05em] text-[#e0ddd5] transition-colors duration-200 hover:text-[#c9a84c] group"
              >
                {link.label}
                <span className="absolute left-0 bottom-[-4px] h-[2px] w-full bg-[#c9a84c] origin-left scale-x-0 transition-transform duration-200 group-hover:scale-x-100" />
              </button>
            ))}
            {isAdmin && (
              <button
                onClick={() => navigate('/admin')}
                className="relative font-body font-medium text-[0.8125rem] uppercase tracking-[0.05em] text-[#c9a84c] transition-colors duration-200 hover:text-[#e8d49a] flex items-center gap-1.5"
              >
                <Shield size={13} /> CMS
              </button>
            )}
          </div>

          {/* Right - Auth */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <span className="text-[0.6875rem] text-[#e0ddd5]">{user?.name || user?.email}</span>
                <button onClick={logout} className="font-body font-medium text-[0.75rem] uppercase tracking-[0.05em] text-[#8a8680] hover:text-[#c9a84c] transition-colors">Logout</button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <button onClick={() => navigate('/login')} className="font-body font-medium text-[0.875rem] uppercase tracking-[0.08em] text-[#c9a84c] border border-[#c9a84c] px-6 py-2.5 transition-all duration-250 hover:bg-[#c9a84c] hover:text-[#0a0a0a]">
                  Login
                </button>
              </div>
            )}
          </div>

          {/* Hamburger - Mobile */}
          <button className="md:hidden flex flex-col gap-1.5 p-2" onClick={() => setMobileOpen(!mobileOpen)}>
            <span className={`block w-6 h-px bg-[#faf8f3] transition-all duration-300 ${mobileOpen ? 'rotate-45 translate-y-[3.5px]' : ''}`} />
            <span className={`block w-6 h-px bg-[#faf8f3] transition-all duration-300 ${mobileOpen ? '-rotate-45 -translate-y-[3.5px]' : ''}`} />
          </button>
        </div>
      </nav>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-[#1a1a1a] flex flex-col items-center justify-center gap-8 md:hidden">
          {navLinks.map((link, i) => (
            <button key={link.id} onClick={() => handleNavClick(link.id)} className="font-display font-normal text-[2rem] text-[#faf8f3] hover:text-[#c9a84c] transition-colors duration-200" style={{ animation: `fadeInUp 0.4s ease forwards`, animationDelay: `${i * 0.05}s`, opacity: 0 }}>{link.label}</button>
          ))}
          {isAdmin && (
            <button onClick={() => { navigate('/admin'); setMobileOpen(false); }} className="font-display font-normal text-[2rem] text-[#c9a84c] hover:text-[#e8d49a] transition-colors duration-200 flex items-center gap-2" style={{ animation: `fadeInUp 0.4s ease forwards`, animationDelay: `${navLinks.length * 0.05}s`, opacity: 0 }}><Shield size={20} /> CMS</button>
          )}
          {isAuthenticated ? (
            <button onClick={() => { logout(); setMobileOpen(false); }} className="font-display font-normal text-[1.5rem] text-[#8a8680] hover:text-red-400 transition-colors duration-200">Logout</button>
          ) : (
            <button onClick={() => { navigate('/login'); setMobileOpen(false); }} className="font-display font-normal text-[1.5rem] text-[#c9a84c] hover:text-[#e8d49a] transition-colors duration-200">Login</button>
          )}
          <style>{`@keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }`}</style>
        </div>
      )}
    </>
  );
}
