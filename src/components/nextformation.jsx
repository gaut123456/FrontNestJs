import React, { useEffect, useState } from 'react';
import jwt_decode from "jwt-decode";
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import Navbar from './navbar';

const Nextformation = () => {
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
        if (localStorage.getItem('token') === null) {
            window.location.href = '/login';
        }
        else {
            setDecoded(jwt_decode(localStorage.getItem('token')));
            const token = localStorage.getItem('token');
            const decoded = jwt_decode(token);
            if (decoded.role === 'admin') {
                setIsAdmin(true);
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
        }

    }, []);


    const formations = []
    for (let i = 0; i < data.length; i++) {
        for (let y= 0; y < data[i].attendees.length; y++) {
            if (data[i].attendees[y].userId === decoded.id && !formations.includes(data[i])) {
                formations.push(data[i])
            }
        }
    }

    return (
        <div>
            <Navbar />
            {formations.map((formation, index) => {
                    return (
                        <div key={index}>
                            <div className="card">
                                <div className="card-body">
                                    <h5 className="card-title">{formation.name}</h5>
                                    <p className="card-text">{formation.description}</p>
                                    <p className="card-text">{formation.date}</p>
                                    <p className="card-text">{formation.instructor}</p>
                                </div>
                            </div>
                            <br />
                        </div>
                    )
                })
            }
        </div>
    );
};

export default Nextformation;