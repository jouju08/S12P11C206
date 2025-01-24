import { Outlet } from 'react-router-dom';
import { useAuth } from '@/store/userStore';
import Footer from '../Footer';
import AuthHeader from '../Header/AuthHeader';
import DefaultHeader from '../Header/DefaultHeader';

export default function MainLayout() {
  const { isAuthenticated } = useAuth();
  return (
    <div>
      {isAuthenticated ? <AuthHeader /> : <DefaultHeader />}
      <div className="flex w-3/4 min-h-screen bg-slate-400 justify-center items-center mx-auto">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}
