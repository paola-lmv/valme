import React, { useState, useEffect } from 'react'; 
import NavbarUnLoged from './navbar_unloged';
import NavbarLoged from './navbar_loged';
import { getData, saveIngredient2, SyncIngredients } from './dataFunction';
import { BinIdRecipe, BinIdIngredient } from './acessCode';
import { useTranslation } from "react-i18next";

function DataBase({ isAuthenticated }) {
  // State hooks for managing ingredient list, recipe list, and loading status
  const [recipesList, setRecipesList] = useState([]); 
  const [ingredientsList, setIngredientsList] = useState([]); 
  const [isIngredientsLoading, setIsIngredientsLoading] = useState(true); 
  const [isRecipesLoading, setIsRecipesLoading] = useState(true);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    // Fetching recipe data and updating the state once retrieved
    const fetchRecipesList = async () => {
      const allRecipeData = await getData(BinIdRecipe); // Calling the function to fetch recipe data
      setRecipesList(allRecipeData.recipes); 
      setIsRecipesLoading(false);
    };
    fetchRecipesList(); 

    const fetchIngredientsList = async () => {
      const allIngredientData = await getData(BinIdIngredient); 
      setIngredientsList(allIngredientData.ingredients); 
      setIsIngredientsLoading(false);
    };
    fetchIngredientsList(); 
  }, []); // Empty dependency array to run only on component mount

  useEffect(() => {
  // Synchronize ingredient data with recipes once both are loaded
  SyncIngredients(recipesList, ingredientsList, isIngredientsLoading, isRecipesLoading, BinIdIngredient, setIngredientsList);
  },[isIngredientsLoading,isRecipesLoading,])
  // Handle changes in the ingredient input fields 
  const handleIngredientChange = (index, field, value) => {
    const updatedIngredientsList = [...ingredientsList]; // Create a copy of the ingredient data
    updatedIngredientsList[index][field] = value; // Update the specific field for the selected ingredient
    setIngredientsList(updatedIngredientsList); // Set the updated ingredient data
  };

  // Handle the save action, which persists the ingredient data
  const handleSaveData = () => {
    SyncIngredients(recipesList, ingredientsList, isIngredientsLoading, isRecipesLoading, BinIdIngredient, setIngredientsList);
    saveIngredient2(ingredientsList, BinIdIngredient, setIngredientsList); // Save the updated ingredient data
  };

  return (
    <>
      {/* Display the appropriate navbar based on whether the user is authenticated */}
      {isAuthenticated ? <NavbarLoged /> : <NavbarUnLoged />}
      <h2>{t("Interactive Ingredient Table")}</h2>
      <div style={{ padding: '10px', backgroundColor: '#f9f9f9', border: '1px solid #ddd', marginBottom: '20px' }}>
            <p>{t("This page is designed to enter the prices of ingredients in order to calculate the estimated total price. Please specify the quantity of the product and the corresponding price for that quantity. Be sure to enter the quantity using the same unit of measurement as the product. You can also provide the supplier from which the price is sourced (often Metro) and include the website with the relevant information.")}</p>
          </div>
      <div style={{ overflowX: 'auto' }}>
        <table border="1" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>{t("Ingredient")}</th>
              <th>{t("Supplier")}</th>
              <th>{t("Web Link of the Ingredient")}</th>
              <th>{t("Quantity")}</th>
              <th>{t("Measure")}</th>
              <th>{t("Price €")}</th>              
            </tr>
          </thead>
          <tbody>
            {isIngredientsLoading ? (
              <tr><td colSpan="6">{t("Loading")}...</td></tr> // Show loading message when ingredients are being fetched
            ) : (
              ingredientsList.map((ingredient, index) => (
                <tr key={index}>
                  <td>{ingredient.type}</td> 
                  <td>
                    <input
                      type="text"
                      value={ingredient.supplier}
                      onChange={(e) => handleIngredientChange(index, 'supplier', e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      type="url"
                      value={ingredient.webLink}
                      onChange={(e) => handleIngredientChange(index, 'webLink', e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={ingredient.priceQty}
                      onChange={(e) => handleIngredientChange(index, 'priceQty', e.target.value)} 
                    />
                  </td>
                  <td>{ingredient.measure}</td>
                  <td>
                    <input
                      type="number"
                      value={ingredient.unitPrice}
                      onChange={(e) => handleIngredientChange(index, 'unitPrice', e.target.value)} 
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <button onClick={handleSaveData} style={{ marginTop: '20px', padding: '10px', fontSize: '16px' }}>
          {t("Save")}
        </button>
      </div>
    </>
  );
}

export default DataBase;
