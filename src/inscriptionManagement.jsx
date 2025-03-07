import NavbarUnLoged from './navbar_unloged';
import NavbarLoged from './navbar_loged';
import React, { useState, useEffect } from 'react';
import { BinIdInscription } from './acessCode';
import { getData, saveInscription, handleChange } from './dataFunction';
import { useTranslation } from "react-i18next";

function InscriptionManagement({ isAuthenticated }) { 
  const [inscriptionList, setInscriptionList] = useState([]);  
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchInscriptions = async () => {
      const allInscriptions = await getData(BinIdInscription);
      setInscriptionList(allInscriptions.inscriptions || []);
      setIsLoading(false);
    };
    fetchInscriptions();
  }, []);

  // Regrouper les inscriptions par événement
  const groupedByEvent = inscriptionList.reduce((acc, inscription) => {
    const eventName = inscription.event || "Unknown Event";
    if (!acc[eventName]) {
      acc[eventName] = [];
    }
    acc[eventName].push(inscription);
    return acc;
  }, {});

  // Calculer les totaux pour chaque événement
  const eventSummary = Object.entries(groupedByEvent).map(([eventName, eventInscriptions]) => {
    const totalInscribed = eventInscriptions.length;
    const vegetarianCount = eventInscriptions.filter(inscription => inscription.vege === "Yes").length;
    return { eventName, totalInscribed, vegetarianCount };
  });

  const handleDelete = (eventName, index) => {
    groupedByEvent[eventName].splice(index, 1);
    const updatedList = Object.values(groupedByEvent).flat();
    saveInscription(updatedList, BinIdInscription, setInscriptionList);
  };

  return (
    <>
      {isAuthenticated ? (<NavbarLoged />) : (<NavbarUnLoged />)}

      <div>
        <h2>{t("Event Registrations")}</h2><br/>
        {isLoading ? (
          <p>{t("Loading...")}</p>
        ) : inscriptionList.length === 0 ? (
          <p>{t("No registrations available.")}</p>
        ) : (
          Object.entries(groupedByEvent).map(([eventName, eventInscriptions]) => {
            const { totalInscribed, vegetarianCount } = eventSummary.find(event => event.eventName === eventName) || {};

            return (
              <div key={eventName}>
                <h3>{t("Event:")} {eventName}</h3>
                <p>{t("Total Participants:")}: {totalInscribed}</p>
                <p>{t("Vegetarian Participants:")}: {vegetarianCount}</p>
                <table border="1">
                  <thead>
                    <tr>
                      <th>{t("Surname")}</th>
                      <th>{t("Last Name")}</th>
                      <th>{t("Adhesion")}</th>
                      <th>{t("Vegetarian")}</th>
                      <th>{t("Comments")}</th>
                      <th>{t("Actions")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {eventInscriptions.map((inscription, index) => (
                      <tr key={index}>
                        <td>
                          <input
                            type="text"
                            value={inscription.Surname}
                            onChange={(e) => handleChange(index, 'surname', e.target.value, inscriptionList, saveInscription, BinIdInscription, setInscriptionList)}
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            value={inscription.LastName}
                            onChange={(e) => handleChange(index, 'lastName', e.target.value, inscriptionList, saveInscription, BinIdInscription, setInscriptionList)}
                          />
                        </td>
                        <td>
                          <select
                            value={inscription.adhesion}
                            onChange={(e) => handleChange(index, 'adhesion', e.target.value, inscriptionList, saveInscription, BinIdInscription, setInscriptionList)}
                          >
                            <option value="Yes">{t("Yes")}</option>
                            <option value="No">{t("No")}</option>
                          </select>
                        </td>
                        <td>
                          <select
                            value={inscription.vege}
                            onChange={(e) => handleChange(index, 'vege', e.target.value, inscriptionList, saveInscription, BinIdInscription, setInscriptionList)}
                          >
                            <option value="Yes">{t("Yes")}</option>
                            <option value="No">{t("No")}</option>
                          </select>
                        </td>
                        <td>
                          <input
                            type="text"
                            value={inscription.comments}
                            onChange={(e) => handleChange(index, 'comments', e.target.value, inscriptionList, saveInscription, BinIdInscription, setInscriptionList)}
                          />
                        </td>
                        <td>
                          <button onClick={() => handleDelete(eventName, index)}>{t("Delete")}</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          })
        )}
      </div>
    </>
  );
}

export default InscriptionManagement;
