import LeftSideBar from '@/components/shared/LeftSideBar';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import { Outlet } from 'react-router-dom';
import BottomBar from '@/components/shared/BottomBar';

const RootLayout = () => {
  return (
    <div className="container md:flex">
      <Header />
      <LeftSideBar />
      <section className="flex h-full flex-1">
        <Outlet />
      </section>
      <Footer />
      <BottomBar />
    </div>
  );
};

export default RootLayout;
