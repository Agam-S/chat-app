import React from "react";
import PinkButton from "../theme/PinkButton";
import { auth } from "../config/firebase.config";

const Home = () => {
  return (
    <>
      <PinkButton />
      {/* <Button variant="pink">Hi</Button> */}
      <div style={{ textAlign: "center", marginTop: "10%" }}>
        <h1>Welcome to this personal private DM app.</h1>
        <h3>
          Please Login/Signup to access chats, then search for a User to DM
          them.
        </h3>
        <h5>Made by Agam</h5>
      </div>
    </>
  );
};

export default Home;
