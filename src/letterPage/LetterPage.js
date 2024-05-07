import React from 'react';
import './LetterPage.css';  // Make sure to import the CSS styles
import letterImage from "/Users/user/Documents/aix4/dev/practice/React-Persona-Letter/src/images/letter_image.png"

export function LetterPage() {
  return (
    <div className='letterContainer'>
      <LetterImage />
      <ButtonContainer />
    </div>
  );
}

function LetterImage() {
  return (
    <div className='letterImage'>
      <img src={letterImage} alt="Letter" />
    </div>
  );
}

function ButtonContainer() {
  return (
    <div className='buttonContainer'>
      <LetterButton name="편지쓰기" onClick={writeLetterHandler} />
      <LetterButton name="편지기록" onClick={letterHistoryHandler} />
      <LetterButton name="뒤로가기" onClick={returnHandler} />
    </div>
  );
}

export const LetterButton = ({ name, onClick }) => {
  return (
    <button className='letterButton' onClick={onClick}>
      {name}
    </button>
  );
}

const writeLetterHandler = () => {
  console.log('Write Letter');
}

const letterHistoryHandler = () => {
  console.log('Letter History');
}

const returnHandler = () => {
  console.log('Return');
}
