import React from "react";
import Button from "react-bootstrap/Button";
import CustomStyles from "../theme/CustomStyles";

const Home = () => {
  return (
    <>
      <Button style={CustomStyles.pinkButton}>Hi</Button>
      <h1>Home Page</h1>
    </>
  );
};

export default Home;
