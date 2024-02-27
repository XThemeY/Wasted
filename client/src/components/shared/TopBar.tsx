import { INavLink } from '@/types';
import { topBarLinks } from '@/utils/constants';
import { NavLink, useLocation } from 'react-router-dom';

const TopBar = () => {
  const { pathname } = useLocation();

  return (
    <nav className="topBarNav">
      <ul className="flex gap-1">
        {topBarLinks.map((link: INavLink) => {
          const isActive = pathname === link.route;
          return (
            <li
              key={link.label}
              className={`nav-link group relative ${isActive && 'link-active'}`}
            >
              <NavLink className="flex items-center gap-4 p-3" to={link.route}>
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
