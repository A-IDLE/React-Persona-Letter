import React, { useEffect, useState } from 'react';
import { getCharacters } from "../../apis/characterApi";
import { getUserName } from '../../apis/letterApi';
import './Main.css';
import { Logout } from '../auth/Logout';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import useCharacterStore from '../../store/useCharacterStore';

export const Character = ({ imageUrl, name, characterId, handleClickCharacter }) => {
    return (
        <div className="character" onClick={() => handleClickCharacter(characterId, name)}>
            <img src={imageUrl} alt={name} className="character-img" />
            <h3 className="character-title">{name}</h3>
        </div>
    );
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

    const handleClickCharacter = async (characterId, name) => {
        try {
            const response = await getUserName();
            const userName = response.data.user_name;

            if (userName) {
                navigate('/LetterPage', { state: { characterId, name } });
            } else {
                navigate('/info', { state: { characterId } }); // characterId를 함께 전달
            }
        } catch (error) {
            console.error('Failed to fetch user name:', error);
        }
    }

    useEffect(() => {
        setIsLoggedIn(loginStatus);

        fetchCharacters();
    }, [loginStatus, fetchCharacters]);

    const handleClickHeader = () => {
        navigate('/');
      } 

    return (
        <>
            <div className="container">
                <div className="header">
                    <h1 className="header-title" onClick={handleClickHeader}>Persona Letter CI /CD</h1>
                </div>
                <div className='main_intro'>
                    <p className="intro_phrase">
                        Exchange letters with your beloved characters. <br />Express your affection in every word.
                    </p>
                    <p className="intro_explanation">
                        Connect deeply, share your stories, and receive letters. Let your <br />
                        favorite character be a part of your life, discovering the joy of transcending <br />
                        reality and fiction. Dive into a unique experience by sending the first letter!                    
                    </p>
                </div>
                    <div className="buttons">
                        {isLoggedIn ? (
                            <Logout className="logout_button" />
                        ) : (
                            <button className="button" onClick={handleSignIn}>Sign In</button>
                        )}
                    </div>

                <Carousel>
                    {characters.map(character => (
                        <Character
                            key={character.character_id}
                            imageUrl={character.character_image_url}
                            name={character.character_name}
                            characterId={character.character_id}
                            handleClickCharacter={handleClickCharacter}
                        />
                    ))}
                </Carousel>
            </div>
        </>
    );
};

export default Main;
