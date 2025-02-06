import NavbarUnLoged from './navbar_unloged';
import NavbarLoged from './navbar_loged';
import NewRecipe from './newRecipe';
import React, { useState, useEffect } from "react";
import { Container, Spinner, Row, Col } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import { BinIdRecipe, BinIdEvent } from './acessCode';
import { getData, saveRecipe } from './dataFunction';
import { useTranslation } from "react-i18next";

function MenuCreate({ isAuthenticated }) {
  // State pour la liste des recettes et des événements
  const [recipeList, setRecipeList] = useState([]);
  const [eventList, setEventList] = useState([]);  // Liste des événements
  const [isLoading, setIsLoading] = useState(true);
  const { t, i18n } = useTranslation();

  // Fetching les recettes et les événements
  useEffect(() => {
    const fetchData = async () => {
      const allRecipes = await getData(BinIdRecipe);  // Récupérer les recettes
      const allEvents = await getData(BinIdEvent);  // Récupérer les événements
      setRecipeList(allRecipes.recipes);  // Mettre à jour la liste des recettes
      setEventList(allEvents.evenement);  // Mettre à jour la liste des événements
      setIsLoading(false);  // Stopper le chargement après avoir récupéré les données
    };
    fetchData();
  }, []);

  // Fonction pour ajouter une nouvelle recette à la liste
  const addNewRecipe = (newRecipe) => {
    saveRecipe([newRecipe, ...recipeList], BinIdRecipe, setRecipeList);  // Sauvegarder et mettre à jour la liste des recettes
  };

  return (
    <>
      {isAuthenticated ? <NavbarLoged /> : <NavbarUnLoged />}
      <h2>{t("Create a New Recipe")}</h2>
      <Container>
        {isLoading ? (
          <div><Spinner animation="border" /> {t("Loading")}...</div>  // Affichage pendant le chargement
        ) : (
          <>
            <Row className="mb-3">
              <Col>
                {/* Passer la fonction d'ajout de recette et la liste des événements au composant NewRecipe */}
                <NewRecipe addRecipe={addNewRecipe} eventsList={eventList} />
              </Col>
            </Row>
          </>
        )}
      </Container>
    </>
  );
}

export default MenuCreate;
