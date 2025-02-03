import { Outlet } from 'react-router-dom';
import Footer from '../Footer';
import AuthHeader from '../Header/AuthHeader';
import DefaultHeader from '../Header/DefaultHeader';
import { useUser } from '@/store/userStore';

export default function MainLayout() {
  const { isAuthenticated } = useUser();
  return (
    <div className="bg-main-background">
      {isAuthenticated ? <AuthHeader /> : <DefaultHeader />}
      {/* 최소 높이 주는 css 삭제 */}
      <div className="flex w-3/4 justify-center items-center mx-auto border-solid border-2 border-indigo-600">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}
