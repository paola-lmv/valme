import NavbarUnLoged from './navbar_unloged';
import NavbarLoged from './navbar_loged';
import Recipe from './recipe';
import React, { useState, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import { BinIdRecipe, BinIdIngredient, BinIdEvent } from './acessCode';
import { getData, saveRecipe, saveIngredient2 } from './dataFunction';
import { useTranslation } from "react-i18next";
import { Link } from 'react-router-dom';

function MenuDisplay({ isAuthenticated }) {
  const [recipes, setRecipe] = useState([]);  
  const [events, setEvents] = useState([]);  // Liste des événements
  const [isLoading, setIsLoading] = useState(true); 
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t, i18n } = useTranslation();

  // Fetching les recettes, événements et ingrédients
  useEffect(() => {
    const fetchEvents = async () => {
      console.log("fetchEvents")
      const allEvents = await getData(BinIdEvent);
      setEvents(allEvents.evenement);
    };
    const fetchRecipe = async () => {
      console.log("fetchRecipe")
      const allRecipes = await getData(BinIdRecipe);
      setRecipe(allRecipes.recipes);          
      setLoading(false);
      console.log("Recipes", recipes); 
    };
    const fetchIngredient = async () => {
      console.log("fetchIngredient")
      const allIngredients = await getData(BinIdIngredient);
      setIngredients(allIngredients.ingredients);
      console.log("ingredients", ingredients);
      setIsLoading(false);       
    };
    fetchEvents().then(() => {
         return fetchRecipe();
      }).then(() => {
        return fetchIngredient();
      }).catch(error => {
        console.error("Erreur lors du chargement des données", error);
      });
  }, []);

  // Associer chaque recette à un événement spécifique
  const groupRecipesByEvent = () => {
    if (events.length == 0) return [];
    if (events.length !== 0) {
    return events.map(event => ({
      eventTitle: event.title,
      recipes: recipes.filter(recipe => recipe.event === event.title),
    }));}
  };  
  const groupedRecipes = groupRecipesByEvent();
  
  return (
    <>
      {isAuthenticated ? <NavbarLoged /> : <NavbarUnLoged />}
      
      <Row>
        {isLoading && loading ? (
          <div>{t("Loading")}...</div>
          ) : events.length === 0 ? (
          <div>{t("No events available")}</div>
          ) : groupedRecipes.length === 0 ? (
          <div>{t("No recipes available")}</div>
        ) : ( 
            // Afficher chaque événement avec ses recettes
            groupedRecipes.map((group, index) => (
              <Col sm={12} key={`event_${index}`}>
                <h3>{group.eventTitle}</h3>
                {group.recipes.length === 0 ? (
                  <p>{t("No recipes for this event")}</p>
                ) : (
                  <Row>
                    {group.recipes.map((recipe, recipeIndex) => (
                      <Col sm={12} md={6} lg={4} key={`recipe_${recipeIndex}`}>
                        <Recipe
                          isAuthenticated={isAuthenticated}
                          recipe={recipe}
                          delelete={() =>groupRecipesByEvent() }
                        />
                      </Col>
                    ))}
                  </Row>
                )}
              </Col>
            ))
          )
        }
      </Row>

      <footer style={{ textAlign: 'center', marginTop: '20px', padding: '10px', color:'black', fontWeight: 'bold', textDecoration: 'none' }}>          
        <Link to="/mentionsLegales">Mentions Légales</Link>
      </footer>
    </>
  );
}

export default MenuDisplay;
