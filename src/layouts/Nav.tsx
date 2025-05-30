import { NavLink } from 'react-router-dom'

export function Nav() {
  return (
    <nav className="container mx-auto p-6">
      <ul className="flex gap-6">
        <li>
          <NavLink
            to="/"
            className={({ isActive }) =>
              `text-base-200 hover:text-white ${isActive ? 'font-bold' : ''}`
            }
          >
            Home
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/structures"
            className={({ isActive }) =>
              `text-base-200 hover:text-white ${isActive ? 'font-bold' : ''}`
            }
          >
            Structures
          </NavLink>
        </li>
      </ul>
    </nav>
  )
}
