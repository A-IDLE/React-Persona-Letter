import React, { useEffect, useState } from 'react';
import { getCharacters } from "../../apis/characterApi";
import './Main.css';
import { Logout } from '../auth/Logout';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import useCharacterStore from '../../store/useCharacterStore';


export const Character = ({ imageUrl, name, characterId }) => {

    const navigate = useNavigate();

    const handleClickCharacter = () => {
        navigate('/LetterPage', { state: { characterId } });
    }
    return (
        <div className="character" onClick={handleClickCharacter}>
            <img src={imageUrl} alt={name} className="character-img" />
            <h3 className="character-title">{name}</h3>
        </div>
    )

}




export const Carousel = ({ children }) => {
    const scrollCarousel = (direction) => {
        const scrollAmount = direction * 240;
        const carousel = document.getElementById('carousel');
        carousel.scrollBy({
            top: 0,
            left: scrollAmount,
            behavior: 'smooth',
        });
    };

    return (
        <>
            <div className='carousel-box'>
                <div className="carousel-buttons">
                    <button className="button" onClick={() => scrollCarousel(-1)}>&#10094; Prev</button>
                    <button className="button" onClick={() => scrollCarousel(1)}>Next &#10095;</button>
                </div>
                <div className="carousel-container">
                    <div className="carousel" id="carousel">
                        {children}
                    </div>
                </div>
            </div>

        </>
    );
};



export const Main = () => {
    const [characterList, setCharacterList] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const { characters, fetchCharacters } = useCharacterStore();

    const navigate = useNavigate();


    const loginStatus = useAuth();
    
    

    const handleSignIn = () => {
        navigate('/login');
    }

    useEffect(() => {
        setIsLoggedIn(loginStatus);

        // const fetchCharactersData = async () => {
        //     try {
        //         const response = await getCharacters();
        //         setCharacterList(response.data[0].characters);
        //         console.log(response.data[0].characters);
        //     } catch (error) {
        //         console.error('Failed to fetch series data:', error);
        //     }
        // };

        // fetchCharactersData();

        fetchCharacters();
        

    }, [loginStatus, fetchCharacters]);

    return (
        <>
            <div className="container">
                <div className="header">
                    <h1 className="header-title">Persona Letter</h1>
                    <p className="header-paragraph">
                        A service where users can choose a character and exchange handwritten-style letters with them, with the characters having distinct personalities powered by a large language model.
                    </p>
                    <div className="buttons">
                        {isLoggedIn ? (
                            <Logout />
                        ) : (
                            <button className="button" onClick={handleSignIn}>Sign In</button>
                        )}
                    </div>
                </div>
                <Carousel>
                    {characters.map(character => (
                        <Character
                            key={character.character_id}
                            imageUrl={character.character_image_url}
                            name={character.character_name}
                            characterId={character.character_id}
                        />
                    ))}
                </Carousel>
            </div>
        </>
    );
};

export default Main;
