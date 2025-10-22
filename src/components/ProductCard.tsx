import { ShoppingCart } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export interface Product {
  id: number;
  name: string;
  team: string;
  season: string;
  price: number;
  image: string;
}

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  return (
    <div className="group bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#2a2a2a] rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300">
      <div className="aspect-square bg-gray-50 dark:bg-[#2a2a2a] p-4 flex items-center justify-center">
        <ImageWithFallback
          src={product.image}
          alt={product.name}
          className="w-full h-full object-contain"
        />
      </div>
      
      <div className="p-5">
        <h3 className="line-clamp-2 mb-2 text-gray-900 dark:text-white" style={{ fontSize: '16px', fontWeight: '600' }}>{product.name}</h3>
        <p className="text-gray-500 dark:text-gray-400" style={{ fontSize: '14px' }}>{product.season}</p>
        
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100 dark:border-[#2a2a2a]">
          <div>
            <span className="text-[#FF6B35] dark:text-[#ff7043] block" style={{ fontSize: '20px', fontWeight: '700' }}>
              R$ {product.price.toFixed(2)}
            </span>
            <span className="text-gray-400 dark:text-gray-500 text-xs">12x sem juros</span>
          </div>
          <button
            onClick={() => onAddToCart(product)}
            className="bg-[#FF6B35] dark:bg-[#ff7043] text-white p-3 rounded-lg hover:opacity-90"
          >
            <ShoppingCart className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
