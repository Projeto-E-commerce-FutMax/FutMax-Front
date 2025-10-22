import { User, Mail, Phone, CreditCard, MapPin, Edit2, LogOut, Save, X } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { toast } from "sonner@2.0.3";

interface ProfileProps {
  user: { email: string; name: string } | null;
  onLogout: () => void;
}

export function Profile({ user, onLogout }: ProfileProps) {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "(11) 99999-9999",
    cpf: "123.456.789-00",
    cep: "88711-11",
    address: "Av. Patrício Lima, 442",
  });

  const handleLogout = () => {
    onLogout();
    navigate("/");
  };

  const handleSave = () => {
    setIsEditing(false);
    toast.success("Informações atualizadas com sucesso!");
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
      phone: "(11) 99999-9999",
      cpf: "123.456.789-00",
      cep: "88711-11",
      address: "Av. Patrício Lima, 442",
    });
  };

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white dark:bg-[#1a1a1a] rounded-xl border border-gray-200 dark:border-[#2a2a2a] p-8 text-center transition-all duration-300">
          <User className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h2 className="mb-4 text-gray-900 dark:text-white">Você não está logado</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Faça login para acessar seu perfil e gerenciar suas informações.
          </p>
          <Link to="/login">
            <button className="bg-[#FF6B35] dark:bg-[#ff7043] text-white px-8 py-3 rounded-xl hover:bg-[#e55a2b] dark:hover:bg-[#ff5722] transition-all duration-300 hover:scale-105 shadow-lg dark:shadow-[#ff7043]/30">
              Fazer Login
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="bg-white dark:bg-[#1a1a1a] rounded-xl border border-gray-200 dark:border-[#2a2a2a] p-8 transition-all duration-300">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8 pb-8 border-b border-gray-200 dark:border-[#2a2a2a]">
          <div className="w-20 h-20 bg-[#FF6B35] dark:bg-[#ff7043] rounded-full flex items-center justify-center text-white transition-colors duration-300">
            <User className="w-10 h-10" />
          </div>
          <div>
            <h2 className="text-gray-900 dark:text-white">{user.name}</h2>
            <p className="text-gray-500 dark:text-gray-400">{user.email}</p>
          </div>
        </div>

        {/* Personal Information */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-gray-900 dark:text-white">Informações Pessoais</h3>
            {!isEditing && (
              <button 
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 text-[#FF6B35] dark:text-[#ff7043] hover:underline transition-colors duration-300"
              >
                <Edit2 className="w-4 h-4" />
                Editar Informações
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-gray-600 dark:text-gray-400 mb-2 block" style={{ fontSize: '14px' }}>
                Nome Completo
              </label>
              {isEditing ? (
                <div className="flex items-center gap-3 p-3 border border-gray-300 dark:border-[#2a2a2a] rounded-xl focus-within:border-[#FF6B35] dark:focus-within:border-[#ff7043] bg-white dark:bg-[#0f0f0f] transition-all duration-300">
                  <User className="w-5 h-5 text-[#FF6B35] dark:text-[#ff7043]" />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="flex-1 outline-none bg-transparent text-gray-900 dark:text-white"
                  />
                </div>
              ) : (
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-[#2a2a2a] rounded-xl">
                  <User className="w-5 h-5 text-[#FF6B35] dark:text-[#ff7043]" />
                  <span className="text-gray-900 dark:text-white">{formData.name}</span>
                </div>
              )}
            </div>

            <div>
              <label className="text-gray-600 dark:text-gray-400 mb-2 block" style={{ fontSize: '14px' }}>
                E-mail
              </label>
              {isEditing ? (
                <div className="flex items-center gap-3 p-3 border border-gray-300 dark:border-[#2a2a2a] rounded-xl focus-within:border-[#FF6B35] dark:focus-within:border-[#ff7043] bg-white dark:bg-[#0f0f0f] transition-all duration-300">
                  <Mail className="w-5 h-5 text-[#FF6B35] dark:text-[#ff7043]" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="flex-1 outline-none bg-transparent text-gray-900 dark:text-white"
                  />
                </div>
              ) : (
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-[#2a2a2a] rounded-xl">
                  <Mail className="w-5 h-5 text-[#FF6B35] dark:text-[#ff7043]" />
                  <span className="text-gray-900 dark:text-white">{formData.email}</span>
                </div>
              )}
            </div>

            <div>
              <label className="text-gray-600 dark:text-gray-400 mb-2 block" style={{ fontSize: '14px' }}>
                Telefone
              </label>
              {isEditing ? (
                <div className="flex items-center gap-3 p-3 border border-gray-300 dark:border-[#2a2a2a] rounded-xl focus-within:border-[#FF6B35] dark:focus-within:border-[#ff7043] bg-white dark:bg-[#0f0f0f] transition-all duration-300">
                  <Phone className="w-5 h-5 text-[#FF6B35] dark:text-[#ff7043]" />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="flex-1 outline-none bg-transparent text-gray-900 dark:text-white"
                  />
                </div>
              ) : (
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-[#2a2a2a] rounded-xl">
                  <Phone className="w-5 h-5 text-[#FF6B35] dark:text-[#ff7043]" />
                  <span className="text-gray-900 dark:text-white">{formData.phone}</span>
                </div>
              )}
            </div>

            <div>
              <label className="text-gray-600 dark:text-gray-400 mb-2 block" style={{ fontSize: '14px' }}>
                CPF
              </label>
              {isEditing ? (
                <div className="flex items-center gap-3 p-3 border border-gray-300 dark:border-[#2a2a2a] rounded-xl focus-within:border-[#FF6B35] dark:focus-within:border-[#ff7043] bg-white dark:bg-[#0f0f0f] transition-all duration-300">
                  <CreditCard className="w-5 h-5 text-[#FF6B35] dark:text-[#ff7043]" />
                  <input
                    type="text"
                    value={formData.cpf}
                    onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
                    className="flex-1 outline-none bg-transparent text-gray-900 dark:text-white"
                  />
                </div>
              ) : (
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-[#2a2a2a] rounded-xl">
                  <CreditCard className="w-5 h-5 text-[#FF6B35] dark:text-[#ff7043]" />
                  <span className="text-gray-900 dark:text-white">{formData.cpf}</span>
                </div>
              )}
            </div>

            <div>
              <label className="text-gray-600 dark:text-gray-400 mb-2 block" style={{ fontSize: '14px' }}>
                CEP
              </label>
              {isEditing ? (
                <div className="flex items-center gap-3 p-3 border border-gray-300 dark:border-[#2a2a2a] rounded-xl focus-within:border-[#FF6B35] dark:focus-within:border-[#ff7043] bg-white dark:bg-[#0f0f0f] transition-all duration-300">
                  <MapPin className="w-5 h-5 text-[#FF6B35] dark:text-[#ff7043]" />
                  <input
                    type="text"
                    value={formData.cep}
                    onChange={(e) => setFormData({ ...formData, cep: e.target.value })}
                    className="flex-1 outline-none bg-transparent text-gray-900 dark:text-white"
                  />
                </div>
              ) : (
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-[#2a2a2a] rounded-xl">
                  <MapPin className="w-5 h-5 text-[#FF6B35] dark:text-[#ff7043]" />
                  <span className="text-gray-900 dark:text-white">{formData.cep}</span>
                </div>
              )}
            </div>

            <div>
              <label className="text-gray-600 dark:text-gray-400 mb-2 block" style={{ fontSize: '14px' }}>
                Endereço
              </label>
              {isEditing ? (
                <div className="flex items-center gap-3 p-3 border border-gray-300 dark:border-[#2a2a2a] rounded-xl focus-within:border-[#FF6B35] dark:focus-within:border-[#ff7043] bg-white dark:bg-[#0f0f0f] transition-all duration-300">
                  <MapPin className="w-5 h-5 text-[#FF6B35] dark:text-[#ff7043]" />
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="flex-1 outline-none bg-transparent text-gray-900 dark:text-white"
                  />
                </div>
              ) : (
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-[#2a2a2a] rounded-xl">
                  <MapPin className="w-5 h-5 text-[#FF6B35] dark:text-[#ff7043]" />
                  <span className="text-gray-900 dark:text-white">{formData.address}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Account Actions */}
        <div className="pt-8 border-t border-gray-200 dark:border-[#2a2a2a]">
          <h3 className="mb-4 text-gray-900 dark:text-white">Ações da Conta</h3>
          
          <div className="flex flex-col sm:flex-row gap-4">
            {isEditing ? (
              <>
                <button 
                  onClick={handleSave}
                  className="flex items-center justify-center gap-2 bg-green-600 dark:bg-green-700 text-white px-6 py-3 rounded-xl hover:bg-green-700 dark:hover:bg-green-800 transition-all duration-300 hover:scale-105"
                >
                  <Save className="w-5 h-5" />
                  Salvar Alterações
                </button>
                
                <button 
                  onClick={handleCancel}
                  className="flex items-center justify-center gap-2 bg-gray-500 dark:bg-gray-600 text-white px-6 py-3 rounded-xl hover:bg-gray-600 dark:hover:bg-gray-700 transition-all duration-300 hover:scale-105"
                >
                  <X className="w-5 h-5" />
                  Cancelar
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={() => setIsEditing(true)}
                  className="flex items-center justify-center gap-2 bg-[#FF6B35] dark:bg-[#ff7043] text-white px-6 py-3 rounded-xl hover:bg-[#e55a2b] dark:hover:bg-[#ff5722] transition-all duration-300 hover:scale-105 shadow-lg dark:shadow-[#ff7043]/30"
                >
                  <Edit2 className="w-5 h-5" />
                  Editar Informações
                </button>
                
                <button 
                  onClick={handleLogout}
                  className="flex items-center justify-center gap-2 bg-gray-800 dark:bg-gray-700 text-white px-6 py-3 rounded-xl hover:bg-gray-900 dark:hover:bg-gray-800 transition-all duration-300 hover:scale-105"
                >
                  <LogOut className="w-5 h-5" />
                  Deslogar
                </button>
              </>
            )}
          </div>

          <div className="mt-6 p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-700/30 rounded-xl transition-colors duration-300">
            <p className="text-orange-800 dark:text-orange-200" style={{ fontSize: '14px' }}>
              <span className="font-semibold">Informação Importante:</span> Mantenha suas informações sempre atualizadas para garantir a segurança da sua conta e receber comunicações importantes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}