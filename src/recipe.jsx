import React, { useState, useEffect } from "react"; 
import Ingredient from './ingrédient'; 
import { Card, CardBody, CardHeader, CardImg, Button } from "react-bootstrap";
import ListGroup from 'react-bootstrap/ListGroup'; 
import { BinIdRecipe } from './acessCode'; 
import { getData, saveIngredient } from './dataFunction'; 
import { useTranslation } from "react-i18next"; 

function Recipe({ isAuthenticated, title, portions, description, imageUrl, deleteRecipe, index }) {
  const [ingredients, setIngredient] = useState([]); // State for ingredients
  const [loading, setLoading] = useState(true); // Loading state
  const { t, i18n } = useTranslation(); // i18n translation function

  useEffect(() => {
    const fetchIngredient = async () => {
      const allIngredient = await getData(BinIdRecipe); // Fetch ingredients data
      setIngredient(allIngredient.recipes[index].ingredients); // Update state with ingredients
      setLoading(false); // Set loading to false once data is fetched
    };
    fetchIngredient(ingredients);
  }, []); // Only run once when component mounts

  return (
    <Card>
      <CardHeader>{title}</CardHeader>
      <CardBody>
        <CardImg src={imageUrl} alt={title} style={{ width: '100%', height: '300px', objectFit: 'cover' }} />
        
        <ListGroup>
          {(ingredients.map((ingredient, index) => (
            <ListGroup.Item key={`ingredient_${index}_${ingredient.type}`}>
              <Ingredient 
                isAuthenticated={isAuthenticated} 
                quantity={ingredient.quantity} 
                measure={ingredient.measure} 
                type={ingredient.type} 
              />
            </ListGroup.Item>
          )))}
        </ListGroup>

        <p>{t("The recipe is for")} {portions}{t(" people")} .</p>
        <p>{description}</p>

        {isAuthenticated ? (
          <Button onClick={deleteRecipe}>{t("Delete")}</Button>
        ) : null}
      </CardBody>
    </Card>
  );
}

export default Recipe;
