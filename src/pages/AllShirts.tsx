import { ProductCard } from "../components/ProductCard";
import { products } from "../lib/products";
import { Product } from "../components/ProductCard";

interface AllShirtsProps {
  onAddToCart: (product: Product) => void;
}

export function AllShirts({ onAddToCart }: AllShirtsProps) {
  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="mb-8 text-gray-900 dark:text-white">Todas Camisas</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={onAddToCart}
          />
        ))}
      </div>
    </div>
  );
}
