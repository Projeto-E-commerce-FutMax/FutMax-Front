import { useState } from "react";
import { ProductCard, Product } from "../components/ProductCard";
import { products } from "../lib/products";
import { Search, Shield, Users, Clock } from "lucide-react";

interface TeamsProps {
  onAddToCart: (product: Product) => void;
}

const categories = [
  { name: "Seleções", value: "selecoes", icon: Shield, description: "Camisas de seleções nacionais" },
  { name: "Times", value: "times", icon: Users, description: "Camisas de clubes" },
  { name: "Retrô", value: "retro", icon: Clock, description: "Todas as camisas clássicas" },
];

export function Teams({ onAddToCart }: TeamsProps) {
  const [selectedCategory, setSelectedCategory] = useState("selecoes");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProducts = products.filter((product) => {
    let matchesCategory = true;
    
    if (selectedCategory === "selecoes") {
      matchesCategory = product.team.includes("Seleção");
    } else if (selectedCategory === "times") {
      matchesCategory = !product.team.includes("Seleção");
    }
    // retro mostra todos, então não precisa filtrar
    
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.team.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="mb-4 text-gray-900 dark:text-white">Camisas por Time</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Encontre a camisa do seu time favorito
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-8">
        <div className="relative max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por time ou país..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-[#2a2a2a] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35] dark:focus:ring-[#ff7043] bg-white dark:bg-[#1a1a1a] text-gray-900 dark:text-white"
          />
        </div>
      </div>

      {/* Category Filter */}
      <div className="mb-10">
        <h3 className="mb-4 text-gray-900 dark:text-white">Categorias</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <button
                key={category.value}
                onClick={() => setSelectedCategory(category.value)}
                className={`p-6 rounded-xl border-2 text-left ${
                  selectedCategory === category.value
                    ? "bg-[#FF6B35] dark:bg-[#ff7043] text-white border-transparent"
                    : "bg-white dark:bg-[#1a1a1a] border-gray-200 dark:border-[#2a2a2a] hover:border-[#FF6B35] dark:hover:border-[#ff7043]"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg ${
                    selectedCategory === category.value
                      ? "bg-white/20"
                      : "bg-gray-100 dark:bg-[#2a2a2a]"
                  }`}>
                    <Icon className={`w-6 h-6 ${
                      selectedCategory === category.value
                        ? "text-white"
                        : "text-[#FF6B35] dark:text-[#ff7043]"
                    }`} />
                  </div>
                  <div className="flex-1">
                    <h4 className={`mb-1 ${
                      selectedCategory === category.value
                        ? "text-white"
                        : "text-gray-900 dark:text-white"
                    }`}>
                      {category.name}
                    </h4>
                    <p className={`text-sm ${
                      selectedCategory === category.value
                        ? "text-white/90"
                        : "text-gray-500 dark:text-gray-400"
                    }`}>
                      {category.description}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={onAddToCart}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-gray-500 dark:text-gray-400">
            Nenhuma camisa encontrada para este time.
          </p>
        </div>
      )}

      {/* Results Count */}
      <div className="mt-8 text-center text-gray-600 dark:text-gray-400">
        Mostrando {filteredProducts.length} {filteredProducts.length === 1 ? "produto" : "produtos"}
      </div>
    </div>
  );
}
