import React, { useState, useEffect } from 'react';
import { 
  Coffee, 
  Search, 
  ShoppingBag, 
  CalendarDays, 
  Menu as MenuIcon, 
  X, 
  User, 
  ShieldCheck, 
  Clock, 
  ChevronRight,
  Sparkles,
  Lock
} from 'lucide-react';
import { CustomerUser } from '../types';

interface NavbarProps {
  currentView?: string;
  activeView?: string;
  onNavigate: (view: any) => void;
  cartCount?: number;
  cartTotal?: number;
  onOpenCart: () => void;
  onOpenSearch: () => void;
  onOpenReservation: () => void;
  onOpenAccount?: () => void;
  onOpenTracking?: () => void;
  onOpenTrackOrder?: () => void;
  user?: CustomerUser;
  isAdmin?: boolean;
  isAdminMode?: boolean;
  onToggleAdmin?: () => void;
  onToggleAdminMode?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  activeView,
  onNavigate,
  cartCount = 0,
  cartTotal = 0,
  onOpenCart,
  onOpenSearch,
  onOpenReservation,
  onOpenAccount,
  onOpenTracking,
  onOpenTrackOrder,
  user,
  isAdmin,
  isAdminMode,
  onToggleAdmin,
  onToggleAdminMode
}) => {
  const activePage = currentView || activeView || 'home';
  const handleAccountClick = onOpenAccount || (() => onNavigate('account'));
  const handleTrackingClick = onOpenTracking || onOpenTrackOrder || (() => {});
  const handleAdminToggle = onToggleAdmin || onToggleAdminMode || (() => {});
  const isCurrentAdmin = isAdmin !== undefined ? isAdmin : Boolean(isAdminMode);

  const userName = user?.name || 'Sarah Johnson';
  const userAvatar = user?.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80';
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'menu', label: 'Menu' },
    { id: 'about', label: 'About' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'events', label: 'Events' },
    { id: 'contact', label: 'Contact' },
  ];

  return (
    <>
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#FDFBF7]/95 backdrop-blur-md shadow-sm border-b border-[#2A1E17]/10 py-3.5'
            : 'bg-[#FDFBF7] border-b border-[#2A1E17]/5 py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                onNavigate('home');
                setMobileMenuOpen(false);
              }}
              className="group flex items-center gap-2.5 text-left focus:outline-none"
              id="navbar-logo-btn"
            >
              <div className="w-10 h-10 rounded-full bg-[#2A1E17] text-[#D4A373] flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform">
                <Coffee className="w-5 h-5" />
              </div>
              <div>
                <span className="block font-serif text-xl sm:text-2xl font-bold tracking-tight text-[#2A1E17] leading-none">
                  Urban Grove Cafe
                </span>
                <span className="hidden sm:block text-[10px] uppercase tracking-widest text-[#C48B47] font-semibold mt-1">
                  Artisan Roasters & Café
                </span>
              </div>
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-7">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => onNavigate(link.id)}
                id={`nav-link-${link.id}`}
                className={`text-sm font-medium transition-colors relative py-1 hover:text-[#C48B47] ${
                  activePage === link.id
                    ? 'text-[#2A1E17] font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#C48B47] after:rounded-full'
                    : 'text-[#2A1E17]/70'
                }`}
              >
                {link.label}
              </button>
            ))}

            <button
              onClick={onOpenReservation}
              id="nav-link-reservations"
              className="text-sm font-medium text-[#1E3A2F] hover:text-[#142820] flex items-center gap-1.5 transition-colors py-1"
            >
              <CalendarDays className="w-3.5 h-3.5 text-[#C48B47]" />
              Reservations
            </button>
          </nav>

          {/* Right Action Icons & CTA */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search */}
            <button
              onClick={onOpenSearch}
              id="nav-search-btn"
              className="p-2.5 text-[#2A1E17]/70 hover:text-[#2A1E17] hover:bg-[#F6F2EC] rounded-full transition-colors"
              title="Search menu"
              aria-label="Search menu"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Track Order Icon */}
            <button
              onClick={handleTrackingClick}
              id="nav-tracking-btn"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#2A1E17]/80 hover:text-[#2A1E17] hover:bg-[#F6F2EC] rounded-lg transition-colors border border-[#2A1E17]/10"
              title="Track Active Order"
            >
              <Clock className="w-3.5 h-3.5 text-[#C48B47]" />
              <span>Track Order</span>
            </button>

            {/* Cart Button */}
            <button
              onClick={onOpenCart}
              id="nav-cart-btn"
              className="relative flex items-center gap-2 px-3 py-2 bg-[#F6F2EC] hover:bg-[#ede7de] text-[#2A1E17] rounded-xl text-sm font-medium transition-all"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-4 h-4 text-[#C48B47]" />
              <span className="hidden sm:inline text-xs font-semibold text-[#2A1E17]">Cart</span>
              {cartCount > 0 && (
                <span className="flex items-center justify-center min-w-[20px] h-5 px-1 text-[11px] font-bold text-white bg-[#C48B47] rounded-full">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Primary Order Now Button */}
            <button
              onClick={() => onNavigate('menu')}
              id="nav-order-now-btn"
              className="hidden md:inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#2A1E17] text-[#FDFBF7] text-sm font-medium rounded-xl hover:bg-[#1E1510] active:scale-[0.98] transition-all shadow-sm"
            >
              <span>Order Now</span>
              <ChevronRight className="w-4 h-4 text-[#D4A373]" />
            </button>

            {/* User Account / Portal Switcher */}
            <div className="relative flex items-center gap-1.5">
              <button
                onClick={handleAccountClick}
                id="nav-account-btn"
                className="flex items-center gap-2 p-1.5 sm:px-2.5 sm:py-1.5 bg-[#F6F2EC] hover:bg-[#ede7de] text-[#2A1E17] rounded-xl text-xs font-medium transition-colors"
                title={`Logged in as ${userName}`}
              >
                <img
                  src={userAvatar}
                  alt={userName}
                  className="w-6 h-6 rounded-full object-cover border border-[#D4A373]"
                />
                <span className="hidden xl:inline max-w-[90px] truncate">{userName.split(' ')[0]}</span>
              </button>

              {/* Staff & Admin Portal (Passcode Protected) */}
              <button
                onClick={handleAdminToggle}
                id="nav-admin-toggle-btn"
                className={`p-2 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 border ${
                  isCurrentAdmin 
                    ? 'bg-[#1E3A2F] text-[#86efac] border-[#2c5344] shadow-xs' 
                    : 'bg-[#F6F2EC] text-[#2A1E17]/60 hover:text-[#2A1E17] hover:bg-[#ede7de] border-transparent'
                }`}
                title={isCurrentAdmin ? 'Admin Mode Active (Click to switch view)' : 'Staff Management Portal (Passcode Required)'}
              >
                {isCurrentAdmin ? (
                  <>
                    <span className="w-2 h-2 rounded-full bg-[#86efac] animate-pulse" />
                    <span className="hidden xl:inline text-[11px] font-semibold text-[#86efac]">Admin Active</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5 text-[#C48B47]" />
                    <span className="hidden xl:inline text-[11px] font-medium">Staff</span>
                  </>
                )}
              </button>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              id="nav-mobile-toggle-btn"
              className="lg:hidden p-2 text-[#2A1E17] hover:bg-[#F6F2EC] rounded-lg transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex flex-col bg-[#FDFBF7]">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-[#2A1E17]/10">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-[#2A1E17] text-[#D4A373] flex items-center justify-center">
                <Coffee className="w-5 h-5" />
              </div>
              <span className="font-serif text-xl font-bold text-[#2A1E17]">Urban Grove Cafe</span>
            </div>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 text-[#2A1E17] hover:bg-[#F6F2EC] rounded-lg"
              aria-label="Close menu"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Links */}
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
            <div className="space-y-1 border-b border-[#2A1E17]/10 pb-4">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => {
                    onNavigate(link.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between py-3 px-3 rounded-xl text-left text-base font-medium transition-colors ${
                    currentView === link.id ? 'bg-[#2A1E17] text-[#FDFBF7]' : 'text-[#2A1E17] hover:bg-[#F6F2EC]'
                  }`}
                >
                  <span>{link.label}</span>
                  <ChevronRight className="w-4 h-4 opacity-50" />
                </button>
              ))}
            </div>

            <div className="space-y-2 pt-2">
              <button
                onClick={() => {
                  onOpenReservation();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center gap-3 py-3 px-3 rounded-xl text-[#1E3A2F] bg-[#eef6f2] font-semibold text-sm"
              >
                <CalendarDays className="w-5 h-5 text-[#1E3A2F]" />
                <span>Reserve a Table</span>
              </button>

              <button
                onClick={() => {
                  handleTrackingClick();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center gap-3 py-3 px-3 rounded-xl text-[#2A1E17] bg-[#F6F2EC] font-medium text-sm"
              >
                <Clock className="w-5 h-5 text-[#C48B47]" />
                <span>Track Active Order</span>
              </button>

              <button
                onClick={() => {
                  handleAccountClick();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center gap-3 py-3 px-3 rounded-xl text-[#2A1E17] bg-[#F6F2EC] font-medium text-sm"
              >
                <User className="w-5 h-5 text-[#C48B47]" />
                <span>My Account ({userName})</span>
              </button>

              <button
                onClick={() => {
                  handleAdminToggle();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center gap-3 py-3 px-3 rounded-xl text-[#1E3A2F] bg-[#F6F2EC] font-medium text-sm border border-[#1E3A2F]/20"
              >
                <ShieldCheck className="w-5 h-5 text-[#1E3A2F]" />
                <span>{isCurrentAdmin ? 'Exit Admin Mode' : 'Staff Admin Portal'}</span>
              </button>
            </div>
          </div>

          {/* Bottom Primary CTA in Mobile Menu */}
          <div className="p-6 border-t border-[#2A1E17]/10 bg-[#F6F2EC]">
            <button
              onClick={() => {
                onNavigate('menu');
                setMobileMenuOpen(false);
              }}
              className="w-full py-3.5 bg-[#2A1E17] text-[#FDFBF7] font-semibold rounded-xl text-center flex items-center justify-center gap-2 shadow-md"
            >
              <Sparkles className="w-4 h-4 text-[#D4A373]" />
              <span>Order Online Now</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
};
