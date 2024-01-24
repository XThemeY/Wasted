import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';

import { navLinks } from '@/utils/constants';
import { INavLink } from '@/types/';
import { useLogoutMutation, logOut } from '@/store/slices/';
import { useAppSelector, useAppDispatch } from '@/hooks/redux';

const LeftSidebar = () => {
  const { pathname } = useLocation();
  const [logout] = useLogoutMutation();
  const dispatch = useAppDispatch();
  const { username } = useAppSelector((state) => state.user);
  const navigate = useNavigate();
  async function onExit() {
    await logout(username);
    dispatch(logOut());
    navigate('/login');
  }

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
            <p className="body-bold">{username}</p>
            <div className="small-regular text-light-3">@{username}</div>
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
          onClick={() => onExit()}
        >
          <img src="/assets/icons/logout.svg" alt="logout" />
          <p className="small-medium lg:base-medium">Log out</p>
        </Button>
      </div>
    </nav>
  );
};

export default LeftSidebar;
