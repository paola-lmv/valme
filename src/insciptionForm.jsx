import { Form, Button } from 'react-bootstrap';
import NavbarUnLoged from './navbar_unloged';
import NavbarLoged from './navbar_loged';
import React, { useState, useEffect } from 'react';
import { BinIdInscription, BinIdEvent } from './acessCode';
import { getData, saveInscription } from './dataFunction';
import { useTranslation } from "react-i18next";

function InscriptionForm({ isAuthenticated }) {
    const { t } = useTranslation();
    const [formData, setFormData] = useState({
        Surname: '',
        LastName: '',
        event: '',
        adhesion: '',
        vege: '',
        comments: ''
    });
    const [inscriptions, setInscriptions] = useState([]);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    
    useEffect(() => {
        const fetchData = async () => {
            const allInscriptions = await getData(BinIdInscription);
            const allEvents = await getData(BinIdEvent);
            setInscriptions(allInscriptions.inscriptions);
            setEvents(allEvents.evenement);
            setLoading(false);
        };
        fetchData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const updatedInscriptions = [formData, ...inscriptions];
        saveInscription(updatedInscriptions, BinIdInscription, setInscriptions);

        setFormData({
            Surname: '',
            LastName: '',
            event: '',
            adhesion: '',
            vege: '',
            comments: ''
        });

        setMessage(t("You have successfully registered for the event!"));
        setTimeout(() => setMessage(''), 3000);
    };

    // Style en ligne pour centrer le message
    const messageStyle = {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: 'rgba(0, 123, 255, 0.5)',
        color: 'white',
        padding: '20px',
        borderRadius: '5px',
        fontSize: '18px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        zIndex: 9999, // Assurez-vous que le message est au-dessus des autres éléments
    };

    return (
        <>
            {isAuthenticated ? <NavbarLoged /> : <NavbarUnLoged />}
            <h2>{t("Registration for an Event")}</h2>
            { loading ? (<div>{t("Loading")}...</div>):
            (<>
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="Surname">
                    <Form.Label>{t("Surname")}</Form.Label>
                    <Form.Control type="text" name="Surname" placeholder={t("Your Surname")} value={formData.Surname} onChange={handleChange} required />
                </Form.Group>

                <Form.Group className="mb-3" controlId="LastName">
                    <Form.Label>{t("Last Name")}</Form.Label>
                    <Form.Control type="text" name="LastName" placeholder={t("Your Last Name")} value={formData.LastName} onChange={handleChange} required />
                </Form.Group>

                <Form.Group className="mb-3" controlId="event">
                    <Form.Label>{t("Select an event")}</Form.Label>
                    <Form.Select
                        name="event"
                        value={formData.event}
                        onChange={handleChange}
                        required
                    >
                        <option value="">{t("Choose an event")}</option>
                        {events.map((event, index) => (
                            <option key={index} value={event.title}>{event.title}</option>
                        ))}
                    </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3" controlId="adhesion">
                    <Form.Label>{t("Are you an adherent of the BDE?")}</Form.Label>
                    <Form.Select name="adhesion" value={formData.adhesion} onChange={handleChange} required>
                        <option value="">{t("Select an option")}</option>
                        <option value="Yes">{t("Yes")}</option>
                        <option value="No">{t("No")}</option>
                    </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3" controlId="vege">
                    <Form.Label>{t("Are you vegetarian?")}</Form.Label>
                    <Form.Select name="vege" value={formData.vege} onChange={handleChange} required>
                        <option value="">{t("Select an option")}</option>
                        <option value="Yes">{t("Yes")}</option>
                        <option value="No">{t("No")}</option>
                    </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3" controlId="comments">
                    <Form.Label>{t("Any remarks or suggestions?")}</Form.Label>
                    <Form.Control as="textarea" rows={3} name="comments" placeholder={t("Write your remarks or suggestions here...")} value={formData.comments || ''} onChange={handleChange} />
                </Form.Group>

                <Button variant="primary" type="submit">{t("Submit")}</Button>
            </Form>
            </>)}

            {message && <div style={messageStyle}>{message}</div>}
        </>
    );
};

export default InscriptionForm;
