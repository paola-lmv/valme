import React, { useState } from "react";
import Ingredient from './ingrédient';
import ListGroup from 'react-bootstrap/ListGroup';
import { FormControl, FormLabel, Card, Button, CardBody, CardHeader,Row, Col } from "react-bootstrap";
import {useTranslation} from  "react-i18next";

function NewIngredient({ handleIngredients, ingredients, deleteIngredient }) {
  // State for managing the ingredient's quantity, measure, and type
  const [quantity, setQuantity] = useState(""); 
  const [measure, setMeasure] = useState("");  
  const [type, setType] = useState("");    
  const { t, i18n } = useTranslation();    

  // Handle the form submission, creating a new ingredient object and passing it to the parent
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent page refresh on form submit

    // Create a new ingredient object
    const newIngredient = {
      quantity,
      measure,
      type
    };

    // Pass the new ingredient object to the parent component's handler function
    handleIngredients([newIngredient]);

    // Clear the input fields after submitting
    setQuantity("");
    setMeasure("");
    setType("");
  };

  return (
    <>
      <Row>
      <Col md={6}>
        {/* Section for the ingredient list */}
        <Card className="mt-3">
          <CardHeader>{t("Ingredient List")}</CardHeader>
          <CardBody>
            <ListGroup>
              {/* Display the list of ingredients */}
              {ingredients.map((ingredient, index) => (
                <ListGroup.Item key={"i" + index + "_" + ingredient.type}>
                  <Ingredient
                    quantity={ingredient.quantity}
                    measure={ingredient.measure}
                    type={ingredient.type}
                    deleteIngredient={deleteIngredient} // Pass the delete function to each ingredient
                  />
                </ListGroup.Item>
              ))}
            </ListGroup>
          </CardBody>
        </Card>
      </Col>
      <Col md={6}>
        {/* Section for the ingredient form */}
        <Card className="new-ingredient mt-3">
          <CardHeader>{t("Add a new ingredient")}</CardHeader>
          <CardBody>
          <small>{t("When creating an ingredient that is already present in another recipe, make sure to use the same spelling to facilitate subsequent calculations.")}</small> {/* Détail de la proportion */}
            <div>
              <FormLabel htmlFor="quantity">{t("Quantity")}:</FormLabel>
              <FormControl
                id="quantity"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)} 
              />
            </div>
            <div>
              <FormLabel htmlFor="measure">{t("Measure")}:</FormLabel>
              <FormControl
                id="measure"
                value={measure}
                onChange={(e) => setMeasure(e.target.value)} 
              />
            </div>
            <div>
              <FormLabel htmlFor="type">{t("Type")}:</FormLabel>
              <FormControl
                id="type"
                value={type}
                onChange={(e) => setType(e.target.value)}
              />
              <small>{t("Enter the ingredient name here.")}</small> 
            </div>
            <div className="mt-3">
              <Button type="button" onClick={handleSubmit}>{t("Add")}</Button>
            </div>
          </CardBody>
        </Card>
      </Col>
    </Row>
    </>
  );
}

export default NewIngredient;
