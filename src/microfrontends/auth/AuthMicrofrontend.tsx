import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../../store/userStore';

const AuthMicrofrontend: React.FC = () => {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const setUser = useUserStore((state) => state.setUser);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError('Por favor, insira seu nome');
      return;
    }

    if (name.trim().length < 2) {
      setError('O nome deve ter pelo menos 2 caracteres');
      return;
    }

    setError('');
    setUser(name.trim());
    navigate('/clientes');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-5 gradient-dark">
      <div className="card max-w-md w-full animate-fade-in">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gradient mb-2 md:text-2xl">
            Sistema de Clientes
          </h1>
          <p className="text-gray-600">Entre com seu nome para continuar</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <input
              type="text"
              placeholder="Digite seu nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={50}
              className={`input-field ${error ? 'input-error' : ''}`}
            />
            {error && (
              <p className="text-red-500 text-sm mt-2 animate-fade-in">
                {error}
              </p>
            )}
          </div>
          
          <button 
            type="submit" 
            disabled={!name.trim()}
            className="btn-primary w-full"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthMicrofrontend;