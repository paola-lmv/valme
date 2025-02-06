import React, { useState, useEffect } from 'react';
import NavbarUnLoged from './navbar_unloged';
import NavbarLoged from './navbar_loged';
import { BinIdIngredient, BinIdRecipe } from './acessCode';
import { getData, SyncIngredients, calculateIngredientPrice, calculateMinPurchaseQty, saveIngredient2 } from './dataFunction';
import { useTranslation } from "react-i18next";

function Forecast({ isAuthenticated }) {
  const [ingredientsList, setIngredientsList] = useState([]);
  const [recipesList, setRecipesList] = useState([]);
  const [isIngredientsLoading, setIsIngredientsLoading] = useState(true);
  const [isRecipesLoading, setIsRecipesLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(""); // Événement sélectionné
  const { t } = useTranslation();

  useEffect(() => {
    const fetchRecipes = async () => {
      const allRecipes = await getData(BinIdRecipe);
      setRecipesList(allRecipes.recipes);
      setIsRecipesLoading(false);
    };
    fetchRecipes();

    const fetchIngredients = async () => {
      const allIngredients = await getData(BinIdIngredient);
      setIngredientsList(allIngredients.ingredients);
      setIsIngredientsLoading(false);
    };
    fetchIngredients();
  }, []);

  SyncIngredients(recipesList, ingredientsList, isIngredientsLoading, isRecipesLoading, BinIdIngredient, setIngredientsList);

  const recalculateIngredientData = () => {
    ingredientsList.forEach((ingredient) => {
      let totalMinPurchaseQty = 0;

      ingredient.listRecipe.forEach((recipeName) => {
        const matchingRecipe = recipesList.find(recipe => recipe.title === recipeName);
        if (matchingRecipe) {
          const commandQty = parseFloat(matchingRecipe.command);
          const matchingIngredient = matchingRecipe.ingredients.find(ing => ing.type === ingredient.type);
          if (matchingIngredient) {
            const ingredientQty = parseFloat(matchingIngredient.quantity);
            const portionQty = parseFloat(matchingRecipe.portions);
            totalMinPurchaseQty += calculateMinPurchaseQty(commandQty, ingredientQty, portionQty);
          }
        }
      });

      ingredient.minPurchaseQty = parseFloat(totalMinPurchaseQty.toFixed(2));
      ingredient.ingredientPrice = parseFloat(calculateIngredientPrice(ingredient.unitPrice, ingredient.purchaseQty, ingredient.priceQty).toFixed(2)) ?? "undefined";
    });

    saveIngredient2(ingredientsList, BinIdIngredient, setIngredientsList);
  };

  useEffect(() => {
    if (!isIngredientsLoading && !isRecipesLoading) {
      recalculateIngredientData();
    }
  }, [isIngredientsLoading, isRecipesLoading]);

  const handleEventChange = (e) => {
    setSelectedEvent(e.target.value);
  };

  const handleChange = (index, field, value) => {
    const updatedIngredients = [...ingredientsList];
    updatedIngredients[index][field] = value;
    setIngredientsList(updatedIngredients);
  };

  const handleCopyMinToPurchase = () => {
    const updatedIngredients = ingredientsList.map(ingredient => ({
      ...ingredient,
      purchaseQty: ingredient.minPurchaseQty
    }));
    setIngredientsList(updatedIngredients);
    saveIngredient2(updatedIngredients, BinIdIngredient, setIngredientsList);
    recalculateIngredientData();
  };

  const filteredRecipes = recipesList.filter(recipe => recipe.event === selectedEvent);

  const filteredIngredients = ingredientsList.filter(ingredient =>
    filteredRecipes.some(recipe =>
      recipe.ingredients.some(ing => ing.type === ingredient.type)
    )
  );

  const totalIngredientPrice = filteredIngredients.reduce((sum, ingredient) => sum + (ingredient.ingredientPrice || 0), 0).toFixed(2);

  return (
    <>
      {isAuthenticated ? <NavbarLoged /> : <NavbarUnLoged />}
      <h2>{t("Ingredients Table")}</h2>

      <label>{t("Select Event :")}: </label>
      <select onChange={handleEventChange} value={selectedEvent}>
        <option value="">{t("Choose an Event ")}</option>
        {[...new Set(recipesList.map(recipe => recipe.event))].map(event => (
          <option key={event} value={event}>{event}</option>
        ))}
      </select>

      {selectedEvent && (
        <>
          <button onClick={handleCopyMinToPurchase} style={{ marginTop: '10px', marginLeft: '10px', padding: '10px', fontSize: '16px' }}>
            {t("Copy Minimum Purchase to Chosen Purchase")}
          </button>

          {isIngredientsLoading ? (
            <p>{t("Loading")}...</p>
          ) : (
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
                          onChange={(e) => handleChange(index, 'purchaseQty', e.target.value)}
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
              <p>La modification d'une valeur peut prendre un peu de temps, le tableau met un moment à réagir. Merci de faire preuve de patience !</p>
            </div>
          )}
        </>
      )}
    </>
  );
}

export default Forecast;
