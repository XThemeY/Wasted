import { Link, useNavigate, NavLink, useLocation } from 'react-router-dom';
import { Button } from '../ui/button';
import { signOutAccount } from '@/lib/redux/Slices/signOutSlice';
import { useEffect } from 'react';
import { navLinks } from '@/constants';
import { INavLink } from '@/types/interfaces/INavLink';

const LeftSidebar = () => {
  const { pathname } = useLocation();

  const navigate = useNavigate();
  const isSuccess = false;

  useEffect(() => {
    if (isSuccess) navigate(0);
  }, [isSuccess]);
  return (
    <nav className="nav">
      <div className="flex flex-col gap-5">
        <Link to="/" className="flex items-center gap-3">
          <img
            src="/assets/images/WASTED.pro.png"
            alt="logo"
            width={200}
            height={36}
          />
        </Link>
        <Link to={'/profile'} className="flex items-center gap-3">
          <img
            src={
              '/assets/images/default-avatar.png' ||
              '/assets/images/default-avatar.png'
            }
            alt="profile"
            className="h-14 w-14 rounded-full"
          />
          <div className="flex flex-col">
            <p className="body-bold">XTheme</p>
            <div className="small-regular text-light-3">@XTheme</div>
          </div>
        </Link>

        <ul className="flex flex-col gap-1">
          {navLinks.map((link: INavLink) => {
            const isActive = pathname === link.route;
            return (
              <li
                key={link.label}
                className={`nav-link group ${isActive && 'bg-primary-500'}`}
              >
                <NavLink
                  className="flex items-center gap-4 p-3"
                  to={link.route}
                >
                  <img
                    src={link.imgURL}
                    alt={link.label}
                    className={`group-hover:invert-white ${isActive && 'invert-white'}`}
                  />
                  {link.label}
                </NavLink>
              </li>
            );
          })}
        </ul>
        <Button
          variant="ghost"
          className="shad-button_ghost"
          onClick={() => signOutAccount()}
        >
          <img src="/assets/icons/logout.svg" alt="logout" />
          <p className="small-medium lg:base-medium">Logout</p>
        </Button>
      </div>
    </nav>
  );
};

export default LeftSidebar;
