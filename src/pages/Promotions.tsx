import { ProductCard, Product } from "../components/ProductCard";
import { products } from "../lib/products";
import { Tag, TrendingDown } from "lucide-react";

interface PromotionsProps {
  onAddToCart: (product: Product) => void;
}

// Produtos em promoção (primeiros 6 produtos com desconto)
const promoProducts = products.slice(0, 6).map((product) => ({
  ...product,
  originalPrice: product.price + 50,
  discount: 20 + Math.floor(Math.random() * 30), // Desconto entre 20% e 50%
}));

export function Promotions({ onAddToCart }: PromotionsProps) {
  return (
    <div className="min-h-screen">
      {/* Hero Banner */}
      <section className="bg-gradient-to-r from-red-600 via-[#FF6B35] to-orange-500">
        <div className="max-w-7xl mx-auto px-6 py-16 text-center text-white">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-6 py-2 rounded-full mb-6">
            <Tag className="w-5 h-5" />
            <span>Promoções Especiais</span>
          </div>
          <h1 style={{ fontSize: '48px', fontWeight: '700', lineHeight: '1.2' }}>
            MEGA LIQUIDAÇÃO
          </h1>
          <p className="mt-4" style={{ fontSize: '24px' }}>
            Até 50% OFF em Camisas Selecionadas
          </p>
          <p className="mt-2 opacity-90" style={{ fontSize: '18px' }}>
            Aproveite os melhores preços do ano!
          </p>
        </div>
      </section>

      {/* Promotional Banner */}
      <section className="bg-yellow-50 border-y-4 border-yellow-400 py-6">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <TrendingDown className="w-8 h-8 text-[#FF6B35]" />
            <p className="text-center">
              <span className="font-semibold text-[#FF6B35]">FRETE GRÁTIS</span> para compras acima de R$ 200,00
            </p>
            <span className="text-gray-300">|</span>
            <p className="text-center">
              <span className="font-semibold text-[#FF6B35]">12x SEM JUROS</span> no cartão de crédito
            </p>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="mb-12 text-center">
          <h2 className="mb-4">Produtos em Promoção</h2>
          <p className="text-gray-600">
            Ofertas imperdíveis por tempo limitado
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {promoProducts.map((product) => (
            <div key={product.id} className="relative">
              {/* Discount Badge */}
              <div className="absolute top-4 left-4 z-10 bg-red-600 text-white px-3 py-1 rounded-full shadow-lg">
                -{product.discount}%
              </div>
              
              <div className="bg-white rounded-xl border-2 border-[#FF6B35] overflow-hidden hover:shadow-xl transition-shadow">
                <ProductCard
                  product={product}
                  onAddToCart={onAddToCart}
                />
                
                {/* Price Info */}
                <div className="px-4 pb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-gray-400 line-through">
                      R$ {product.originalPrice.toFixed(2)}
                    </span>
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-sm">
                      Economize R$ {(product.originalPrice - product.price).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-[#FF6B35] to-[#FF8C5A] py-16">
        <div className="max-w-4xl mx-auto px-6 text-center text-white">
          <h2 className="mb-4">Não Perca Essas Ofertas!</h2>
          <p className="mb-8" style={{ fontSize: '18px' }}>
            Promoções válidas enquanto durarem os estoques
          </p>
          <div className="flex items-center justify-center gap-4">
            <div className="bg-white/20 backdrop-blur-sm px-6 py-4 rounded-lg">
              <p className="text-sm opacity-90">Ofertas terminam em</p>
              <p style={{ fontSize: '28px', fontWeight: '700' }}>2 DIAS</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
