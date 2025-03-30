import React, { useState, useEffect } from 'react';
import { Card, CardBody, CardHeader, CardImg, Form, Button, Row, Col, ListGroup } from 'react-bootstrap';
import NavbarUnLoged from './navbar_unloged';
import NavbarLoged from './navbar_loged';
import { BinIdArchive, BinIdEvent, BinIdIngredient } from './acessCode';
import { getData, saveRecipe, saveIngredient2 } from './dataFunction';
import { useTranslation } from "react-i18next";
import { Link } from 'react-router-dom';

function ArchiveDisplay({ isAuthenticated }) {
  const { t } = useTranslation();
  const [archive, setArchive] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newRecipe, setNewRecipe] = useState({
    title: '',
    ingredients: [], // tableau d'objets { quantity, measure, type }
    portions: '',
    description: '',
    imageUrl: '',
    event: '' // titre de l'événement sélectionné
  });
  
  // Au montage, charger les événements et le document archive
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Charger la liste des événements
        const allEvents = await getData(BinIdEvent);
        setEvents(allEvents.evenement);
        
        // Charger les recettes archivées (document "archive")
        const archiveData = await getData(BinIdArchive);
        setArchive(archiveData.recipes);
        
        setLoading(false);
      } catch (error) {
        console.error("Erreur lors du chargement des données", error);
      }
    };
    fetchData();
  }, []);
  
  // Gestion des changements sur le formulaire (champs texte)
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRecipe(prev => ({ ...prev, [name]: value }));
  };

  // Pour les ingrédients, nous utilisons une textarea où chaque ligne représente un ingrédient
  // au format : "quantity|measure|type" (exemple : "600|g|épinards")
  const handleIngredientsChange = (e) => {
    const text = e.target.value;
    const lines = text.split('\n').filter(line => line.trim() !== '');
    const parsedIngredients = lines.map(line => {
      const [quantity, measure, type] = line.split('|').map(item => item.trim());
      return { quantity, measure, type };
    });
    setNewRecipe(prev => ({ ...prev, ingredients: parsedIngredients }));
  };

  // Fonction pour ajouter la recette dans l'archive
  const handleAddRecipe = async () => {
    // Vérifier les champs obligatoires
    if (!newRecipe.title || !newRecipe.portions || !newRecipe.event) {
      alert(t("Please fill in required fields (title, portions, event)."));
      return;
    }
    
    try {
      // Mettre à jour le document archive avec la nouvelle recette
      const updatedArchive = [...archive, newRecipe];
      await saveRecipe(updatedArchive, BinIdArchive, setArchive);
      
      // Mettre à jour la base des ingrédients :
      // Pour chaque ingrédient de la nouvelle recette,
      // si l'ingrédient existe déjà (même type), on ajoute le titre de la recette dans sa liste,
      // sinon, on crée un nouvel ingrédient.
      const allIngredientsData = await getData(BinIdIngredient);
      let allIngredients = allIngredientsData.ingredients;
      
      newRecipe.ingredients.forEach(newIng => {
        const existingIng = allIngredients.find(ing =>
          ing.type.trim().toLowerCase() === newIng.type.toLowerCase()
        );
        if (existingIng) {
          if (!existingIng.listRecipe.includes(newRecipe.title)) {
            existingIng.listRecipe.push(newRecipe.title);
          }
        } else {
          allIngredients.push({
            ...newIng,
            priceQty: "0",
            supplier: "",
            unitPrice: "0",
            minPurchaseQty: 0,
            purchaseQty: 0,
            ingredientPrice: 0,
            webLink: "",
            listRecipe: [newRecipe.title]
          });
        }
      });
      
      await saveIngredient2(allIngredients, BinIdIngredient, () => {});
      
      // Réinitialiser le formulaire
      setNewRecipe({
        title: '',
        ingredients: [],
        portions: '',
        description: '',
        imageUrl: '',
        event: ''
      });
      
    } catch (error) {
      console.error("Error adding recipe", error);
    }
  };
  
  return (
    <>
      {isAuthenticated ? <NavbarLoged /> : <NavbarUnLoged />}
      <h2>{t("Archive of Recipes")}</h2>
      
      {/* Formulaire pour ajouter une nouvelle recette */}
      <Card className="mb-4">
        <CardHeader>{t("Add New Recipe")}</CardHeader>
        <CardBody>
          <Form>
            <Form.Group>
              <Form.Label>{t("Title")}</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={newRecipe.title}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>{t("Portions")}</Form.Label>
              <Form.Control
                type="number"
                name="portions"
                value={newRecipe.portions}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>{t("Description")}</Form.Label>
              <Form.Control
                as="textarea"
                name="description"
                value={newRecipe.description}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>{t("Image URL")}</Form.Label>
              <Form.Control
                type="text"
                name="imageUrl"
                value={newRecipe.imageUrl}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>{t("Ingredients (one per line as: quantity|measure|type)")}</Form.Label>
              <Form.Control
                as="textarea"
                onChange={handleIngredientsChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>{t("Select Event")}</Form.Label>
              <Form.Control
                as="select"
                name="event"
                value={newRecipe.event}
                onChange={handleInputChange}
              >
                <option value="">{t("Choose an event")}</option>
                {events.map((ev, idx) => (
                  <option key={idx} value={ev.title}>{ev.title}</option>
                ))}
              </Form.Control>
            </Form.Group>
            <Button variant="primary" onClick={handleAddRecipe}>
              {t("Add Recipe to Archive")}
            </Button>
          </Form>
        </CardBody>
      </Card>
      
      {/* Affichage de l'archive des recettes */}
      {loading ? (
        <div>{t("Loading")}...</div>
      ) : (
        <Row>
          {archive.map((recipe, idx) => (
            <Col key={idx} sm={12} md={6} lg={4}>
              <Card className="mb-3">
                <Card.Header>{recipe.title}</Card.Header>
                {recipe.imageUrl && (
                  <CardImg src={recipe.imageUrl} alt={recipe.title} style={{ height: '200px', objectFit: 'cover' }} />
                )}
                <CardBody>
                  <p>{t("Portions")}: {recipe.portions}</p>
                  <p>{recipe.description}</p>
                  <p>{t("Event")}: {recipe.event}</p>
                  <ListGroup>
                    {recipe.ingredients.map((ing, i) => (
                      <ListGroup.Item key={i}>
                        {ing.quantity} {ing.measure} {ing.type}
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </CardBody>
              </Card>
            </Col>
          ))}
        </Row>
      )}
      
      <footer style={{ textAlign: 'center', marginTop: '20px', padding: '10px', color:'black', fontWeight: 'bold', textDecoration: 'none' }}>
        <Link to="/mentionsLegales">Mentions Légales</Link>
      </footer>
    </>
  );
}

export default ArchiveDisplay;
