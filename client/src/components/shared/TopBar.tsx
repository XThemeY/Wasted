import { useAppSelector } from '@/hooks/redux';
import { INavLink } from '@/types';
import { topBarLinks } from '@/utils/constants';
import { NavLink } from 'react-router-dom';

const TopBar = () => {
  const { username, isLogedIn } = useAppSelector((state) => state.user);

  return (
    <nav className="topBarNav">
      <ul className="flex gap-1">
        {topBarLinks.map((link: INavLink) => {
          return (
            <li key={link.label} className={`nav-link group `}>
              <NavLink
                className="flex items-center gap-4 p-3"
                to={isLogedIn ? username + link.route : '/login'}
              >
                {link.label}
              </NavLink>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default TopBar;
