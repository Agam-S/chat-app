import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Nav from "./components/Nav";

import NotFound from "./pages/NotFound";
import Home from "./pages/Home";
import Chat from "./pages/Chat";
import Login from "./pages/Login";

function App() {
  return (
    <>
      <BrowserRouter>
        <Nav />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route index element={<Home />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/chat/:id" element={<Chat />} />
          <Route path="/login" element={<Login />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
