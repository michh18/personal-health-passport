import { useState } from "react";
import "./css/LoginPage.css";
import axios from "axios";

function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [step, setStep] = useState("login");
    const [error, setError] = useState("");

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

    return (
        <div className="login-page">

            <header className="navbar">
                <h1 className="logo">
                    Personal Health Passport
                </h1>

                <nav>
                    <a href="#how-it-works">How it works</a>
                    <a href="/upload">Upload Notes</a>

                    <button className="login-button">
                        Log in
                    </button>

                    <button className="register-button">
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


                        <button className="back-button" type="button" onClick = {() => setStep("signup")}>
                            Dont have an account?
                        </button>
                        <button className="back-button" type="button" >
                            Forgot your password?
                        </button>
                        

                        </>   
                    )} 


                    {step === "signup" && 
                    ( <>
                        <h2>Create your account</h2> 
                        <form> 
                            <label htmlFor="signup-email">Email</label> 
                            <input id="signup-email" type="email" value={email} placeholder="Your email" required /> 
                            <label htmlFor="name">Name</label> 
                            <input id="name" type="text" placeholder="Your name" required /> 
                            <label htmlFor="signup-password"> Password </label> 
                            <input id="signup-password" type="password" placeholder="Create a password" required /> 
                            <button type="submit" className="continue-button" > Create account </button> 
                        </form> 
                        
                        <button className="back-button" onClick={() => setStep("login")} > ← Already have an account? </button>
                        </>   
                    )} 

                </div>
            </main>
        </div>
    );
}

export default LoginPage;

