import React from "react";
import Button from "react-bootstrap/Button";
import PinkButton from "../theme/PinkButton";

const Home = () => {
  return (
    <>
      <PinkButton />
      <Button variant="pink">Hi</Button>
      <h1>Home Page</h1>
    </>
  );
};

export default Home;
