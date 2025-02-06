import { Outlet, useLocation } from 'react-router-dom';
import Footer from '../Footer';
import AuthHeader from '../Header/AuthHeader';
import DefaultHeader from '../Header/DefaultHeader';
import { useUser } from '@/store/userStore';

export default function MainLayout() {
  const { isAuthenticated } = useUser();
  const location = useLocation();

  const isCollectionPage = location.pathname === '/collection';

  return (
    <div
      className={`${isCollectionPage ? 'bg-main-beige' : 'bg-main-background'}`}>
      {isAuthenticated ? <AuthHeader /> : <DefaultHeader />}

      {/* background option */}
      {isCollectionPage ? (
        <img
          src="/Collection/field-background.png"
          alt="collection 배경"
          className="absolute top-[100px] left-0 w-full h-[682px]"
        />
      ) : null}

      {/* 최소 높이 주는 css 삭제 */}
      <div className="flex w-3/4 justify-center items-center mx-auto border-solid border-2 border-indigo-600">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}
