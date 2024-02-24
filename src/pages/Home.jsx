import React from "react";
import Button from "react-bootstrap/Button";
import PinkButton from "../theme/PinkButton";

const Home = () => {
  return (
    <>
      <PinkButton />
      {/* <Button variant="pink">Hi</Button> */}
      <div style={{ textAlign: "center", marginTop: "10%" }}>
        <h1>Welcome to this personal private DM app.</h1>
        <h3>Please Search for a User to DM or Click on Chats</h3>
        <h5>Made by Agam</h5>
      </div>
    </>
  );
};

export default Home;
