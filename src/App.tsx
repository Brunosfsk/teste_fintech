import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthMicrofrontend } from './microfrontends/auth';
import { ClientsMicrofrontend } from './microfrontends/clients';
import { ClientDetailMicrofrontend } from './microfrontends/client-detail';
import { useUserStore } from './store/userStore';

const App: React.FC = () => {
  const user = useUserStore((state) => state.user);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthMicrofrontend />} />
        <Route 
          path="/clientes" 
          element={user ? <ClientsMicrofrontend /> : <Navigate to="/" />} 
        />
        <Route 
          path="/cliente/:id" 
          element={user ? <ClientDetailMicrofrontend /> : <Navigate to="/" />} 
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;
