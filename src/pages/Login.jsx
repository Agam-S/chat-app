import React from "react";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useState } from "react";
import { auth, provider } from "../config/firebase.config";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [emailIn, setEmailIn] = useState("");
  const [passwordIn, setPasswordIn] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
        <button disabled={loading} type="submit">
          Sign Up
        </button>
      </form>

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
        <button disabled={loading} type="submit">
          Login
        </button>
      </form>

      <button onClick={signInWithGoogle}>Or Continue with Google...</button>

      {error && <p>{error}</p>}
    </div>
  );
};

export default Login;
