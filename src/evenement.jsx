import React, { useState, useEffect } from 'react';
import NavbarUnLoged from './navbar_unloged';
import NavbarLoged from './navbar_loged';
import { getData,saveIngredient2,saveRecipe, saveEvent, deleteEvent, updateEvent,saveInscription } from './dataFunction';
import { BinIdEvent, BinIdInscription,BinIdRecipe,BinIdIngredient } from './acessCode';
import { useTranslation } from "react-i18next";
import { Modal, Button, Form } from 'react-bootstrap';

function Evenement({ isAuthenticated }) {
  const [recipes, setRecipe] = useState([]);
  const [ingredientsList, setIngredientsList] = useState([]);
  const [eventsList, setEventsList] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const { t } = useTranslation();
  const [inscriptions, setInscriptions] = useState([]);

  const [newEvent, setNewEvent] = useState({
    title: '',
    date: '',
    location: '',
    description: ''
  });

  useEffect(() => {
    const fetch = async () => {
      const allInscription = await getData(BinIdInscription);
      const allEvents = await getData(BinIdEvent);
      const allRecipe = await getData(BinIdRecipe); // Call the imported function to get data
      const allIngredients = await getData(BinIdIngredient); 
      console.log("ingredients",allIngredients.ingredients)
      console.log("eventsList",allEvents.evenement)
      console.log("recipes",allRecipe.recipes)
      console.log("inscriptions",allInscription.inscriptions)
      setEventsList(allEvents.evenement);
      setRecipe(allRecipe.recipes);
      setIngredientsList(allIngredients.ingredients);
      setInscriptions(allInscription.inscriptions); //  On récupère aussi les inscriptions
      setIsLoading(false);
    };
    fetch();

  }, []);

  // Fonction pour ouvrir la modale d'édition
  const handleShowModal = (event) => {
    setSelectedEvent(event);
    setShowModal(true);
  };

  // Deletes a recipe from the list
    const handleDeleteRecipies = (recipeToDelete) => {
      console.log("supprime une recette")
        
      ingredientsList.forEach((ingredient) => {
              console.log(ingredient,"pour chaque ingrédient")
              // Check if the ingredient's listRecipe includes the title of the recipe to delete
              if (ingredient.listRecipe && ingredient.listRecipe.includes(recipeToDelete.title)) {
                console.log("dans le if")
                  // Remove the recipe title from the listRecipe
                  ingredient.listRecipe = ingredient.listRecipe.filter(
                      (title) => title !== recipeToDelete.title
                  );
              }
          })
          const updatedRecipe = recipes.filter(
            (recipe) => recipe.title !== recipeToDelete.title
          )
        saveRecipe(updatedRecipe, BinIdRecipe, setRecipe); // Save the updated list
        saveIngredient2(ingredientsList, BinIdIngredient, setIngredientsList); // Save the updated ingredient data
        
    };

  const handleDeleteEvent = async (index) => {
    console.log("supprime un evenement")
    const eventToDelete = eventsList[index].title;
  
    const updatedEvents = eventsList.filter((_, i) => i !== index);
    const updatedInscriptions = inscriptions.filter(
      (inscription) => inscription.event !== eventToDelete // 🔥 Filtrer les inscriptions liées
    );
  
    await deleteEvent({ evenement: updatedEvents},  BinIdEvent);
    recipes.forEach((recipe) => { handleDeleteRecipies(recipe) })

    saveInscription(updatedInscriptions, BinIdInscription, setInscriptions);
  
    setEventsList(updatedEvents);
    setInscriptions(updatedInscriptions); // 🔥 Met à jour les inscriptions après suppression
  };

  // Fonction pour fermer la modale
  const handleCloseModal = () => {
    setSelectedEvent(null);
    setShowModal(false);
  };

  // Fonction pour modifier les champs de l'événement sélectionné (modification)
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedEvent({ ...selectedEvent, [name]: value });
  };

  // Fonction pour modifier les champs de l'événement en création
  const handleCreateInputChange = (e) => {
    const { name, value } = e.target;
    setNewEvent({ ...newEvent, [name]: value });
  };

  // Fonction pour enregistrer les modifications d'un événement existant
  const handleSaveEvent = async () => {
    const updatedEvents = eventsList.map(event =>
      event.title === selectedEvent.title ? selectedEvent : event
    );
    await updateEvent(updatedEvents, BinIdEvent);
    setEventsList(updatedEvents);
    handleCloseModal();
  };

  // Fonction pour ajouter un nouvel événement
  const handleCreateEvent = async (e) => {
    e.preventDefault();

    const updatedEvents = [newEvent, ...eventsList];
    await saveEvent(updatedEvents, BinIdEvent);
    setEventsList(updatedEvents);

    // Réinitialiser le formulaire
    setNewEvent({
      title: '',
      date: '',
      location: '',
      description: ''
    });
  };

  return (
    <>
      {isAuthenticated ? <NavbarLoged /> : <NavbarUnLoged />}
      <h2>{t("Event Management")}</h2>

      {isLoading ? <p>{t("Loading events...")}</p> : (
        <div>
          <table border="1" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th>{t("Event Title")}</th>
                <th>{t("Date")}</th>
                <th>{t("Location")}</th>
                <th>{t("Description")}</th>
                <th>{t("Actions")}</th>
              </tr>
            </thead>
            <tbody>
              {eventsList.map((event, index) => (
                <tr key={index}>
                  <td>{event.title}</td>
                  <td>{event.date}</td>
                  <td>{event.location}</td>
                  <td>{event.description}</td>
                  <td>
                    <Button variant="warning" onClick={() => handleShowModal(event)}>{t("Edit")}</Button>
                    <Button variant="danger" onClick={() => handleDeleteEvent(index)}>{t("Delete")}</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <h3>{t("Create Event")}</h3>

          <form onSubmit={handleCreateEvent}>
            <div>
              <label>{t("Event Title")}</label>
              <input
                type="text"
                name="title"
                value={newEvent.title}
                onChange={handleCreateInputChange}
                required
              />
            </div>

            <div>
              <label>{t("Date")}</label>
              <input
                type="date"
                name="date"
                value={newEvent.date}
                onChange={handleCreateInputChange}
                required
              />
            </div>

            <div>
              <label>{t("Location")}</label>
              <input
                type="text"
                name="location"
                value={newEvent.location}
                onChange={handleCreateInputChange}
                required
              />
            </div>

            <div>
              <label>{t("Description")}</label>
              <textarea
                name="description"
                value={newEvent.description}
                onChange={handleCreateInputChange}
                required
              />
            </div>

            <button type="submit">{t("Save Event")}</button>
          </form>
        </div>
      )}

      {/* Modale pour modifier un événement */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{t("Edit Event")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedEvent && (
            <Form>
              <Form.Group>
                <Form.Label>{t("Event Title")}</Form.Label>
                <Form.Control type="text" name="title" value={selectedEvent.title} onChange={handleInputChange} />
              </Form.Group>
              <Form.Group>
                <Form.Label>{t("Date")}</Form.Label>
                <Form.Control type="date" name="date" value={selectedEvent.date} onChange={handleInputChange} />
              </Form.Group>
              <Form.Group>
                <Form.Label>{t("Location")}</Form.Label>
                <Form.Control type="text" name="location" value={selectedEvent.location} onChange={handleInputChange} />
              </Form.Group>
              <Form.Group>
                <Form.Label>{t("Description")}</Form.Label>
                <Form.Control as="textarea" name="description" value={selectedEvent.description} onChange={handleInputChange} />
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>{t("Close")}</Button>
          <Button variant="primary" onClick={handleSaveEvent}>{t("Save Changes")}</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Evenement;
