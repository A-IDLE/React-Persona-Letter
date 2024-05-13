import React, { useEffect, useId, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getCharacters } from "../../apis/characterApi";
import './Main.css';

// Character Component
function Character({ name, imageUrl }) {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate("/LetterPage");
    };

    return (
        <div className="character" onClick={handleClick}>
            <img src={imageUrl} alt={name} />
            <p>{name}</p>
        </div>
    );
}

// App Component
function App() {
    const [seriesList, setSeriesList] = useState([]);

    useEffect(() => {
        const fetchSeriesData = async () => {
            try {
                const response = await getCharacters();
                console.log(response.data);
                setSeriesList(response.data);
                // setSeriesList(response);
            } catch (error) {
                console.error('Failed to fetch series data:', error);
            }
        };

        fetchSeriesData();
    }, []);

    return (
        <div className="series-container">
            {seriesList.map(series => (
                <div key={series.series}>
                    <h2>{series.series}</h2>
                    <div className="character-row">
                        {series.characters.map(character => (
                            <Character key={character.character_name} name={character.character_name} imageUrl={character.character_image_url} />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}

export default App;
