import { Link, useNavigate } from "react-router-dom";
import { ProductCard } from "../components/ProductCard";
import { featuredProducts, promoProduct } from "../lib/products";
import { Product } from "../components/ProductCard";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { Tag, Zap, TrendingDown } from "lucide-react";

interface HomeProps {
  onAddToCart: (product: Product) => void;
}

export function Home({ onAddToCart }: HomeProps) {
  const navigate = useNavigate();

  const handleBuyPromoProduct = () => {
    onAddToCart(promoProduct);
    navigate("/carrinho");
  };

  return (
    <div>
      {/* Hero Banner */}
      <section className="relative bg-gradient-to-br from-red-600 via-[#FF6B35] to-orange-500 dark:from-[#1a1a1a] dark:via-[#2a2a2a] dark:to-[#1a1a1a] overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-40 h-40 bg-white/20 dark:bg-[#ff7043]/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-60 h-60 bg-white/20 dark:bg-[#ff7043]/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-yellow-400/30 dark:bg-[#ff7043]/30 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '0.5s' }}></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-14 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="text-white text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-yellow-400 text-gray-900 px-4 py-1.5 rounded-full shadow-lg mb-3 animate-bounce">
                <Zap className="w-4 h-4 fill-current" />
                <span style={{ fontSize: '14px', fontWeight: '600' }}>OFERTA RELÂMPAGO</span>
              </div>
              
              <h1 style={{ fontSize: '42px', fontWeight: '700', lineHeight: '1.1' }} className="mb-4">
                MEGA PROMOÇÃO
              </h1>
              
              <p style={{ fontSize: '24px', fontWeight: '600' }} className="mb-2">
                Até 50% OFF
              </p>
              <p style={{ fontSize: '16px' }} className="opacity-90 mb-5">
                em camisas oficiais selecionadas
              </p>

              <div className="flex items-center gap-2 mb-6 justify-center lg:justify-start flex-wrap">
                <div className="bg-white/20 backdrop-blur-sm px-3 py-2 rounded-lg">
                  <TrendingDown className="w-4 h-4 inline mr-1" />
                  <span style={{ fontSize: '14px' }}>Frete Grátis</span>
                </div>
                <div className="bg-white/20 backdrop-blur-sm px-3 py-2 rounded-lg">
                  <span style={{ fontSize: '14px' }}>12x Sem Juros</span>
                </div>
              </div>

              <button 
                onClick={handleBuyPromoProduct}
                className="bg-white dark:bg-[#ff7043] text-[#FF6B35] dark:text-white px-8 py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-[#ff5722] transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-white/40 group"
              >
                <span className="inline-flex items-center gap-2">
                  COMPRAR AGORA
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </span>
              </button>
            </div>

            <div className="flex justify-center">
              <div className="relative group/card">
                {/* Glow Effect */}
                <div className="absolute -inset-4 bg-white/30 dark:bg-[#ff7043]/30 rounded-3xl blur-2xl opacity-0 group-hover/card:opacity-100 transition-opacity"></div>
                
                {/* Product Card */}
                <div className="relative bg-white dark:bg-[#1a1a1a] rounded-2xl p-4 shadow-2xl max-w-sm w-full transform group-hover/card:scale-105 transition-all duration-500">
                  <div className="absolute -top-3 -right-3 bg-gradient-to-r from-red-600 to-red-500 text-white px-4 py-2 rounded-full shadow-lg z-10 animate-pulse">
                    <span style={{ fontSize: '18px', fontWeight: '700' }}>-50%</span>
                  </div>
                  
                  <ImageWithFallback
                    src={promoProduct.image}
                    alt={promoProduct.name}
                    className="w-full h-auto object-cover drop-shadow-2xl aspect-[4/3]"
                  />
                  
                  <div className="mt-4 text-center">
                    <h3 className="text-gray-900 dark:text-white mb-2">{promoProduct.name}</h3>
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-gray-400 dark:text-gray-500 line-through" style={{ fontSize: '16px' }}>
                        R$ 399,90
                      </span>
                      <span className="text-[#FF6B35] dark:text-[#ff7043]" style={{ fontSize: '26px', fontWeight: '700' }}>
                        R$ {promoProduct.price.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-gray-900 dark:text-white">Produtos em Destaque</h2>
          <Link to="/camisas" className="text-[#FF6B35] dark:text-[#ff7043] hover:underline transition-colors duration-300">
            Ver todas
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={onAddToCart}
            />
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="bg-gray-50 dark:bg-[#0f0f0f] py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="mb-8 text-center text-gray-900 dark:text-white">Categorias Populares</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link
              to="/camisas?category=nacionais"
              className="bg-white dark:bg-[#1a1a1a] p-6 rounded-xl text-center hover:shadow-lg border border-gray-200 dark:border-[#2a2a2a]"
            >
              <div className="w-16 h-16 bg-[#FF6B35] dark:bg-[#ff7043] rounded-full mx-auto mb-4 flex items-center justify-center text-white" style={{ fontSize: '24px' }}>
                🇧🇷
              </div>
              <h3 className="text-gray-900 dark:text-white">Camisas Nacionais</h3>
            </Link>
            <Link
              to="/camisas?category=internacionais"
              className="bg-white dark:bg-[#1a1a1a] p-6 rounded-xl text-center hover:shadow-lg border border-gray-200 dark:border-[#2a2a2a]"
            >
              <div className="w-16 h-16 bg-[#FF6B35] dark:bg-[#ff7043] rounded-full mx-auto mb-4 flex items-center justify-center text-white" style={{ fontSize: '24px' }}>
                🌍
              </div>
              <h3 className="text-gray-900 dark:text-white">Camisas Internacionais</h3>
            </Link>
            <Link
              to="/camisas?category=selecoes"
              className="bg-white dark:bg-[#1a1a1a] p-6 rounded-xl text-center hover:shadow-lg border border-gray-200 dark:border-[#2a2a2a]"
            >
              <div className="w-16 h-16 bg-[#FF6B35] dark:bg-[#ff7043] rounded-full mx-auto mb-4 flex items-center justify-center text-white" style={{ fontSize: '24px' }}>
                ⚽
              </div>
              <h3 className="text-gray-900 dark:text-white">Seleções</h3>
            </Link>
            <Link
              to="/camisas?category=retro"
              className="bg-white dark:bg-[#1a1a1a] p-6 rounded-xl text-center hover:shadow-lg border border-gray-200 dark:border-[#2a2a2a]"
            >
              <div className="w-16 h-16 bg-[#FF6B35] dark:bg-[#ff7043] rounded-full mx-auto mb-4 flex items-center justify-center text-white" style={{ fontSize: '24px' }}>
                ⏮️
              </div>
              <h3 className="text-gray-900 dark:text-white">Retrô</h3>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
