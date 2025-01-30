import { Button } from "react-bootstrap";

function Ingredient({ isAuthenticated, quantity, measure, type, deleteIngredient }) {
  return (
    <>
      {/* Displaying the ingredient type, quantity, and measure */}
      <p>{type} : {quantity} {measure}</p>

      {/* Conditional rendering based on the authentication state */}
      {isAuthenticated && deleteIngredient ? (
        // Only show the delete button if the user is authenticated and deleteIngredient function is provided
        <Button onClick={deleteIngredient}>Delete</Button>
      ) : (
        <></>
      )}
    </>
  );
}

export default Ingredient;
