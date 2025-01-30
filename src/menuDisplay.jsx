import NavbarUnLoged from './navbar_unloged'; 
import NavbarLoged from './navbar_loged';
import Recipe from './recipe';
import React, { useState, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import { BinIdRecipe } from './acessCode';
import { getData, saveRecipe } from './dataFunction';
import { useTranslation } from "react-i18next";

function MenuDisplay({ isAuthenticated }) {
    // State to hold the list of recipes
    const [recipeList, setRecipeList] = useState([]);  
    const [isLoading, setIsLoading] = useState(true); // State to track loading status
    const { t, i18n } = useTranslation();

    // Fetch the list of recipes when the component mounts
    useEffect(() => {
      const fetchRecipes = async () => {
        const allRecipes = await getData(BinIdRecipe); // Fetch recipes from the API
        setRecipeList(allRecipes.recipes); // Update state with fetched recipes
        setIsLoading(false); // Set loading to false after data is fetched
      };
      fetchRecipes(); // Call the fetchRecipes function
    }, []);

    // Function to delete a recipe from the list
    const deleteRecipe = (indexToDelete) => {
        const updatedRecipeList = recipeList.filter((recipe, index) => index !== indexToDelete); // Remove the recipe at the specified index
        saveRecipe(updatedRecipeList, BinIdRecipe, setRecipeList); // Save the updated list and handle errors
    };

    const lengthRecipe = recipeList.length; // Get the number of recipes in the list

    return (
        <>
            {isAuthenticated ? (<NavbarLoged />) : (<NavbarUnLoged />)}

            <Row>
                {isLoading ? (
                    <div>{t("Loading")}...</div> // Replaced <tr> with <div> here for loading state
                ) : (lengthRecipe === 0 ? (
                    <div>No recipes available</div>
                  ) : (
                    // Map through the recipeList and display each recipe
                    recipeList.map((recipe, index) => (
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
        </>
    );
}

export default MenuDisplay;
