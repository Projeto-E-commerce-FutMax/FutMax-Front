import { Facebook, Instagram, Twitter, Shield, Award, Tag } from "lucide-react";
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="bg-gray-100 dark:bg-[#1a1a1a] text-gray-800 dark:text-white mt-20 border-t border-gray-200 dark:border-[#2a2a2a]">
      {/* Seção de Garantias */}
      <div className="border-b border-gray-200 dark:border-[#2a2a2a]">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-[#FF6B35]/10 dark:bg-[#ff7043]/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-[#FF6B35] dark:text-[#ff7043]" />
              </div>
              <h3 className="mb-2 text-gray-800 dark:text-white" style={{ fontSize: '18px', fontWeight: '600' }}>
                Autenticidade Verificada
              </h3>
              <p className="text-gray-600 dark:text-gray-400" style={{ fontSize: '14px' }}>
                Todas as peças são verificadas por especialistas
              </p>
            </div>

            <div className="text-center">
              <div className="bg-[#FF6B35]/10 dark:bg-[#ff7043]/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-[#FF6B35] dark:text-[#ff7043]" />
              </div>
              <h3 className="mb-2 text-gray-800 dark:text-white" style={{ fontSize: '18px', fontWeight: '600' }}>
                Peças de Colecionador
              </h3>
              <p className="text-gray-600 dark:text-gray-400" style={{ fontSize: '14px' }}>
                Edições limitadas e raras que marcaram a história
              </p>
            </div>

            <div className="text-center">
              <div className="bg-[#FF6B35]/10 dark:bg-[#ff7043]/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Tag className="w-8 h-8 text-[#FF6B35] dark:text-[#ff7043]" />
              </div>
              <h3 className="mb-2 text-gray-800 dark:text-white" style={{ fontSize: '18px', fontWeight: '600' }}>
                Estado Impecável
              </h3>
              <p className="text-gray-600 dark:text-gray-400" style={{ fontSize: '14px' }}>
                Camisetas conservadas em excelente estado
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <h3 className="italic mb-4 bg-gradient-to-r from-[#FF6B35] to-[#FF8C5A] dark:from-[#ff7043] dark:to-[#ff8a65] bg-clip-text text-transparent" style={{ fontSize: '24px', fontWeight: '700' }}>FutMax</h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed" style={{ fontSize: '14px' }}>
              A maior loja de camisas de futebol do Brasil. Qualidade garantida e entrega rápida.
            </p>
            <div className="flex gap-3 mt-6">
              <a href="#" className="w-10 h-10 bg-gray-200 dark:bg-[#2a2a2a] rounded-lg flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-white hover:bg-[#FF6B35] dark:hover:bg-[#ff7043]">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-200 dark:bg-[#2a2a2a] rounded-lg flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-white hover:bg-[#FF6B35] dark:hover:bg-[#ff7043]">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-200 dark:bg-[#2a2a2a] rounded-lg flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-white hover:bg-[#FF6B35] dark:hover:bg-[#ff7043]">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Categorias */}
          <div>
            <h4 className="mb-4 text-gray-800 dark:text-white">Categorias</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/camisas" className="text-gray-600 dark:text-gray-400 hover:text-[#FF6B35] dark:hover:text-[#ff7043]" style={{ fontSize: '14px' }}>
                  Camisas Nacionais
                </Link>
              </li>
              <li>
                <Link to="/camisas" className="text-gray-600 dark:text-gray-400 hover:text-[#FF6B35] dark:hover:text-[#ff7043]" style={{ fontSize: '14px' }}>
                  Camisas Internacionais
                </Link>
              </li>
              <li>
                <Link to="/camisas" className="text-gray-600 dark:text-gray-400 hover:text-[#FF6B35] dark:hover:text-[#ff7043]" style={{ fontSize: '14px' }}>
                  Seleções
                </Link>
              </li>
              <li>
                <Link to="/camisas" className="text-gray-600 dark:text-gray-400 hover:text-[#FF6B35] dark:hover:text-[#ff7043]" style={{ fontSize: '14px' }}>
                  Retrô
                </Link>
              </li>
            </ul>
          </div>

          {/* Atendimento */}
          <div>
            <h4 className="mb-4 text-gray-800 dark:text-white">Atendimento</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-[#FF6B35] dark:hover:text-[#ff7043]" style={{ fontSize: '14px' }}>
                  Central de Ajuda
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-[#FF6B35] dark:hover:text-[#ff7043]" style={{ fontSize: '14px' }}>
                  Trocas e Devoluções
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-[#FF6B35] dark:hover:text-[#ff7043]" style={{ fontSize: '14px' }}>
                  Fale Conosco
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-[#FF6B35] dark:hover:text-[#ff7043]" style={{ fontSize: '14px' }}>
                  Rastreamento
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="mb-4 text-gray-800 dark:text-white">Newsletter</h4>
            <p className="text-gray-600 dark:text-gray-400 mb-4" style={{ fontSize: '14px' }}>
              Receba ofertas exclusivas e novidades
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Seu email"
                className="bg-white dark:bg-[#2a2a2a] text-gray-900 dark:text-white px-4 py-2.5 rounded-lg flex-1 outline-none border border-gray-300 dark:border-[#2a2a2a] focus:border-[#FF6B35] dark:focus:border-[#ff7043] placeholder:text-gray-400"
                style={{ fontSize: '14px' }}
              />
              <button className="bg-[#FF6B35] dark:bg-[#ff7043] text-white px-6 py-2.5 rounded-lg hover:opacity-90">
                →
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-[#2a2a2a] mt-12 pt-8 text-center">
          <p className="text-gray-600 dark:text-gray-400" style={{ fontSize: '14px' }}>
            © 2025 <span className="text-[#FF6B35] dark:text-[#ff7043]">FutMax</span>. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
