import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { useEffect } from 'react';

const Header = () => {
  const navigate = useNavigate();
  const isSuccess = false;

  useEffect(() => {
    if (isSuccess) navigate(0);
  }, [isSuccess]);
  return (
    <header className="header">
      <div className="flex-between px-5 py-4">
        <Link to="/" className="flex items-start gap-3">
          <img
            src="/assets/images/WASTED.pro.png"
            alt="logo"
            width={200}
            height={36}
          />
        </Link>
        <div className="flex gap-4">
          <Button
            variant="ghost"
            className="shad-button_ghost"
            onClick={() => console.log('Выход')}
          >
            <img src="/assets/icons/logout.svg" alt="logout" />
          </Button>
          <Link to={'/id'} className="flex-center gap-3">
            <img
              src={
                '/assets/images/default-avatar.png' ||
                '/assets/images/default-avatar.png'
              }
              alt="profile"
              className="h-8 w-8 rounded-full"
            />
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
