import LeftSideBar from '@/components/shared/LeftSideBar';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import { Outlet } from 'react-router-dom';
import BottomBar from '@/components/shared/BottomBar';
import TopBar from '@/components/shared/TopBar';

const RootLayout = () => {
  return (
    <div className="container md:flex">
      <Header />
      <LeftSideBar />
      <section className="flex h-full flex-1 flex-col">
        <TopBar />
        <Outlet />
      </section>
      <Footer />
      <BottomBar />
    </div>
  );
};

export default RootLayout;
