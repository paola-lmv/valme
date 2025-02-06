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
    const fetchData = async () => {
      const allRecipes = await getData(BinIdRecipe); // Récupérer les recettes
      const allEvents = await getData(BinIdEvent);  // Récupérer les événements
      const allIngredients = await getData(BinIdIngredient);  // Récupérer les ingrédients
      setRecipe(allRecipes.recipes);
      setEvents(allEvents.evenement);
      setIngredients(allIngredients.ingredients);
      setIsLoading(false); // Fin du chargement
      setLoading(false);
    };
    fetchData();
  }, []);

  // Fonction pour supprimer une recette
  const deleteRecipe = (index) => {
    const recipeToDelete = recipes[index];
    ingredients.forEach((ingredient) => {
      if (ingredient.listRecipe && ingredient.listRecipe.includes(recipeToDelete.title)) {
        ingredient.listRecipe = ingredient.listRecipe.filter(
          (title) => title !== recipeToDelete.title
        );
      }
    });
    const updatedRecipe = recipes.filter((_, i) => i !== index);
    saveIngredient2(ingredients, BinIdIngredient, setIngredients); // Sauvegarder les ingrédients mis à jour
    saveRecipe(updatedRecipe, BinIdRecipe, setRecipe); // Sauvegarder la liste des recettes mise à jour
  };

  // Associer chaque recette à un événement spécifique
  const groupRecipesByEvent = () => {
    const groupedRecipes = events.map(event => {
      return {
        eventTitle: event.title,
        recipes: recipes.filter(recipe => recipe.event === event.title)
      };
    });
    return groupedRecipes;
  };

  const groupedRecipes = groupRecipesByEvent();
  
  return (
    <>
      {isAuthenticated ? <NavbarLoged /> : <NavbarUnLoged />}
      
      <Row>
        {isLoading && loading ? (
          <div>{t("Loading")}...</div>
        ) : (
          groupedRecipes.length === 0 ? (
            <div>{t("No events available")}</div>
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
                          title={recipe.title}
                          portions={recipe.portions}
                          description={recipe.description}
                          imageUrl={recipe.imageUrl}
                          deleteRecipe={() => deleteRecipe(recipeIndex)}
                          index={recipeIndex}
                        />
                      </Col>
                    ))}
                  </Row>
                )}
              </Col>
            ))
          )
        )}
      </Row>

      <footer style={{ textAlign: 'center', marginTop: '20px', padding: '10px', color:'black', fontWeight: 'bold', textDecoration: 'none' }}>          
        <Link to="/mentionsLegales">Mentions Légales</Link>
      </footer>
    </>
  );
}

export default MenuDisplay;
