import React, { useState, useEffect } from 'react';
import NavbarUnLoged from './navbar_unloged';
import NavbarLoged from './navbar_loged';
import { BinIdRecipe, BinIdIngredient, BinIdInscription, BinIdEvent } from './acessCode';
import { getData, saveRecipe, calculateMinPurchaseQty, calculateIngredientPrice,handleChange } from './dataFunction';
import { useTranslation } from "react-i18next";

function RecipeOrderTable({ isAuthenticated }) {
  const [ingredients, setIngredients] = useState([]);
  const [filterRecipes, setFilterRecipes] = useState([]);
  const [touteRecipes, setTouteRecipes] = useState([]);
  const [resteRecipes, setResteRecipes] = useState([]);
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
      console.log("fetchRecipe")
      const allRecipe = await getData(BinIdRecipe);
      setTouteRecipes(allRecipe.recipes)
      setFilterRecipes(allRecipe.recipes.filter(recipe => recipe.event === selectedEvent.title)); // On filtre par titre
      setResteRecipes(allRecipe.recipes.filter(recipe => recipe.event !== selectedEvent.title))
      setLoadingData(false);
      console.log("filterRecipes", filterRecipes);
      console.log("resteRecipes", resteRecipes);
      console.log("touteRecipes", touteRecipes);

    };
    fetchRecipe();
  
    const fetchIngredient = async () => {
      console.log("fetchIngredient")
      const allIngredients = await getData(BinIdIngredient);
      setIngredients(allIngredients.ingredients);
      console.log("ingredients", ingredients);
    };
    fetchIngredient();
  
    const fetchInscriptions = async () => {
      console.log("fetchInscriptions")
      const allInscriptions = await getData(BinIdInscription);
      setInscriptionList(allInscriptions.inscriptions.filter(inscription => inscription.event === selectedEvent.title)); // On filtre par titre
      console.log("inscriptions", inscriptionList);
    };
    fetchInscriptions();
  }, [selectedEvent]);
  

  const NumberInscription = inscriptionList.length;
  const NumberVegetarians = inscriptionList.filter(inscription => inscription.vege === 'Yes').length;

  const calculateIngredientData = () => {
    console.log("calculateIngredientData")
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
    if (!loading && !loadingData) {
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
    console.log("calculateTotalPrice")
    return filterRecipes.reduce((total, recipe) => total + (recipe.price || 0), 0).toFixed(2);
  };

  const handleChangebis = (index, field, value, dataList, saveFunction, BinId, setIngredientList) => {
    console.log("data",dataList)
    
    setFilterRecipes(dataList)
    dataList[index][field] = value; // Update the specific field for the selected ingredient
    const updatedIngredientList =[
        ...dataList,
        ...resteRecipes
      ];
    console.log("update recipe",updatedIngredientList)
    console.log("command",dataList[index][field])
    saveFunction(updatedIngredientList, BinId, setIngredientList); // Save the updated ingredient list
    calculateIngredientData()
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
                        onChange={(e) => handleChangebis(index, 'command', e.target.value, filterRecipes, saveRecipe, BinIdRecipe, setTouteRecipes)}
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
        <div>{t("Loading data...")}</div>
      )}
    </>
  );
}

export default RecipeOrderTable;
