import { Routes, Route } from 'react-router';
import { TRPCProvider } from '@/providers/trpc';
import HomePage from './pages/Home';
import Login from './pages/Login';
import Admin from './pages/Admin';
import NotFound from './pages/NotFound';

function App() {
  return (
    <TRPCProvider>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </TRPCProvider>
  );
}

export default App;
