import { Product } from "../components/ProductCard";
import { rareProducts } from "../lib/products";
import { Sparkles, Award, Shield, Tag, Star, BadgeCheck } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

interface RareShirtsProps {
  onAddToCart: (product: Product) => void;
}

export function RareShirts({ onAddToCart }: RareShirtsProps) {
  return (
    <div className="min-h-screen bg-white dark:bg-[#0f0f0f]">
      {/* Hero Banner Premium */}
      <section className="relative bg-gradient-to-br from-[#FF6B35] via-[#FF8C5A] to-[#FF6B35] dark:from-[#1a1a1a] dark:via-[#2a2a2a] dark:to-[#1a1a1a] overflow-hidden">
        {/* Padrão decorativo */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-black rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>

        {/* Linhas decorativas */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/30 dark:via-[#ff7043]/30 to-transparent"></div>
          <div className="absolute bottom-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/30 dark:via-[#ff7043]/30 to-transparent"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-24 relative z-10">
          <div className="text-center text-white">
            <div className="inline-flex items-center gap-2 bg-black/30 backdrop-blur-sm border border-white/30 px-6 py-3 rounded-full mb-6 shadow-xl">
              <Sparkles className="w-5 h-5 text-white animate-pulse" />
              <span className="uppercase tracking-wider" style={{ fontSize: '14px' }}>Coleção Exclusiva</span>
            </div>
            
            <h1 style={{ fontSize: '56px', fontWeight: '700', lineHeight: '1.1' }} className="mb-6">
              CAMISETAS RARAS
            </h1>
            
            <p style={{ fontSize: '24px' }} className="mb-4">
              Peças Históricas de 1990 ou Anterior
            </p>
            
            <p className="max-w-2xl mx-auto opacity-90" style={{ fontSize: '16px' }}>
              Camisetas autênticas, conservadas e com etiqueta original.
              <br />
              Verdadeiras relíquias do futebol mundial.
            </p>

            {/* Stats */}
            <div className="flex items-center justify-center gap-8 mt-12 flex-wrap">
              <div className="bg-black/30 dark:bg-[#ff7043]/20 backdrop-blur-md px-6 py-3 rounded-xl border border-white/20 dark:border-[#ff7043]/30">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-white" />
                  <span className="text-white">Autenticidade Garantida</span>
                </div>
              </div>
              <div className="bg-black/30 dark:bg-[#ff7043]/20 backdrop-blur-md px-6 py-3 rounded-xl border border-white/20 dark:border-[#ff7043]/30">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-white" />
                  <span className="text-white">Certificado de Raridade</span>
                </div>
              </div>
              <div className="bg-black/30 dark:bg-[#ff7043]/20 backdrop-blur-md px-6 py-3 rounded-xl border border-white/20 dark:border-[#ff7043]/30">
                <div className="flex items-center gap-2">
                  <Tag className="w-5 h-5 text-white" />
                  <span className="text-white">Etiqueta Original</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {rareProducts.map((product) => (
            <div 
              key={product.id} 
              className="group relative bg-white dark:bg-[#1a1a1a] rounded-3xl shadow-2xl overflow-hidden border-2 border-gray-200 dark:border-[#2a2a2a] hover:border-[#FF6B35] dark:hover:border-[#ff7043] transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_20px_60px_rgba(255,107,53,0.3)]"
            >
              {/* Brilho decorativo laranja */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#FF6B35]/10 dark:from-[#ff7043]/10 to-transparent rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
              
              {/* Badge Raridade (movido para esquerda) */}
              <div className="absolute top-6 left-6 z-20">
                <div className="bg-gradient-to-r from-[#FF6B35] to-[#FF8C5A] dark:from-[#ff7043] dark:to-[#ff8a65] text-white px-4 py-2 rounded-full shadow-xl flex items-center gap-2 border-2 border-white dark:border-[#1a1a1a]">
                  <Star className="w-4 h-4 fill-current" />
                  <span style={{ fontSize: '12px', fontWeight: '700' }}>{product.rarity.toUpperCase()}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-8">
                {/* Imagem do Produto */}
                <div className="relative flex flex-col gap-4">
                  {/* Frame laranja com imagem menor */}
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#FF6B35]/20 dark:from-[#ff7043]/20 to-[#FF8C5A]/20 dark:to-[#ff8a65]/20 rounded-2xl border-4 border-[#FF6B35]/50 dark:border-[#ff7043]/50 shadow-inner"></div>
                    
                    <div className="relative bg-white/80 dark:bg-[#0f0f0f]/80 backdrop-blur-sm rounded-2xl p-6 flex items-center justify-center overflow-hidden group-hover:scale-105 transition-transform duration-500" style={{ height: '280px' }}>
                      <ImageWithFallback
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-contain drop-shadow-2xl"
                      />
                    </div>

                    {/* Selo Autenticidade */}
                    <div className="absolute -bottom-3 -right-3 bg-gradient-to-br from-[#FF6B35] to-[#FF8C5A] dark:from-[#ff7043] dark:to-[#ff8a65] text-white p-3 rounded-full shadow-2xl border-4 border-white dark:border-[#1a1a1a]">
                      <BadgeCheck className="w-8 h-8" />
                    </div>
                  </div>

                  {/* Info adicional para preencher espaço */}
                  <div className="bg-gradient-to-r from-[#FFF5F0] dark:from-[#2a2a2a] to-white dark:to-[#1a1a1a] p-4 rounded-xl border-2 border-[#FF6B35]/20 dark:border-[#ff7043]/20">
                    <p className="text-gray-700 dark:text-gray-300 text-center" style={{ fontSize: '12px' }}>
                      ✨ <span style={{ fontWeight: '600' }}>Peça de Colecionador</span> ✨
                    </p>
                    <p className="text-gray-600 dark:text-gray-400 text-center mt-1" style={{ fontSize: '11px' }}>
                      Unidade limitada e autêntica
                    </p>
                  </div>
                </div>

                {/* Informações do Produto */}
                <div className="flex flex-col justify-between">
                  <div>
                    <h3 className="text-gray-900 dark:text-white mb-2" style={{ fontSize: '24px', fontWeight: '700' }}>
                      {product.name}
                    </h3>
                    
                    <p className="text-[#FF6B35] dark:text-[#ff7043] mb-4" style={{ fontSize: '16px', fontWeight: '600' }}>
                      {product.season}
                    </p>

                    {/* Evento Histórico */}
                    {product.historicalEvent && (
                      <div className="bg-[#FFF5F0] dark:bg-[#2a2a2a] border-l-4 border-[#FF6B35] dark:border-[#ff7043] p-3 rounded-r-lg mb-4">
                        <p className="text-gray-900 dark:text-gray-200" style={{ fontSize: '14px' }}>
                          <span className="font-semibold">⚽ Momento Histórico:</span>
                          <br />
                          {product.historicalEvent}
                        </p>
                      </div>
                    )}

                    {/* Detalhes */}
                    <div className="space-y-3 mb-6">
                      <div className="flex items-start gap-2">
                        <Shield className="w-5 h-5 text-[#FF6B35] dark:text-[#ff7043] mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-gray-700 dark:text-gray-300" style={{ fontSize: '14px', fontWeight: '600' }}>
                            Estado de Conservação
                          </p>
                          <p className="text-gray-600 dark:text-gray-400" style={{ fontSize: '13px' }}>
                            {product.condition}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <Tag className="w-5 h-5 text-black dark:text-white mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-gray-700 dark:text-gray-300" style={{ fontSize: '14px', fontWeight: '600' }}>
                            Etiqueta Original
                          </p>
                          <p className="text-gray-600 dark:text-gray-400" style={{ fontSize: '13px' }}>
                            {product.hasOriginalTag ? "✓ Preservada e autêntica" : "Sem etiqueta"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <Award className="w-5 h-5 text-[#FF6B35] dark:text-[#ff7043] mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-gray-700 dark:text-gray-300" style={{ fontSize: '14px', fontWeight: '600' }}>
                            Nível de Raridade
                          </p>
                          <p className="text-gray-600 dark:text-gray-400" style={{ fontSize: '13px' }}>
                            {product.rarity}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Preço e CTA */}
                  <div>
                    <div className="bg-gradient-to-r from-[#FFF5F0] to-white dark:from-[#2a2a2a] dark:to-[#1a1a1a] p-4 rounded-xl border-2 border-[#FF6B35] dark:border-[#ff7043] mb-4">
                      <p className="text-gray-600 dark:text-gray-400 mb-1" style={{ fontSize: '13px' }}>
                        Valor de Colecionador
                      </p>
                      <div className="flex items-baseline gap-2">
                        <span className="text-[#FF6B35] dark:text-[#ff7043]" style={{ fontSize: '36px', fontWeight: '700' }}>
                          R$ {product.price.toFixed(2)}
                        </span>
                      </div>
                      <p className="text-gray-500 dark:text-gray-400 mt-1" style={{ fontSize: '12px' }}>
                        ou 12x de R$ {(product.price / 12).toFixed(2)} sem juros
                      </p>
                    </div>

                    <button
                      onClick={() => onAddToCart(product)}
                      className="w-full bg-gradient-to-r from-[#FF6B35] to-[#FF8C5A] dark:from-[#ff7043] dark:to-[#ff8a65] hover:from-[#FF5520] hover:to-[#FF6B35] dark:hover:from-[#ff5722] dark:hover:to-[#ff7043] text-white py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-2xl hover:scale-105 flex items-center justify-center gap-2"
                      style={{ fontSize: '16px', fontWeight: '600' }}
                    >
                      <Sparkles className="w-5 h-5" />
                      ADICIONAR À COLEÇÃO
                    </button>

                    <p className="text-center text-gray-500 dark:text-gray-400 mt-3" style={{ fontSize: '12px' }}>
                      🔒 Compra 100% segura e certificada
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}