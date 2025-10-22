import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { Home } from "./pages/Home";
import { AllShirts } from "./pages/AllShirts";
import { RareShirts } from "./pages/RareShirts";
import { Cart } from "./pages/Cart";
import { Profile } from "./pages/Profile";
import { Checkout } from "./pages/Checkout";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Product } from "./components/ProductCard";
import { Toaster, toast } from "sonner@2.0.3";

interface CartItem extends Product {
  quantity: number;
}

interface User {
  email: string;
  name: string;
}

export default function App() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check local storage for dark mode preference
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode === 'true') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
  };

  const handleAddToCart = (product: Product) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);
      
      if (existingItem) {
        toast.success("Quantidade atualizada no carrinho!");
        return prevItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        toast.success("Produto adicionado ao carrinho!");
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });
  };

  const handleUpdateQuantity = (id: number, quantity: number) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveItem = (id: number) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
    toast.success("Produto removido do carrinho");
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const handleLogin = (email: string) => {
    setUser({ email, name: email.split("@")[0] });
  };

  const handleRegister = (email: string, name: string) => {
    setUser({ email, name });
  };

  const handleLogout = () => {
    setUser(null);
    toast.success("Logout realizado com sucesso!");
  };

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Toaster position="top-right" />
        <Header 
          cartCount={totalItems} 
          isLoggedIn={!!user} 
          userName={user?.name}
          onLogout={handleLogout}
          isDarkMode={isDarkMode}
          onToggleDarkMode={toggleDarkMode}
        />
        
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home onAddToCart={handleAddToCart} />} />
            <Route path="/camisas" element={<AllShirts onAddToCart={handleAddToCart} />} />
            <Route path="/exclusivo" element={<RareShirts onAddToCart={handleAddToCart} />} />
            <Route
              path="/carrinho"
              element={
                <Cart
                  cartItems={cartItems}
                  onUpdateQuantity={handleUpdateQuantity}
                  onRemoveItem={handleRemoveItem}
                />
              }
            />
            <Route 
              path="/perfil" 
              element={<Profile user={user} onLogout={handleLogout} />} 
            />
            <Route
              path="/checkout"
              element={<Checkout cartItems={cartItems} onClearCart={handleClearCart} />}
            />
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/cadastro" element={<Register onRegister={handleRegister} />} />
            <Route path="*" element={<Home onAddToCart={handleAddToCart} />} />
          </Routes>
        </main>
        
        <Footer />
      </div>
    </Router>
  );
}
