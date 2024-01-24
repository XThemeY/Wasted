import { useLocation, Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '@/hooks/redux';
import { selectIsLogedIn } from '@/store/slices/userSlice';

const RequireAuth = () => {
  const isLogedIn = useAppSelector(selectIsLogedIn);
  const location = useLocation();
  return isLogedIn ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

export default RequireAuth;
