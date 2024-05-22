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
