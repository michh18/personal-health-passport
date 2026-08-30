import { useState } from "react";
import "./css/LoginPage.css";

function LoginPage() {
    const [email, setEmail] = useState("");
    const [step, setStep] = useState("email");

    const handleContinue = async (e) => {
        e.preventDefault();

        if (!email) return;

        // TODO: Call your backend here to check whether
        // the email is registered.
        //
        // Example response:
        // { exists: true }  -> password
        // { exists: false } -> signup

        const emailExists = true; // temporary

        if (emailExists) {
            setStep("password");
        } else {
            setStep("signup");
        }
    };

    return (
        <div className="login-page">

            <header className="navbar">
                <h1 className="logo">Personal Health Passport</h1>

                <nav>
                    <a href="#how-it-works">How it works</a>
                    <a href="/upload">Upload Notes</a>
                    <button className="login-button">Log in</button>
                    <button className="register-button">Register</button>
                </nav>
            </header>

            <main className="login-content">

                <div className="login-card">

                    {step === "email" && (
                        <>
                            <h2>Welcome back</h2>
                            <p className="login-subtitle">
                                Enter your email to continue
                            </p>

                            <form onSubmit={handleContinue}>
                                <label htmlFor="email">Email</label>

                                <input
                                    id="email"
                                    type="email"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />

                                <button
                                    type="submit"
                                    className="continue-button"
                                >
                                    Continue
                                </button>
                            </form>
                        </>
                    )}

                    {step === "password" && (
                        <>
                            <h2>Welcome back</h2>

                            <p className="login-subtitle">
                                Enter your password to continue
                            </p>

                            <form>
                                <label htmlFor="password">Password</label>

                                <input
                                    id="password"
                                    type="password"
                                    placeholder="Enter your password"
                                    required
                                />

                                <button
                                    type="submit"
                                    className="continue-button"
                                >
                                    Log in
                                </button>
                            </form>

                            <button
                                className="back-button"
                                onClick={() => setStep("email")}
                            >
                                ← Use a different email
                            </button>
                        </>
                    )}

                    {step === "signup" && (
                        <>
                            <h2>Create your account</h2>

                            <p className="login-subtitle">
                                We couldn't find an account with this email.
                            </p>

                            <form>
                                <label htmlFor="signup-email">Email</label>

                                <input
                                    id="signup-email"
                                    type="email"
                                    value={email}
                                    readOnly
                                />

                                <label htmlFor="name">Name</label>

                                <input
                                    id="name"
                                    type="text"
                                    placeholder="Your name"
                                    required
                                />

                                <label htmlFor="signup-password">
                                    Password
                                </label>

                                <input
                                    id="signup-password"
                                    type="password"
                                    placeholder="Create a password"
                                    required
                                />

                                <button
                                    type="submit"
                                    className="continue-button"
                                >
                                    Create account
                                </button>
                            </form>

                            <button
                                className="back-button"
                                onClick={() => setStep("email")}
                            >
                                ← Use a different email
                            </button>
                        </>
                    )}

                </div>

            </main>
        </div>
    );
}

export default LoginPage;

