import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
// import { useState } from "react";
import "./css/LoginPage.css";
import axios from "axios";

function LoginPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [name, setName] = useState("");
    const [step, setStep] = useState(
        location.pathname === "/register" ? "signup" : "login"
    );
    const [error, setError] = useState("");

    useEffect(() => {
        setStep(location.pathname === "/register" ? "signup" : "login");
        setError("");
    }, [location.pathname]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const response = await axios.post(
                "https://localhost:7226/api/auth/login",
                {
                    email: email,
                    password: password
                }
            );

            const token = response.data.token;

            // Store the JWT so it can be used for authenticated requests
            localStorage.setItem("token", token);

            console.log("Login successful");

            // You can redirect to the dashboard here later
            window.location.href = "/dashboard";

        } catch (error) {
            if (error.response) {
                console.error(
                    "Login failed:",
                    error.response.data
                );

                if (error.response?.status === 401 || error.response?.status === 400) {
                    setError("Incorrect email or password.");
                } else {
                    setError("Something went wrong. Please try again.");
                }
            } else {
                console.error(
                    "Could not connect to the server:",
                    error
                );
            }
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError("");

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        try {
            const response = await axios.post(
                "https://localhost:7226/api/auth/register",
                {
                    email: email,
                    password: password,
                    name: name
                }
            );

            console.log("Registration successful");
            setStep("signup-success");

        } catch (error) {
            if (error.response) {
                console.error(
                    "Registration failed:",
                    error.response.data
                );

                if (error.response?.status === 401 || error.response?.status === 400) {
                    setError("Email already exists.");
                } else {
                    setError("Something went wrong. Please try again.");
                }
            } else {
                console.error(
                    "Could not connect to the server:",
                    error
                );
            }
        }
    };

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const response = await axios.post(
                "https://localhost:7226/api/auth/forgot-password",
                {
                    email: email
                }
            );

            console.log("Forgot password request successful");
            setStep("forgot-password-success");

        } catch (error) {
            if (error.response) {
                console.error(
                    "Forgot password request failed:",
                    error.response.data
                );
            } else {
                console.error(
                    "Could not connect to the server:",
                    error
                );
            }
        }
    };

    return (
        <div className="login-page">

            <header className="navbar">
                <h1 className="logo">
                    Personal Health Passport
                </h1>

                <nav>
                    <a href="#how-it-works">How it works</a>
                    <a href="/upload">Upload Notes</a>

                    <button type="button" className="login-button"onClick={() => navigate("/login")}>
                        Log in
                    </button>

                    <button type="button" className="register-button"onClick={() => navigate("/register")}>
                        Register
                    </button>
                </nav>
            </header>

            <main className="login-content">

                <div className="login-card">

                    {step === "login" && 
                    ( <>
                        <h2>Welcome back</h2>

                        <p className="login-subtitle">
                            Log in to your Personal Health Passport
                        </p>

                        <form onSubmit={handleLogin}>

                            <label htmlFor="email">
                                Email
                            </label>

                            <input
                                id="email"
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />

                            <label htmlFor="password">
                                Password
                            </label>

                            <input
                                id="password"
                                type="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />

                            <button
                                type="submit"
                                className="continue-button"
                            >
                                Log in
                            </button>

                        </form>

                        {error && (
                            <p className="login-error">
                                {error}
                            </p>
                        )}


                        <button className="back-button" type="button" onClick={() => navigate("/register")}>
                            Dont have an account?
                        </button>
                        <button className="back-button" type="button" onClick = {() => setStep("forgot-password")}>
                            Forgot your password?
                        </button>
                        

                        </>   
                    )} 


                    {step === "signup" && 
                    ( <>
                        <h2>Create your account</h2> 
                        <form onSubmit={handleRegister}> 
                            <label htmlFor="signup-email">Email</label>
                            <input id="signup-email" type="email" onChange={(e) => setEmail(e.target.value)} value={email}  placeholder="Your email" required /> 
                            <label htmlFor="name">Name</label> 
                            <input id="name" type="text" onChange={(e) => setName(e.target.value)} value={name} placeholder="Your name" required /> 
                            <label htmlFor="signup-password"> Password </label> 
                            <input id="signup-password" type="password" onChange={(e) => setPassword(e.target.value)} value={password} placeholder="Create a password" required /> 
                            <label htmlFor="confirm-signup-password"> Confirm Password </label> 
                            <input id="confirm-signup-password" type="password" onChange={(e) => setConfirmPassword(e.target.value)} value={confirmPassword} placeholder="Confirm your password" required /> 
                            <button type="submit" className="continue-button" > Create account </button> 
                        </form> 

                        {error && (
                            <p className="login-error">
                                {error}
                            </p>
                        )}
                        
                        <button className="back-button" onClick={() => navigate("/login")} > ← Already have an account? </button>
                        </>   
                    )} 

                    {step === "signup-success" &&(
                        <>
                        <h2>Check your email</h2> 
                        <p className="login-subtitle"> We've sent a confirmation email to your email address. 
                            Please check your inbox and click the verification link to activate your account. </p> 
                        <p className="login-subtitle"> 
                            Once your email has been confirmed, you can return here and log in. </p>                        
                        </>    
                    )}


                    {step === "forgot-password" && 
                    ( <>
                        <h2>Reset your password</h2>

                        <p className="login-subtitle">
                            Enter your email address and we'll send you a link to reset your password.
                        </p>

                        <form onSubmit={handleForgotPassword}>
                            <label htmlFor="forgot-email">Email</label>
                            <input
                                id="forgot-email"
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <button type="submit" className="continue-button">
                                Send Reset Link
                            </button>

                            <button className="back-button" onClick={() => setStep("login")} > ← Want to go back? </button>

                        </form>
                    </>   
                    )}

                    {step === "forgot-password-success" &&(
                        <>
                        <h2>Check your email</h2> 
                        <p className="login-subtitle"> We've sent a reset link to your email address. 
                            Please check your inbox and click the link to reset your password. </p> 
                        <p className="login-subtitle"> 
                            Once your email has been confirmed, you can return here and log in. </p>                        
                        </>    
                    )}
                </div>
            </main>
        </div>
    );
}

export default LoginPage;

