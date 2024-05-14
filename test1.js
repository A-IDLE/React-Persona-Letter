import React from 'react';
import './test3.css';

function App() {
  const scrollCarousel = (direction) => {
    const carousel = document.getElementById('carousel');
    const scrollAmount = direction * 240;
    carousel.scrollBy({
      top: 0,
      left: scrollAmount,
      behavior: 'smooth'
    });
  };

  return (
    <div className="container">
      <div className="header">
        <h1>Persona Letter</h1>
        <p>A service where users can choose a character and exchange handwritten-style letters with them, with the characters having distinct personalities powered by a large language model.</p>
        <div className="buttons">
          <button>Sign In</button>
          <button>Sign Up</button>
        </div>
      </div>
      <div className="carousel-buttons">
        <button onClick={() => scrollCarousel(-1)}>&#10094; Prev</button>
        <button onClick={() => scrollCarousel(1)}>Next &#10095;</button>
      </div>
      <div className="carousel" id="carousel">
        {['1', '2', '3', '4', '5', '6'].map((num) => (
          <div className="character" key={num}>
            <img src={`character${num}.jpg`} alt={`Character ${num}`} />
            <h3>Character {num}</h3>
            <p>A brief description of Character {num}.</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
