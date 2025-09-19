import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface SidebarProps {
  selectedClientsCount: number;
}

const Sidebar: React.FC<SidebarProps> = ({ selectedClientsCount }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      id: 'home',
      label: 'Home',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
      path: '/',
      active: location.pathname === '/'
    },
    {
      id: 'clients',
      label: 'Clientes',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
        </svg>
      ),
      path: '/clientes',
      active: location.pathname === '/clientes'
    },
    {
      id: 'selected-clients',
      label: 'Clientes Selecionados',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      path: '/clientes-selecionados',
      active: location.pathname === '/clientes-selecionados',
      badge: selectedClientsCount > 0 ? selectedClientsCount : undefined
    }
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <div className="w-48 bg-white shadow-lg h-screen fixed left-0 top-0 z-10">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-xl font-bold" style={{ color: '#EC6724' }}>
          Sistema Fintech
        </h1>
      </div>
      
      <nav className="mt-6">
        <ul className="space-y-2 px-4">
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => handleNavigation(item.path)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 text-left ${
                  item.active
                    ? 'text-white shadow-md'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                style={{
                  backgroundColor: item.active ? '#EC6724' : 'transparent'
                }}
              >
                <div className="flex items-center space-x-3">
                  {item.icon}
                  <span className="font-medium">{item.label}</span>
                </div>
                {item.badge && (
                  <span 
                    className="px-2 py-1 text-xs font-bold text-white rounded-full"
                    style={{ backgroundColor: '#EC6724' }}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;