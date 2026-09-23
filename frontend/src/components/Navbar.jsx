import { Link } from "react-router-dom";
import "./css/Navbar.css";

/**
 * variant="marketing" — full nav shown on the homepage (how it works,
 * upload notes, log in, register).
 * variant="auth" — trimmed nav shown on the login/register page, since
 * showing "Log in" / "Register" again there is redundant with the form
 * itself, and the "How it works" anchor doesn't exist on that route.
 */
function Navbar({ variant = "marketing" }) {
    return (
        <header className="navbar">
            <Link to="/" className="logo-link">
                <h1 className="logo">Personal Health Passport</h1>
            </Link>

            <nav>
                {variant === "marketing" && (
                    <>
                        <a href="#how-it-works">How it works</a>
                        <Link to="/upload">Upload Notes</Link>
                        <Link to="/login" className="login-button">Log in</Link>
                        <Link to="/register" className="register-button">Register</Link>
                    </>
                )}

                {variant === "auth" && (
                    <Link to="/" className="back-link">Back to home</Link>
                )}
            </nav>
        </header>
    );
}

export default Navbar;