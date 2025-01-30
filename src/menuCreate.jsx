import NavbarUnLoged from './navbar_unloged';
import NavbarLoged from './navbar_loged';
import NewRecipe from './newRecipe';
import React, { useState, useEffect } from "react";
import { Container, Spinner, Row, Col } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import { BinIdRecipe } from './acessCode';
import { getData, saveRecipe } from './dataFunction';
import {useTranslation} from  "react-i18next";


function MenuCreate({ isAuthenticated }) {
    // State to hold the list of recipes
    const [recipeList, setRecipeList] = useState([]);  
    const [isLoading, setIsLoading] = useState(true);
    const { t, i18n } = useTranslation();

    
    // Fetch the list of recipes when the component mounts
    useEffect(() => {
      const fetchRecipes = async () => {
        const allRecipes = await getData(BinIdRecipe); // Fetch recipes from the API
        setRecipeList(allRecipes.recipes); // Update the state with the fetched recipes
        setIsLoading(false); // Set loading to false after data is fetched
      };
      fetchRecipes(); // Call the function to fetch the recipes
    }, []);

    // Function to add a new recipe to the list
    const addNewRecipe = (newRecipe) => {
        saveRecipe([newRecipe, ...recipeList], BinIdRecipe, setRecipeList); // Save new recipe and update state
    };

    return (
        <>
            {isAuthenticated ? (<NavbarLoged />) : (<NavbarUnLoged />)}
            <h2>{t("Create a New Recipe")}</h2>
            <Container>
            {isLoading ? (
              <tr><td colSpan="6">{t("Loading")}...</td></tr>
                ) : (
                    <>
                        <Row className="mb-3">
                            <Col>
                                {/* Pass the function to add a new recipe and the recipe count to the NewRecipe component */}
                                <NewRecipe addRecipe={addNewRecipe} />
                            </Col>
                        </Row>
                    </>
                )}
            </Container>
        </>
    );
}

export default MenuCreate;
