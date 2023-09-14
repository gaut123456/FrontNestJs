import React, { useEffect, useState } from 'react';
import jwt_decode from "jwt-decode";
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import Navbar from './navbar';

const FormationWidget = () => {
    const [data, setData] = useState([]);
    const [isAdmin, setIsAdmin] = useState(false);
    const [sortBy, setSortBy] = useState('name');
    const [sortOrder, setSortOrder] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [decoded, setDecoded] = useState([]);
    const [motive, setMotive] = useState('');
    const [nom, setNom] = useState('');
    const [date, setDate] = useState('');
    const [intervenant, setIntervenant] = useState('');

    useEffect(() => {
        if (localStorage.getItem('token') !== null) {
            setDecoded(jwt_decode(localStorage.getItem('token')));
            const token = localStorage.getItem('token');
            const decoded = jwt_decode(token);
            if (decoded.role === 'admin') {
                setIsAdmin(true);
            }
        }

        try {
            fetch('http://localhost:3000/formation/retrieve')
                .then(response => response.json())
                .then(data => {
                    setData(data);
                });
        } catch (error) {
            console.info("error", error);
        }
    }, []);

    const handleSort = (key) => {
        if (sortBy === key) {
            setSortOrder(-sortOrder);
        } else {
            setSortBy(key);
            setSortOrder(1);
        }
    };

    const HandleInscription = (id) => {
        fetch('http://localhost:3000/formation/join', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "Access-Control-Allow-Origin": "*",
                "Authorization": "Bearer " + localStorage.getItem('token') + ""
            },
            body: JSON.stringify({
                id,
                motivation: motive
            }),
        })
            .then(response => response.text())
            .then(data => {
                console.log('Success');
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const filteredData = data.filter((formation) =>
        formation.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const sortedData = [...filteredData].sort((a, b) => {
        if (sortBy === 'name') {
            return sortOrder * a.name.localeCompare(b.name);
        } else if (sortBy === 'date') {
            return sortOrder * (new Date(a.date) - new Date(b.date));
        }
        return 0;
    });

    const HandleAddFormation = () => {
        fetch('http://localhost:3000/formation/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "Access-Control-Allow-Origin": "*",
                "Authorization": "Bearer " + localStorage.getItem('token') + ""
            },
            body: JSON.stringify({
                name: nom,
                date,
                instructor: intervenant,
                attendees: []
            })
        })
            .then(response => response.text())
            .then(data => {
                console.log('Success2');
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }

    return (
        <div className="widget-container">
                        <Navbar />
            <div className="widget-header">
                <h2>Formations</h2>
                {isAdmin && (
                    <Popup trigger={<button> Ajouter Une Formation</button>} position="bottom center">
                        <input type="text" placeholder="Nom" onChange={(event) => setNom(event.target.value)} />
                        <input type="text" placeholder="Date" onChange={(event) => setDate(event.target.value)} />
                        <input type="text" placeholder="intervenant" onChange={(event) => setIntervenant(event.target.value)} />
                        <button onClick={() => HandleAddFormation()}>Ajouter une formation</button>
                    </Popup>
                )}
            </div>
            <div className="widget-content">
                <input
                    type="text"
                    placeholder="Rechercher par nom"
                    value={searchTerm}
                    onChange={handleSearch}
                />
                <button onClick={() => handleSort('name')}>Trier par nom</button>
                <button onClick={() => handleSort('date')}>Trier par date</button>
                {sortedData.map((f1) => (
                    <div className='card' key={f1.id}>
                        <h3>{f1.name}</h3>
                        <p>Date: {f1.date}</p>
                        <p>Intervenant: {f1.instructor}</p>
                        <Popup trigger={<button> Rejoindre la formation</button>} position="bottom center">
                            <input type="text" placeholder="Motivation" onChange={(event) => setMotive(event.target.value)} />
                            <button onClick={() => HandleInscription(f1.id)}>S'inscrire</button>
                        </Popup>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FormationWidget;
