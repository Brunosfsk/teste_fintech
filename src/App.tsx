import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthMicrofrontend } from './microfrontends/auth';
import { ClientsMicrofrontend } from './microfrontends/clients';
import { ClientDetailMicrofrontend } from './microfrontends/client-detail';
import SelectedClientsMicrofrontend from './microfrontends/selected-clients';
import HomeMicrofrontend from './microfrontends/home/HomeMicrofrontend';
import { useUserStore } from './store/userStore';

const App: React.FC = () => {
  const user = useUserStore((state) => state.user);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthMicrofrontend />} />
        <Route 
          path="/home" 
          element={user ? <HomeMicrofrontend /> : <Navigate to="/" />} 
        />
        <Route 
          path="/clientes" 
          element={user ? <ClientsMicrofrontend /> : <Navigate to="/" />} 
        />
        <Route 
          path="/clientes-selecionados" 
          element={user ? <SelectedClientsMicrofrontend /> : <Navigate to="/" />} 
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
