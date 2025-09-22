import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../store/userStore';
import Logo from '../assets/Logo.png';

interface HeaderProps {
  onMenuToggle: () => void;
  isSidebarOpen: boolean;
}

const Header: React.FC<HeaderProps> = ({ onMenuToggle, isSidebarOpen }) => {
  const navigate = useNavigate();
  const { user, clearUser } = useUserStore();

  const handleLogout = () => {
    clearUser();
    navigate('/');
  };

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <header className="bg-white shadow rounded-lg fixed top-0 left-0 right-0 z-30" style={{ height: '100px' }}>
      {/* Container seguindo padrão das tabelas */}
      <div className="w-full max-w-[1200px] 2xl:max-w-[80%] mx-auto h-full">
        <div className="flex flex-col gap-4 p-6 h-full">
          <div className="flex items-center justify-between h-full">
          {/* Logo à esquerda com hambúrguer */}
          <div className="flex items-center space-x-6">
            {/* Ícone hambúrguer mais à esquerda */}
            <button
              onClick={onMenuToggle}
              className="p-2 rounded-md hover:bg-gray-100 transition-colors duration-200 -ml-2"
              aria-label="Toggle sidebar"
            >
              <div className="w-6 h-6 flex flex-col justify-center items-center relative">
                <div className={`w-5 h-0.5 bg-gray-600 transition-all duration-300 absolute ${isSidebarOpen ? 'rotate-45' : 'top-1'}`}></div>
                <div className={`w-5 h-0.5 bg-gray-600 transition-all duration-300 ${isSidebarOpen ? 'opacity-0' : 'opacity-100'}`}></div>
                <div className={`w-5 h-0.5 bg-gray-600 transition-all duration-300 absolute ${isSidebarOpen ? '-rotate-45' : 'bottom-1'}`}></div>
              </div>
            </button>
            {/* Logo com tamanho aumentado para 100px x 50px */}
            <div className="flex items-center">
              <img src={Logo} alt="Logo" className="object-contain" style={{ width: '100px', height: '50px' }} />
            </div>
          </div>
          
          {/* Menu desktop - centralizado */}
          <nav className="hidden md:flex items-center justify-center flex-1">
            <div className="flex items-center space-x-8">
              <button
                onClick={() => handleNavigation('/clientes')}
                className="text-gray-600 hover:text-[#EC6724] transition-all duration-200 font-medium py-2 px-4 relative group"
              >
                Clientes
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#EC6724] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></span>
              </button>
              <button
                onClick={() => handleNavigation('/clientes-selecionados')}
                className="text-gray-600 hover:text-[#EC6724] transition-all duration-200 font-medium py-2 px-4 relative group"
              >
                Clientes selecionados
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#EC6724] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></span>
              </button>
              <button
                onClick={handleLogout}
                className="text-gray-600 hover:text-[#EC6724] transition-all duration-200 font-medium py-2 px-4 relative group"
              >
                Sair
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#EC6724] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></span>
              </button>
            </div>
          </nav>
          
          {/* Informação do usuário - à direita */}
          {user && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Olá,</span>
              <span className="text-sm font-medium text-gray-800">{user}!</span>
            </div>
          )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;