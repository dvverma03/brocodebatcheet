import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const LoginForm = () => {
    const password = useRef(null);
    const name = useRef(null);
    const email = useRef(null);
    const [errMessage, setErrMessage] = useState(null);
    const [isSignForm, setIsSignForm] = useState(true);
    const navigate = useNavigate();

    const toggleSignForm = () => {
        setIsSignForm(!isSignForm);
        setErrMessage(null); // Clear error message when toggling forms
    };

    const handleButton = async () => {
        const emailValue = email.current?.value;
        const passwordValue = password.current?.value;
        const nameValue = name.current?.value;

        if (!emailValue || !passwordValue || (!isSignForm && !nameValue)) {
            setErrMessage("All fields must be filled.");
            return;
        }

        try {
            if (isSignForm) {
                const res = await axios.post("http://localhost:8000/api/v1/users/login", {
                    email: emailValue,
                    password: passwordValue,
                });
                console.log("Login Response:", res);
            } else {
                const res = await axios.post("http://localhost:8000/api/v1/users/register", {
                    email: emailValue,
                    password: passwordValue,
                    fullName: nameValue,
                });
                console.log("Registration Response:", res);
            }

            navigate("/home");
        } catch (error) {
            setErrMessage("An error occurred. Please try again.");
        }
    };

    return (
        <div className="d-flex align-items-center justify-content-center vh-100 bg-dark">
            <div className="p-4 border border-5 border-secondary text-white rounded shadow-lg" style={{ width: "100%", maxWidth: "400px" }}>
                <h1 className="text-center mb-4">{isSignForm ? "Sign in" : "Sign up"}</h1>

                {!isSignForm && (
                    <div className="mb-3">
                        <input
                            ref={name}
                            type="text"
                            placeholder="Name"
                            className="form-control"
                        />
                    </div>
                )}
                <div className="mb-3">
                    <input
                        ref={email}
                        type="email"
                        placeholder="Email Address"
                        className="form-control"
                    />
                </div>
                <div className="mb-3">
                    <input
                        ref={password}
                        type="password"
                        placeholder="Password"
                        className="form-control"
                    />
                </div>
                {errMessage && <p className="text-danger">{errMessage}</p>}
                <button
                    className="btn btn-success w-100 mb-3"
                    onClick={handleButton}
                >
                    {isSignForm ? "Sign in" : "Sign up"}
                </button>
                <p
                    className="text-center text-light cursor-pointer"
                    style={{ cursor: "pointer" }}
                    onClick={toggleSignForm}
                >
                    {isSignForm
                        ? "New to Infinite Locus? Sign up now"
                        : "Already a registered user? Sign in now"}
                </p>
            </div>
        </div>
    );
};

export default LoginForm;
