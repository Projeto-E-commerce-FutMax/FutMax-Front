import { useState } from "react";
import { CreditCard, Truck, CheckCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { Product } from "../components/ProductCard";

interface CartItem extends Product {
  quantity: number;
}

interface CheckoutProps {
  cartItems: CartItem[];
  onClearCart: () => void;
}

export function Checkout({ cartItems, onClearCart }: CheckoutProps) {
  const navigate = useNavigate();
  const [orderPlaced, setOrderPlaced] = useState(false);

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = 20;
  const total = subtotal + shipping;

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setOrderPlaced(true);
    setTimeout(() => {
      onClearCart();
      navigate("/");
    }, 3000);
  };

  if (orderPlaced) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="bg-white dark:bg-[#1a1a1a] rounded-lg border border-gray-200 dark:border-[#2a2a2a] p-12 text-center">
          <CheckCircle className="w-24 h-24 text-green-500 mx-auto mb-6" />
          <h2 className="mb-4 text-gray-900 dark:text-white">Pedido Realizado com Sucesso!</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Obrigado pela sua compra. Você receberá um email com os detalhes do seu pedido.
          </p>
          <div className="inline-flex items-center gap-2 text-[#FF6B35] dark:text-[#ff7043]">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#FF6B35] dark:border-[#ff7043]"></div>
            <span>Redirecionando...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="mb-8 text-gray-900 dark:text-white">Finalizar Pedido</h1>

      <form onSubmit={handlePlaceOrder}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Information */}
            <div className="bg-white dark:bg-[#1a1a1a] rounded-lg border border-gray-200 dark:border-[#2a2a2a] p-6">
              <div className="flex items-center gap-2 mb-6">
                <Truck className="w-6 h-6 text-[#FF6B35] dark:text-[#ff7043]" />
                <h3 className="text-gray-900 dark:text-white">Informações de Entrega</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block mb-2 text-gray-900 dark:text-white">Nome Completo</label>
                  <input
                    type="text"
                    required
                    className="w-full p-3 border border-gray-200 dark:border-[#2a2a2a] dark:bg-[#0f0f0f] dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35] dark:focus:ring-[#ff7043]"
                    defaultValue="João Silva Santos"
                  />
                </div>

                <div>
                  <label className="block mb-2 text-gray-900 dark:text-white">Email</label>
                  <input
                    type="email"
                    required
                    className="w-full p-3 border border-gray-200 dark:border-[#2a2a2a] dark:bg-[#0f0f0f] dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35] dark:focus:ring-[#ff7043]"
                    defaultValue="joao.silva@email.com"
                  />
                </div>

                <div>
                  <label className="block mb-2 text-gray-900 dark:text-white">Telefone</label>
                  <input
                    type="tel"
                    required
                    className="w-full p-3 border border-gray-200 dark:border-[#2a2a2a] dark:bg-[#0f0f0f] dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35] dark:focus:ring-[#ff7043]"
                    defaultValue="(11) 99999-9999"
                  />
                </div>

                <div>
                  <label className="block mb-2 text-gray-900 dark:text-white">CEP</label>
                  <input
                    type="text"
                    required
                    className="w-full p-3 border border-gray-200 dark:border-[#2a2a2a] dark:bg-[#0f0f0f] dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35] dark:focus:ring-[#ff7043]"
                    defaultValue="88711-11"
                  />
                </div>

                <div>
                  <label className="block mb-2 text-gray-900 dark:text-white">Cidade</label>
                  <input
                    type="text"
                    required
                    className="w-full p-3 border border-gray-200 dark:border-[#2a2a2a] dark:bg-[#0f0f0f] dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35] dark:focus:ring-[#ff7043]"
                    defaultValue="São Paulo"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block mb-2 text-gray-900 dark:text-white">Endereço</label>
                  <input
                    type="text"
                    required
                    className="w-full p-3 border border-gray-200 dark:border-[#2a2a2a] dark:bg-[#0f0f0f] dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35] dark:focus:ring-[#ff7043]"
                    defaultValue="Av. Patrício Lima, 442"
                  />
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="bg-white dark:bg-[#1a1a1a] rounded-lg border border-gray-200 dark:border-[#2a2a2a] p-6">
              <div className="flex items-center gap-2 mb-6">
                <CreditCard className="w-6 h-6 text-[#FF6B35] dark:text-[#ff7043]" />
                <h3 className="text-gray-900 dark:text-white">Informações de Pagamento</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block mb-2 text-gray-900 dark:text-white">Número do Cartão</label>
                  <input
                    type="text"
                    required
                    placeholder="1234 5678 9012 3456"
                    className="w-full p-3 border border-gray-200 dark:border-[#2a2a2a] dark:bg-[#0f0f0f] dark:text-white dark:placeholder:text-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35] dark:focus:ring-[#ff7043]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-2 text-gray-900 dark:text-white">Validade</label>
                    <input
                      type="text"
                      required
                      placeholder="MM/AA"
                      className="w-full p-3 border border-gray-200 dark:border-[#2a2a2a] dark:bg-[#0f0f0f] dark:text-white dark:placeholder:text-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35] dark:focus:ring-[#ff7043]"
                    />
                  </div>

                  <div>
                    <label className="block mb-2 text-gray-900 dark:text-white">CVV</label>
                    <input
                      type="text"
                      required
                      placeholder="123"
                      className="w-full p-3 border border-gray-200 dark:border-[#2a2a2a] dark:bg-[#0f0f0f] dark:text-white dark:placeholder:text-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35] dark:focus:ring-[#ff7043]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block mb-2 text-gray-900 dark:text-white">Nome no Cartão</label>
                  <input
                    type="text"
                    required
                    className="w-full p-3 border border-gray-200 dark:border-[#2a2a2a] dark:bg-[#0f0f0f] dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35] dark:focus:ring-[#ff7043]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-[#1a1a1a] rounded-lg border border-gray-200 dark:border-[#2a2a2a] p-6 sticky top-24">
              <h3 className="mb-4 text-gray-900 dark:text-white">Resumo do Pedido</h3>

              <div className="space-y-4 mb-6">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="w-16 h-16 bg-gray-50 dark:bg-[#2a2a2a] rounded-lg flex items-center justify-center flex-shrink-0">
                      <ImageWithFallback
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-contain p-1"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-900 dark:text-white" style={{ fontSize: '14px' }}>{item.name}</p>
                      <p className="text-gray-500 dark:text-gray-400" style={{ fontSize: '12px' }}>
                        Qtd: {item.quantity}
                      </p>
                    </div>
                    <span className="text-gray-900 dark:text-white" style={{ fontSize: '14px' }}>
                      R$ {(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-3 mb-6 pb-6 border-b border-gray-200 dark:border-[#2a2a2a]">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                  <span className="text-gray-900 dark:text-white">R$ {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Frete</span>
                  <span className="text-gray-900 dark:text-white">R$ {shipping.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex justify-between mb-6">
                <span className="text-gray-900 dark:text-white">Total</span>
                <span className="text-[#FF6B35] dark:text-[#ff7043]">R$ {total.toFixed(2)}</span>
              </div>

              <button
                type="submit"
                className="w-full bg-[#FF6B35] dark:bg-[#ff7043] text-white py-3 rounded-lg hover:bg-[#e55a2b] dark:hover:bg-[#ff5722] mb-3"
              >
                Finalizar Compra
              </button>

              <Link to="/carrinho">
                <button
                  type="button"
                  className="w-full border border-gray-300 dark:border-[#2a2a2a] text-gray-700 dark:text-gray-300 py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-[#2a2a2a]"
                >
                  Voltar ao Carrinho
                </button>
              </Link>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
