import { NavLink } from 'react-router-dom';
import './DashboardNav.css';

function DashboardNav() {
    return (
        <nav
            className="dashboard-sidebar"
            aria-label="Health passport navigation"
        >
            <h2 className="sidebar-logo">Personal Health Passport</h2>

            <ul className="sidebar-links">
                <li>
                    <NavLink to="/dashboard">
                        Dashboard
                    </NavLink>
                </li>

                <li>
                    <NavLink to="/upload">
                        Upload clinical notes
                    </NavLink>
                </li>

                <li>
                    <NavLink to="/summaries">
                        Extracted summaries
                    </NavLink>
                </li>

                <li>
                    <NavLink to="/health-record">
                        Health record
                    </NavLink>
                </li>
            </ul>

            <NavLink to="/" className="sidebar-logout">
                Log out
            </NavLink>
        </nav>
    );
}

export default DashboardNav;