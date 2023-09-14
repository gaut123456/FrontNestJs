import React, { useEffect, useState } from "react";
import jwt_decode from "jwt-decode";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import Navbar from "./navbar";

const Guide = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [sortOrder, setSortOrder] = useState("asc");
  const [selectedBook, setSelectedBook] = useState(false);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [rating, setRating] = useState("");
  const [summary, setSummary] = useState("");

  const BASE_URL = "http://localhost:3000";

  useEffect(() => {
    if (localStorage.getItem("token") !== null) {
      const token = localStorage.getItem("token");
      const decoded = jwt_decode(token);
      if (decoded.role === "admin") {
        setIsAdmin(true);
      }
    }
    fetch("http://localhost:3000/user/guides")
      .then((response) => response.json())
      .then((data) => {
        setData(data);
        setFilteredData(data);
      });
  }, []);

  const handleSearch = () => {
    const filteredData = data.filter((item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredData(filteredData);
  };

  const handleSort = () => {
    const sortedData = [...filteredData];
    if (sortOrder === "asc") {
      sortedData.sort((a, b) => a.rating - b.rating);
      setSortOrder("desc");
    } else {
      sortedData.sort((a, b) => b.rating - a.rating);
      setSortOrder("asc");
    }
    setFilteredData(sortedData);
  };

  const handleTitleClick = (book) => {
    if (selectedBook === false || selectedBook.id !== book.id) {
      setSelectedBook(book);
    } else {
      setSelectedBook(false);
    }
  };

  const DownloadGuide = (id) => {
    const url = BASE_URL + "/dlguides/" + id;

    fetch(url)
      .then((response) => {
        return response.text();
      })
      .then((textData) => {
        const blob = new Blob([textData], { type: "text/plain" });

        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "guide" + id + ".txt";
        a.click();

        window.URL.revokeObjectURL(url);
      })
      .catch((error) => {
        console.error("Error downloading guide:", error);
      });
  };

  const handleAdd = () => {
    const url = BASE_URL + "/admin/add";
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=utf-8",
        "Access-Control-Allow-Origin": "*",
        Authorization: "Bearer " + localStorage.getItem("token") + "",
      },
      body: JSON.stringify({
        title,
        author,
        rating,
        summary,
      }),
    };

    fetch(url, options)
      .then((response) => response.text())
      .then((data) => {
        window.location.href = "/guide";
      });
  };

  return (
    <div>
      <Navbar />
      <h1>Guide</h1>
      <input
        type="text"
        placeholder="Rechercher par titre"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button onClick={handleSearch}>Rechercher</button>
      <button onClick={handleSort}>
        Trier par note ({sortOrder === "asc" ? "croissant" : "décroissant"})
      </button>

      <br />
      <br />
      <br />
      {isAdmin && (
        <Popup
          trigger={<button> Ajouter un Guides</button>}
          position="bottom center"
        >
          <div className="popup">
            <input
              type="text"
              placeholder="Titre"
              onChange={(event) => setTitle(event.target.value)}
            />
            <input
              type="text"
              placeholder="Auteur"
              onChange={(event) => setAuthor(event.target.value)}
            />
            <input
              type="text"
              placeholder="Note"
              onChange={(event) => setRating(event.target.value)}
            />
            <input
              type="text"
              placeholder="Résumé"
              onChange={(event) => setSummary(event.target.value)}
            />
            <button onClick={() => handleAdd()}>Ajouter</button>
          </div>
        </Popup>
      )}

      {filteredData.map((item, index) => (
        <div key={index} className="card">
          <h1
            onClick={() => handleTitleClick(item)}
            style={{ cursor: "pointer" }}
          >
            {item.title}
          </h1>
          {selectedBook && selectedBook.id === item.id && (
            <div>
              <h3>{selectedBook.title}</h3>
              <p>Auteur : {selectedBook.author}</p>
              <p>Note : {selectedBook.rating}</p>
              <p>Résumé : {selectedBook.summary}</p>
              <button onClick={() => DownloadGuide(item.id)}>
                Télécharger
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Guide;
