import { Search, User, ShoppingCart, LogIn, Moon, Sun } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

interface HeaderProps {
  cartCount?: number;
  isLoggedIn?: boolean;
  userName?: string;
  onLogout?: () => void;
  isDarkMode?: boolean;
  onToggleDarkMode?: () => void;
}

export function Header({ cartCount = 0, isLoggedIn = false, userName, onLogout, isDarkMode = false, onToggleDarkMode }: HeaderProps) {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-white dark:bg-[#1a1a1a] border-b border-gray-200 dark:border-[#2a2a2a] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="italic bg-gradient-to-r from-[#FF6B35] to-[#FF8C5A] dark:from-[#ff7043] dark:to-[#ff8a65] bg-clip-text text-transparent" style={{ fontSize: '28px', fontWeight: '700' }}>FutMax</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link 
              to="/" 
              className={`${isActive('/') ? 'text-[#FF6B35] dark:text-[#ff7043]' : 'text-gray-700 dark:text-gray-300 hover:text-[#FF6B35] dark:hover:text-[#ff7043]'}`}
            >
              Início
            </Link>
            <Link 
              to="/camisas" 
              className={`${isActive('/camisas') ? 'text-[#FF6B35] dark:text-[#ff7043]' : 'text-gray-700 dark:text-gray-300 hover:text-[#FF6B35] dark:hover:text-[#ff7043]'}`}
            >
              Camisas
            </Link>
            <Link 
              to="/exclusivo" 
              className={`${isActive('/exclusivo') ? 'text-[#FF6B35] dark:text-[#ff7043]' : 'text-gray-700 dark:text-gray-300 hover:text-[#FF6B35] dark:hover:text-[#ff7043]'}`}
            >
              Exclusivo
            </Link>
          </nav>

          {/* Right section */}
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="hidden lg:flex items-center gap-2 bg-gray-50 dark:bg-[#2a2a2a] rounded-lg px-4 py-2 w-64">
              <Search className="w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar camisas..."
                className="bg-transparent outline-none w-full placeholder:text-gray-400 text-gray-900 dark:text-white"
              />
            </div>

            {/* Dark Mode Toggle */}
            <button 
              onClick={onToggleDarkMode}
              className="p-2 hover:bg-gray-100 dark:hover:bg-[#2a2a2a] rounded-lg"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              ) : (
                <Moon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              )}
            </button>

            {/* User/Login */}
            {isLoggedIn ? (
              <Link to="/perfil" className="p-2 hover:bg-gray-100 dark:hover:bg-[#2a2a2a] rounded-lg">
                <User className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </Link>
            ) : (
              <Link 
                to="/login" 
                className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#2a2a2a] rounded-lg"
              >
                <LogIn className="w-4 h-4" />
                <span className="hidden lg:inline">Entrar</span>
              </Link>
            )}

            {/* Cart Icon */}
            <Link to="/carrinho" className="p-2 hover:bg-gray-100 dark:hover:bg-[#2a2a2a] rounded-lg relative">
              <ShoppingCart className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#FF6B35] dark:bg-[#ff7043] text-white rounded-full w-5 h-5 flex items-center justify-center" style={{ fontSize: '12px' }}>
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
