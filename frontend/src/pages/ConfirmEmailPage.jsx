import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./css/ConfirmEmailPage.css";

function ConfirmEmailPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const [status, setStatus] = useState("confirming");
    const [message, setMessage] = useState("");

    useEffect(() => {
        const confirmEmail = async () => {
            const userId = searchParams.get("userId");
            const token = searchParams.get("token");

            if (!userId || !token) {
                setStatus("error");
                setMessage("Invalid confirmation link.");
                return;
            }

            try {
                await axios.get(
                    "https://localhost:7226/api/auth/confirm-email",
                    {
                        params: {
                            userId: userId,
                            token: token
                        }
                    }
                );

                setStatus("success");
                setMessage("Your email has been successfully verified.");

            } catch (error) {
                console.error("Email verification failed:", error);

                setStatus("error");
                setMessage(
                    "We couldn't verify your email. The link may be invalid or expired."
                );
            }
        };

        confirmEmail();
    }, [searchParams]);

    return (
        <div className="confirm-page">

            <div className="confirm-card">

                {status === "confirming" && (
                    <>
                        <div className="confirm-icon">✉</div>

                        <h1>Verifying your email...</h1>

                        <p>
                            Please wait while we confirm your email address.
                        </p>
                    </>
                )}

                {status === "success" && (
                    <>
                        <div className="confirm-icon">✓</div>

                        <h1>Email verified!</h1>

                        <p>
                            {message}
                        </p>

                        <button
                            className="continue-button"
                            onClick={() => navigate("/login")}
                        >
                            Continue to login
                        </button>
                    </>
                )}

                {status === "error" && (
                    <>
                        <div className="confirm-icon">!</div>

                        <h1>Verification failed</h1>

                        <p>
                            {message}
                        </p>

                        <button
                            className="continue-button"
                            onClick={() => navigate("/login")}
                        >
                            Return to login
                        </button>
                    </>
                )}

            </div>

        </div>
    );
}

export default ConfirmEmailPage;

