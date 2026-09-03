import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./css/LoginPage.css";

function ResetPasswordPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const userId = searchParams.get("userId");
    const token = searchParams.get("token");

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const handleResetPassword = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setLoading(true);

        try {
            await axios.post(
                "https://localhost:7226/api/auth/reset-password",
                {
                    userId: userId,
                    resetCode: token,
                    newPassword: password
                }
            );

            setSuccess(
                "Your password has been reset successfully. You can now log in."
            );

            setTimeout(() => {
                navigate("/login");
            }, 2000);

        } catch (error) {
            console.error("Password reset failed:", error);

            if (error.response) {
                setError(
                    error.response.data?.message ||
                    "The password reset link is invalid or has expired."
                );
            } else {
                setError("Could not connect to the server.");
            }
        } finally {
            setLoading(false);
        }
    };

    if (!userId || !token) {
        return (
            <div className="login-page">
                <header className="navbar">
                    <h1 className="logo">Personal Health Passport</h1>
                </header>

                <main className="login-content">
                    <div className="login-card">
                        <h2>Invalid reset link</h2>

                        <p className="login-subtitle">
                            This password reset link is missing required
                            information or is invalid.
                        </p>

                        <button
                            className="continue-button"
                            onClick={() => navigate("/login")}
                        >
                            Return to login
                        </button>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="login-page">
            <header className="navbar">
                <h1 className="logo">Personal Health Passport</h1>

                <nav>
                    <a href="/">Home</a>
                    <a href="/login">Log in</a>
                </nav>
            </header>

            <main className="login-content">
                <div className="login-card">

                    {!success ? (
                        <>
                            <h2>Reset your password</h2>

                            <p className="login-subtitle">
                                Enter a new password for your account.
                            </p>

                            <form onSubmit={handleResetPassword}>

                                <label htmlFor="password">
                                    New password
                                </label>

                                <input
                                    id="password"
                                    type="password"
                                    placeholder="Enter your new password"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    required
                                />

                                <label htmlFor="confirm-password">
                                    Confirm password
                                </label>

                                <input
                                    id="confirm-password"
                                    type="password"
                                    placeholder="Confirm your new password"
                                    value={confirmPassword}
                                    onChange={(e) =>
                                        setConfirmPassword(e.target.value)
                                    }
                                    required
                                />

                                {error && (
                                    <p className="login-error">
                                        {error}
                                    </p>
                                )}

                                <button
                                    type="submit"
                                    className="continue-button"
                                    disabled={loading}
                                >
                                    {loading
                                        ? "Resetting..."
                                        : "Reset password"}
                                </button>

                            </form>

                            <button
                                className="back-button"
                                type="button"
                                onClick={() => navigate("/login")}
                            >
                                ← Back to login
                            </button>
                        </>
                    ) : (
                        <>
                            <h2>Password reset</h2>

                            <p className="login-subtitle">
                                {success}
                            </p>

                            <p className="login-subtitle">
                                Redirecting you to the login page...
                            </p>
                        </>
                    )}

                </div>
            </main>
        </div>
    );
}

export default ResetPasswordPage;