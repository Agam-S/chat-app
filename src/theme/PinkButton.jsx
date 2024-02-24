import Button from "react-bootstrap/Button";

function PinkButton() {
  return (
    <>
      <style type="text/css">
        {`
    .btn-pink {
      background-color: #D92B8B;
      color: white;
      padding: 1rem 1rem;
      font-size: 1rem;
    }
    .btn-pink:hover {
      background-color: #C72A7E;
      color: white;
    }
    `}
      </style>
    </>
  );
}

export default PinkButton;
