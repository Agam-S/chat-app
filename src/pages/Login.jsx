import React from "react";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useState } from "react";
import { auth, provider } from "../config/firebase.config";
import PinkButton from "../theme/PinkButton";
import { Button } from "react-bootstrap";

const Login = () => {
  const [showSignup, setShowSignup] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [emailIn, setEmailIn] = useState("");
  const [passwordIn, setPasswordIn] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignupClick = () => {
    setShowSignup(true);
  };

  const handleLoginClick = () => {
    setShowSignup(false);
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const auth = getAuth();
      const user = await createUserWithEmailAndPassword(auth, email, password);
      console.log(user);
    } catch (error) {
      setError(error.message);
    }
    setLoading(false);
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const auth = getAuth();
      const userIn = await signInWithEmailAndPassword(
        auth,
        emailIn,
        passwordIn
      );
      console.log(userIn);
    } catch (error) {
      setError(error.message);
    }
    setLoading(false);
  };

  const signInWithGoogle = async () => {
    const result = await signInWithPopup(auth, provider);
    console.log(result);
  };

  return (
    <div>
      <PinkButton />
      <Button variant="pink" onClick={handleSignupClick}>
        Sign Up
      </Button>
      <Button variant="pink" onClick={handleLoginClick}>
        Login
      </Button>
      <h1>{loading ? "Loading..." : ""}</h1>
      {showSignup ? (
        <div className="signup-form">
          <h1>Sign Up</h1>
          <form onSubmit={handleSignUp}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button variant="pink" disabled={loading} type="submit">
              Sign Up
            </Button>
          </form>
        </div>
      ) : (
        <div className="login-form">
          <h1>Login</h1>
          <form onSubmit={handleSignIn}>
            <input
              type="email"
              placeholder="Email"
              value={emailIn}
              onChange={(e) => setEmailIn(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={passwordIn}
              onChange={(e) => setPasswordIn(e.target.value)}
            />
            <Button variant="pink" disabled={loading} type="submit">
              Login
            </Button>
          </form>
        </div>
      )}
      <Button variant="pink" onClick={signInWithGoogle}>
        Or Continue with Google...
      </Button>

      {error && <p>{error}</p>}
    </div>
  );
};

export default Login;
