import { Outlet, Navigate } from 'react-router-dom';

const AuthLayout = () => {
  const isAuthenticated = false;

  return (
    <>
      {isAuthenticated ? (
        <Navigate to="/" />
      ) : (
        <>
          <section className="z-10 flex flex-1 flex-col items-center justify-center  py-10">
            <Outlet />
          </section>
          <img
            src="/assets/images/side-img-1.jpg"
            alt="logo"
            className="absolute h-screen w-full bg-no-repeat object-cover "
          />
        </>
      )}
    </>
  );
};

export default AuthLayout;
