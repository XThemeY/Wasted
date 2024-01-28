import { Link, NavLink, useLocation } from 'react-router-dom';
import { Button } from '../ui/button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { navLinks } from '@/utils/constants';
import { INavLink } from '@/types/';
import { useLogoutMutation, logOut } from '@/store/slices/';
import { useAppSelector, useAppDispatch } from '@/hooks/redux';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

const LeftSidebar = () => {
  const { pathname } = useLocation();
  const [logout] = useLogoutMutation();
  const dispatch = useAppDispatch();

  const { username, isLogedIn, avatarUrl } = useAppSelector(
    (state) => state.user,
  );
  async function onExit() {
    await logout(username);
    dispatch(logOut());
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
        <Link
          to={isLogedIn ? username! : '/login'}
          className="flex items-center gap-3"
        >
          <img
            src={avatarUrl}
            alt="profile"
            className="h-14 w-14 rounded-full"
          />
          <div className="flex flex-col">
            {isLogedIn ? (
              <>
                <p className="body-bold">{username}</p>
                <div className="small-regular text-light-3">@{username}</div>
              </>
            ) : (
              <p className="body-bold">Log in</p>
            )}
          </div>
        </Link>
        <ul className="flex flex-col gap-1">
          {navLinks.map((link: INavLink) => {
            const isActive = pathname === link.route;

            return (
              <li
                key={link.label}
                className={`nav-link group relative ${isActive && 'link-active'}`}
              >
                <NavLink
                  className="flex items-center gap-4 p-3"
                  to={link.route}
                >
                  <FontAwesomeIcon
                    icon={link.imgURL as IconProp}
                    className="flex w-8 justify-center"
                  />

                  {link.label}
                </NavLink>
              </li>
            );
          })}
        </ul>
        {isLogedIn ? (
          <Button
            variant="ghost"
            className="shad-button_ghost"
            onClick={() => onExit()}
          >
            <FontAwesomeIcon icon="right-from-bracket" className="w-5" />
            <p className="small-medium lg:base-medium">Log out</p>
          </Button>
        ) : (
          ''
        )}
      </div>
    </nav>
  );
};

export default LeftSidebar;
