import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Nav.css";
import { signOut, getAuth, onAuthStateChanged } from "firebase/auth";
import { useState, useEffect } from "react";

const Nav = () => {
  const [showLogin, setShowLogin] = useState(false);
  const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setShowLogin(user !== null);
    });
    return () => unsubscribe();
  }, [auth]);

  const logout = () => {
    signOut(auth)
      .then(() => {
        console.log("Logged Out");
        navigate("/login");
      })
      .catch((error) => {
        console.log(error.message);
      });
  };
  return (
    <>
      <h1 className="nav-title">Private Chat App</h1>
      <nav className="navbar">
        <ul className="nav-links">
          <li>
            <Link to="/">Home</Link>
          </li>
          {showLogin ? (
            <li>
              <Link to="/chat">Chat</Link>
            </li>
          ) : (
            <li>
              <Link to="/login">Login</Link>
            </li>
          )}
          {showLogin && (
            <li>
              <Link onClick={logout}>Logout</Link>
            </li>
          )}
        </ul>
      </nav>
    </>
  );
};

export default Nav;
