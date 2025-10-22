import { Trash2, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { Product } from "../components/ProductCard";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

interface CartItem extends Product {
  quantity: number;
}

interface CartProps {
  cartItems: CartItem[];
  onUpdateQuantity: (id: number, quantity: number) => void;
  onRemoveItem: (id: number) => void;
}

export function Cart({ cartItems, onUpdateQuantity, onRemoveItem }: CartProps) {
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 0 ? 20 : 0;
  const total = subtotal + shipping;

  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center py-16">
          <ShoppingBag className="w-24 h-24 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h2 className="mb-4 text-gray-900 dark:text-white">Seu carrinho está vazio</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-8">
            Adicione produtos para continuar comprando
          </p>
          <Link to="/camisas">
            <button className="bg-[#FF6B35] dark:bg-[#ff7043] text-white px-8 py-3 rounded-lg hover:opacity-90">
              Ver Produtos
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="mb-8 text-gray-900 dark:text-white">Carrinho de Compras</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-[#1a1a1a] rounded-xl border border-gray-200 dark:border-[#2a2a2a]">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 p-4 border-b border-gray-200 dark:border-[#2a2a2a] last:border-b-0"
              >
                <div className="w-24 h-24 bg-gray-50 dark:bg-[#2a2a2a] rounded-lg flex items-center justify-center flex-shrink-0">
                  <ImageWithFallback
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-contain p-2"
                  />
                </div>

                <div className="flex-1">
                  <h3 className="text-gray-900 dark:text-white">{item.name}</h3>
                  <p className="text-gray-500 dark:text-gray-400" style={{ fontSize: '14px' }}>
                    {item.season}
                  </p>
                  <p className="text-[#FF6B35] dark:text-[#ff7043] mt-2">
                    R$ {item.price.toFixed(2)}
                  </p>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <button
                    onClick={() => onRemoveItem(item.id)}
                    className="text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 p-2"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>

                  <div className="flex items-center gap-2 border border-gray-200 dark:border-[#2a2a2a] rounded-lg">
                    <button
                      onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                      className="px-3 py-1 hover:bg-gray-100 dark:hover:bg-[#2a2a2a] text-gray-900 dark:text-white"
                    >
                      −
                    </button>
                    <span className="w-8 text-center text-gray-900 dark:text-white">{item.quantity}</span>
                    <button
                      onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                      className="px-3 py-1 hover:bg-gray-100 dark:hover:bg-[#2a2a2a] text-gray-900 dark:text-white"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-[#1a1a1a] rounded-xl border border-gray-200 dark:border-[#2a2a2a] p-6 sticky top-24">
            <h3 className="mb-4 text-gray-900 dark:text-white">Resumo do Pedido</h3>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                <span className="text-gray-900 dark:text-white">R$ {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Frete</span>
                <span className="text-gray-900 dark:text-white">R$ {shipping.toFixed(2)}</span>
              </div>
              <div className="border-t border-gray-200 dark:border-[#2a2a2a] pt-3">
                <div className="flex justify-between">
                  <span className="text-gray-900 dark:text-white">Total</span>
                  <span className="text-[#FF6B35] dark:text-[#ff7043]">R$ {total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <Link to="/checkout">
              <button className="w-full bg-[#FF6B35] dark:bg-[#ff7043] text-white py-3 rounded-lg hover:opacity-90">
                Finalizar Pedido
              </button>
            </Link>

            <Link to="/camisas">
              <button className="w-full mt-3 border border-gray-300 dark:border-[#2a2a2a] text-gray-700 dark:text-gray-300 py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-[#2a2a2a]">
                Continuar Comprando
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
