import React from "react";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  onAuthStateChanged,
} from "firebase/auth";
import { useState, useEffect } from "react";
import PinkButton from "../theme/PinkButton";
import { Button } from "react-bootstrap";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import { getFirestore, doc, setDoc, serverTimestamp } from "firebase/firestore";

const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate("/");
      }
    });
    return () => unsubscribe();
  }, []);

  const [showSignup, setShowSignup] = useState(false);

  const [userName, setuserName] = useState("");
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
      if (userName.length === 0) {
        alert("name cannot be empty");
      } else if (email.length === 0 || password.length === 0) {
        alert("email or password cannot be empty");
      } else {
        const auth = getAuth();
        const { user } = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        await updateProfile(user, {
          displayName: userName,
        });
        const db = getFirestore();
        const userRef = doc(db, "users", user.uid);
        await setDoc(userRef, {
          displayName: userName,
          email: user.email,
          uid: user.uid,
          timestamp: serverTimestamp(),
        });
        setError(`Account created for ${userName}`);
      }
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
      setError(`Logged In As ${userIn.user.displayName}`);
      navigate("/chat");
    } catch (error) {
      setError(error.message);
    }
    setLoading(false);
  };

  return (
    <div className="login-page">
      <PinkButton />
      <div className="button-nav">
        <Button variant="outline-dark" onClick={handleSignupClick}>
          Sign Up
        </Button>
        <Button variant="outline-dark" onClick={handleLoginClick}>
          Login
        </Button>
      </div>
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
              type="text"
              placeholder="Username"
              value={userName}
              onChange={(e) => setuserName(e.target.value)}
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

      {error && <p>{error}</p>}
    </div>
  );
};

export default Login;
