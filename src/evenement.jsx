import React, { useState, useEffect } from 'react'; 
import NavbarUnLoged from './navbar_unloged';
import NavbarLoged from './navbar_loged';
import { BinIdIngredient, BinIdRecipe } from './acessCode';
import { getData, SyncIngredients, calculateIngredientPrice, calculateMinPurchaseQty, saveIngredient2 } from './dataFunction';
import { useTranslation } from "react-i18next";

function Evenement({ isAuthenticated }) {
  // State hooks for managing ingredients, recipes, and loading status
  const [ingredientsList, setIngredientsList] = useState([]);
  const [recipesList, setRecipesList] = useState([]);
  const [isIngredientsLoading, setIsIngredientsLoading] = useState(true);
  const [isRecipesLoading, setIsRecipesLoading] = useState(true);
  const { t, i18n } = useTranslation();

  // Fetching all recipes and setting the state once data is retrieved
  useEffect(() => {
    const fetchRecipes = async () => {
      const allRecipes = await getData(BinIdRecipe); // Calling the function to fetch recipe data
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
    recalculateIngredientData()
  }, []); // Empty dependency array to only run on component mount


  return (
    <>
      {isAuthenticated ? <NavbarLoged /> : <NavbarUnLoged />}
      <h2>{t("Ingredients Table")}</h2>

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
              {ingredientsList.map((ingredient, index) => (
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
            <strong>{t("Total Price")}: {totalIngredientPrice} € </strong>
          </div>
          <button onClick={handleSaveAndRecalculate} style={{ marginTop: '20px', padding: '10px', fontSize: '16px' }}>
            {t("Save and Recalculate")}
          </button>
          <p>La modification d'une valeur peut prendre un peu de temps, le tableau met un moment à réagir. Merci de faire preuve de patience !</p>
        </div>
      )}
    </>
  );
}

export default Forecast;
