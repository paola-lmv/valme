import NavbarUnLoged from './navbar_unloged'; 
import NavbarLoged from './navbar_loged';
import Recipe from './recipe';
import React, { useState, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import { BinIdRecipe,BinIdIngredient } from './acessCode';
import { getData, saveRecipe,saveIngredient2 } from './dataFunction';
import { useTranslation } from "react-i18next";
import { Link } from 'react-router-dom';

function MenuDisplay({ isAuthenticated }) {
    // State to hold the list of recipes
    const [recipes, setRecipe] = useState([]);  
    const [isLoading, setIsLoading] = useState(true); // State to track loading status
    const { t, i18n } = useTranslation();
    const [ingredients, setIngredients] = useState([]);
    const [loading, setLoading] = useState(true);

    
    

    // Fetch the list of recipes when the component mounts
    useEffect(() => {
      const fetchRecipes = async () => {
        const allRecipes = await getData(BinIdRecipe); // Fetch recipes from the API
        setRecipe(allRecipes.recipes); // Update state with fetched recipes
        setIsLoading(false); // Set loading to false after data is fetched
      };
      fetchRecipes(); // Call the fetchRecipes function

      const fetchIngredient = async () => {
            const allIngredients = await getData(BinIdIngredient); // Call to fetch ingredient data
            setIngredients(allIngredients.ingredients);
            setLoading(false); // Set loading to false once ingredient data is fetched
          };
        fetchIngredient(ingredients);
    }, []);

   
      // Deletes a recipe from the list
      const deleteRecipe = (index) => {
        console.log("supprime une recette")
        // Get the recipe to be deleted
        const recipeToDelete = recipes[index];
    
        ingredients.forEach((ingredient) => {
                // Check if the ingredient's listRecipe includes the title of the recipe to delete
                if (ingredient.listRecipe && ingredient.listRecipe.includes(recipeToDelete.title)) {
                    // Remove the recipe title from the listRecipe
                    ingredient.listRecipe = ingredient.listRecipe.filter(
                        (title) => title !== recipeToDelete.title
                    );
                }
            })
          const updatedRecipe = recipes.filter((_, i) => i !== index);
          saveIngredient2(ingredients, BinIdIngredient, setIngredients); // Save the updated ingredient data
          saveRecipe(updatedRecipe, BinIdRecipe, setRecipe); // Save the updated list
      };

    const lengthRecipe = recipes.length; // Get the number of recipes in the list

    return (
        <>
            {isAuthenticated ? (<NavbarLoged />) : (<NavbarUnLoged />)}

            <Row>
                {isLoading && loading? (
                    <div>{t("Loading")}...</div> // Replaced <tr> with <div> here for loading state
                ) : (lengthRecipe === 0 ? (
                    <div>No recipes available</div>
                  ) : (
                    // Map through the recipeList and display each recipe
                    recipes.map((recipe, index) => (
                        <Col sm={12} md={6} lg={4} key={`recipe_${index}`}>
                            <Recipe
                                isAuthenticated={isAuthenticated}
                                title={recipe.title}
                                portions={recipe.portions}
                                description={recipe.description}
                                imageUrl={recipe.imageUrl}
                                deleteRecipe={() => deleteRecipe(index)} 
                                index={index}
                            />
                        </Col>
                    ))
                ))} 
            </Row>
            <footer style={{ textAlign: 'center', marginTop: '20px', padding: '10px', color:'black', fontWeight: 'bold', textDecoration: 'none'}}>          
              <Link to="/mentionsLegales">Mentions Légales</Link>
            </footer>
        </>
    );
}

export default MenuDisplay;
