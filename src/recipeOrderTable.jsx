import React, { useState, useEffect } from 'react';
import NavbarUnLoged from './navbar_unloged';
import NavbarLoged from './navbar_loged';
import { BinIdRecipe, BinIdIngredient, BinIdInscription, BinIdEvent } from './acessCode';
import { getData, saveRecipe, calculateMinPurchaseQty, handleChange, saveInscription, calculateIngredientPrice } from './dataFunction';
import { useTranslation } from "react-i18next";

function RecipeOrderTable({ isAuthenticated }) {
  const [ingredients, setIngredients] = useState([]);
  const [filterRecipes, setFilterRecipes] = useState([]);
  const [touteRecipes, setTouteRecipes] = useState([]);
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingData, setLoadingData] = useState(true);
  const { t } = useTranslation();
  const [inscriptionList, setInscriptionList] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      const allEvents = await getData(BinIdEvent);
      setEvents(allEvents.evenement);
      console.log()
      setLoading(false);
    };
    fetchEvents();
  }, []);

  useEffect(() => {
    console.log("useEffect appelé");
    if (!selectedEvent) return console.log("pas de evenement sélectionné");
  
    const fetchRecipe = async () => {
      const allRecipe = await getData(BinIdRecipe);
      setTouteRecipes(allRecipe.recipes)
      setFilterRecipes(allRecipe.recipes.filter(recipe => recipe.event === selectedEvent.title)); // On filtre par titre
      setLoadingData(false);
      console.log("filterRecipes", filterRecipes);
      console.log("touteRecipes", touteRecipes);

    };
    fetchRecipe();
  
    const fetchIngredient = async () => {
      const allIngredients = await getData(BinIdIngredient);
      setIngredients(allIngredients.ingredients);
      console.log("ingredients", ingredients);
    };
    fetchIngredient();
  
    const fetchInscriptions = async () => {
      const allInscriptions = await getData(BinIdInscription);
      setInscriptionList(allInscriptions.inscriptions.filter(inscription => inscription.event === selectedEvent.title)); // On filtre par titre
      console.log("inscriptions", inscriptionList);
    };
    fetchInscriptions();
  }, [selectedEvent]);
  

  const NumberInscription = inscriptionList.length;
  const NumberVegetarians = inscriptionList.filter(inscription => inscription.vege === 'Yes').length;

  const calculateIngredientData = () => {
    touteRecipes.forEach(recipe => {
      recipe.price = 0;
    });

    ingredients.forEach((ingredient) => {
      ingredient.listRecipe.forEach((item) => {
        const matchingRecipe = touteRecipes.find(recIng => recIng.title === item);
        if (matchingRecipe) {
          const ingredientData = matchingRecipe.ingredients.find(ing => ing.type === ingredient.type);
          if (ingredientData) {
            matchingRecipe.price += parseFloat(
              calculateIngredientPrice(
                ingredient.unitPrice,
                calculateMinPurchaseQty(matchingRecipe.command, ingredientData.quantity, matchingRecipe.portions),
                ingredient.priceQty
              ).toFixed(2)
            );
          }
        }
      });
    });
    saveRecipe(touteRecipes, BinIdRecipe, setTouteRecipes);
  };

  useEffect(() => {
    if (!loading && !loadingData && selectedEvent) {
      calculateIngredientData();
    }
  }, [loading, loadingData, selectedEvent]);

  const updateAllRecipeCommands = () => {
    const updatedRecipes = touteRecipes.map(recipe => ({
      ...recipe,
      command: NumberInscription
    }));
    setTouteRecipes(updatedRecipes);
    saveRecipe(updatedRecipes, BinIdRecipe, setTouteRecipes);
    calculateIngredientData();
  };

  const calculateTotalPrice = () => {
    return filterRecipes.reduce((total, recipe) => total + (recipe.price || 0), 0).toFixed(2);
  };

  return (
    <>
      {isAuthenticated ? <NavbarLoged /> : <NavbarUnLoged />}
      <h2>{t("Recipe Order Table")}</h2><br/>
      {loading ? (
  <div>{t("Loading")}...</div>
) : (
  <>
    <label>{t("Select Event :")}</label>
    <select onChange={(e) => setSelectedEvent(events[parseInt(e.target.value)])}>
      <option value="">{t("Choose an event")}</option>
      {console.log(events)}
      {events.map((event, index) => (
        <option key={index} value={index}>
          {event.title}
        </option>
      ))}
    </select>
    <br />
  </>
)}

      { !loadingData ? (
        <>
          <h6>{t("Number of inscription at the event :")} {NumberInscription}</h6>
          <h6>{t("Number of vegetarians :")}{NumberVegetarians}</h6>
          <button onClick={updateAllRecipeCommands}>{t("Update Commands with Number of Inscriptions")}</button>
          <br/>
          <div style={{ overflowX: 'auto' }}>
            <table border="1" style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th>{t("Title")}</th>
                  <th>{t("Command")}</th>
                  <th>{t("Proportional factor")}</th>
                  <th>{t("Price €")}</th>
                </tr>
              </thead>
              <tbody>
                {filterRecipes.map((recipe, index) => (
                  <tr key={index}>
                    <td>{recipe.title}</td>
                    <td>
                      <input
                        type="number"
                        value={recipe.command}
                        onChange={(e) => handleChange(index, 'command', e.target.value, recipes, saveRecipe, BinIdRecipe, setRecipes)}
                      />
                    </td>
                    <td>
                      {(recipe.command && recipe.portions) ? (recipe.command / recipe.portions).toFixed(2) : 'N/A'}
                    </td>
                    <td>{recipe.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <h6>{t("Total Price of All Recipes:")} {calculateTotalPrice()} €</h6>
          </div>
        </>
      ) : (
        <div>{t("Loading events or data...")}</div>
      )}
    </>
  );
}

export default RecipeOrderTable;
