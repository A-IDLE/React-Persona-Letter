// import React, { useEffect, useState } from 'react';
// import { getLetterList } from '../../apis/letterApi';
// import LetterPage from './LetterPage';
// import { useLocation } from 'react-router-dom';

// const LetterPageWrapper = () => {
//   const location = useLocation();
//   const { characterId, name } = location.state || {};
//   const [letters, setLetters] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     const fetchLetters = async () => {
//       try {
//         const response = await getLetterList(characterId);
//         const sortedLetters = response.data.sort((a, b) => new Date(b.received_at) - new Date(a.received_at));
//         setLetters(sortedLetters);
//       } catch (error) {
//         console.error("Failed to fetch letter data:", error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     if (characterId) {
//       fetchLetters();
//     }
//   }, [characterId]);

//   return (
//     <LetterPage letters={letters} isLoading={isLoading} characterId={characterId} name={name} />
//   );
// };

// export default LetterPageWrapper;





  // useEffect(() => {
  //   const images = document.querySelectorAll('.fly img');
  //   let currentImageIndex = 0;

  //   const showNextImage = () => {
  //     images.forEach(img => img.classList.add('hidden')); // 모든 이미지를 숨김
  //     images[currentImageIndex].classList.remove('hidden'); // 현재 이미지를 표시
  //     currentImageIndex = (currentImageIndex + 1) % images.length;
  //   };

  //   // 처음에 모든 이미지를 숨기고, 순차적으로 나타나게 함
  //   images.forEach(img => img.classList.add('hidden'));
  //   setTimeout(() => {
  //     showNextImage();
  //     const intervalId = setInterval(showNextImage, 1000); // 1초 간격으로 이미지 변경
  //     return () => clearInterval(intervalId);
  //   }, 0); // 처음 1초 후 첫 이미지 나타남
  // }, []);


  /* <div className='fly'>
        <img src="/images/letterPage/1.png" alt="1" />
        <img src="/images/letterPage/2.png" alt="2" />
        <img src="/images/letterPage/.png" alt="3" />
      </div> */