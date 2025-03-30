import React, { useState, useEffect } from 'react';
import NavbarUnLoged from './navbar_unloged';
import NavbarLoged from './navbar_loged';
import { BinIdIngredient, BinIdRecipe, BinIdEvent } from './acessCode';
import { getData,handleChange, SyncIngredients, calculateIngredientPrice, calculateMinPurchaseQty, saveIngredient2 } from './dataFunction';
import { useTranslation } from "react-i18next";

function Forecast({ isAuthenticated }) {
  const [ingredientsList, setIngredientsList] = useState([]);
  const [filteredIngredients, setfilteredIngredients] = useState([]);
  const [recipesList, setRecipesList] = useState([]);
  const [selectedrecepie, setSelectedrecepie] = useState([]);
  const [resterecepie, setResterecepie] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null); // Objet événement sélectionné
  const { t } = useTranslation();
  const [events, setEvents] = useState(null); // Objet événement sélectionné
  const [loading, setLoading] = useState(true);
  const [loadingData, setLoadingData] = useState(true);
  const [loadingRecipe, setLoadingRecipe] = useState(true);
  

  useEffect(() => {
    const fetchEvents = async () => {
      const allEvents = await getData(BinIdEvent);
      setEvents(allEvents.evenement);
      setLoading(false);
    };
    fetchEvents();
  }, []);

  useEffect(() => {
    if (!selectedEvent) return;

    console.log("useEffect fetch")
    const fetchRecipe = async () => {
      console.log("fetchRecipe")
      const allRecipes = await getData(BinIdRecipe);
      setSelectedrecepie(allRecipes.recipes.filter(recipe => recipe.event === selectedEvent.title));
      setResterecepie(allRecipes.recipes.filter(recipe => recipe.event !== selectedEvent.title));
      setRecipesList(allRecipes.recipes);
      console.log("Selectrecepie",allRecipes.recipes.filter(recipe => recipe.event === selectedEvent.title))
      console.log("Resterecepie",allRecipes.recipes.filter(recipe => recipe.event !== selectedEvent.title))
      console.log("RecipesList",allRecipes.recipes)
      setLoadingRecipe(false);
      return allRecipes;
    };
    
    const fetchIngredient = async (allRecipes) => {
      console.log("fetchIngredient")
      const allIngredients = await getData(BinIdIngredient);
      const newSelectRecepie = (allRecipes.recipes.filter(recipe => recipe.event === selectedEvent.title))
      console.log("newSelectRecepie",newSelectRecepie)
      setIngredientsList(allIngredients.ingredients);
      setfilteredIngredients(allIngredients.ingredients.filter(ingredient =>
        newSelectRecepie.some(recipe =>
          recipe.ingredients.some(ing => ing.type === ingredient.type)
        ))
      );
      console.log("filteredIngredients",allIngredients.ingredients.filter(ingredient => selectedrecepie.some(recipe =>recipe.ingredients.some(ing => ing.type === ingredient.type))))
      console.log("ingredients",allIngredients.ingredients)
      setLoadingData(false);
    };

    fetchRecipe().then(allRecipes => fetchIngredient(allRecipes))
  }, [selectedEvent]); // Trigger on selectedEvent change

  useEffect(() => {
    if (!loading && !loadingRecipe && !loadingData) {
      recalculateIngredientData();
    }
  }, [loadingData, loadingRecipe, loading]);


  const recalculateIngredientData = () => {
    console.log("recalculateIngredientData");
    const updatedIngredients = filteredIngredients.map(ingredient => {
      let totalMinPurchaseQty = 0;
      ingredient.listRecipe.forEach(recipeName => {
        const matchingRecipe = recipesList.find(recipe => recipe.title === recipeName);
        if (matchingRecipe && matchingRecipe.event === selectedEvent.title ) {
          const commandQty = parseFloat(matchingRecipe.command);
          const matchingIngredient = matchingRecipe.ingredients.find(ing => ing.type === ingredient.type);
          if (matchingIngredient ) {
            const ingredientQty = parseFloat(matchingIngredient.quantity);
            const portionQty = parseFloat(matchingRecipe.portions);
            totalMinPurchaseQty += calculateMinPurchaseQty(commandQty, ingredientQty, portionQty);
          }
        }
      });   
      return {
        ...ingredient,
        minPurchaseQty: parseFloat(totalMinPurchaseQty.toFixed(2)),
        ingredientPrice: parseFloat(calculateIngredientPrice(ingredient.unitPrice, ingredient.purchaseQty, ingredient.priceQty).toFixed(2)) || 0,
      };
    });

    console.log("updatedIngredients", updatedIngredients);
    setfilteredIngredients(updatedIngredients);
    saveIngredient2(updatedIngredients, BinIdIngredient, setIngredientsList);
  };

  const handleEventChange = (e) => {
    setSelectedEvent(events[parseInt(e.target.value)]);
  };

  

  const handleCopyMinToPurchase = () => {
    console.log("handleCopyMinToPurchase")
    const updatedIngredients = ingredientsList.map(ingredient => ({
      ...ingredient,
      purchaseQty: ingredient.minPurchaseQty
    }));
    setIngredientsList(updatedIngredients);
    setfilteredIngredients(updatedIngredients.filter(ingredient => selectedrecepie.some(recipe =>recipe.ingredients.some(ing => ing.type === ingredient.type))))
    saveIngredient2(updatedIngredients, BinIdIngredient, setIngredientsList);
  };


  const totalIngredientPrice = filteredIngredients.reduce((sum, ingredient) => sum + (ingredient.ingredientPrice || 0), 0).toFixed(2);

  return (
    <>
      {isAuthenticated ? <NavbarLoged /> : <NavbarUnLoged />}
      <h2>{t("Ingredients Table")}</h2>

      {loading ? (
        <div>{t("Loading")}...</div>
      ) : (
        <>
          <label>{t("Select Event :")}</label>
          <select onChange={handleEventChange}>
            <option value="">{t("Choose an event")}</option>
            {events.map((event, index) => (
              <option key={index} value={index}>
                {event.title}
              </option>
            ))}
          </select>
          <br />
        </>
      )}

      {loadingData && loadingRecipe ? (
        <p>{t("Loading")}...</p>
      ) : (
        <>
        <p>La quantité minimale d'achat correspond à la quantité minimum requise pour satisfaire le nombre de commandes souhaité. En revanche, la quantité d'achat choisie représente la quantité d'ingrédient que l'on souhaite réellement acheter, en tenant compte du fait qu'il est impossible, par exemple, d'acheter 3,5 œuf. Ainsi, lors des achats, il faut se baser sur la quantité d'achat choisie pour déterminer les quantités à commander. Le calcul du prix se fait alors en fonction de cette dernière quantité.</p>
        <p>Oublie pas de sauvegarder en bas de la page toute modification !!!</p>
          <button onClick={handleCopyMinToPurchase} style={{ marginTop: '10px', marginLeft: '10px', padding: '10px', fontSize: '16px' }}>
            {t("Copy Minimum Purchase to Chosen Purchase")}
          </button>
          <div style={{ overflowX: 'auto' }}>
            <table border="1" style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th>{t("Name")}</th>
                  <th>{t("Minimum Purchase Quantity")}</th>
                  <th>{t("Chosen Purchase Quantity")}</th>
                  <th>{t("Measure")}</th>
                  <th>{t("Price €")}</th>
                </tr>
              </thead>
              <tbody>
                  {filteredIngredients.map((ingredient, index) => (
                  <tr key={index}>
                    <td>{ingredient.type}</td>
                    <td>{ingredient.minPurchaseQty}</td>
                    <td>
                      <input
                        type="number"
                        value={ingredient.purchaseQty}
                        onChange={(e) => handleChange(index, 'purchaseQty', e.target.value, filteredIngredients, saveIngredient2, BinIdIngredient, setfilteredIngredients)}
                      />
                    </td>
                    <td>{ingredient.measure}</td>
                    <td>{ingredient.ingredientPrice}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ marginTop: '20px', fontSize: '18px', fontWeight: 'bold' }}>
              <strong>{t("Total Price")}: {totalIngredientPrice} €</strong>
            </div>
            <button onClick={recalculateIngredientData} style={{ marginTop: '20px', padding: '10px', fontSize: '16px' }}>
              {t("Save and Recalculate")}
            </button>
            <p>La modification d'une valeur peut prendre un peu de temps, merci de patienter !</p>
          </div>
        </>
      )}
    </>
  );
}

export default Forecast;
