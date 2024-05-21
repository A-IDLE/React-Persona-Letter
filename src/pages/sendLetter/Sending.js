import React, { useEffect } from 'react';
import { useLocation, useNavigate, } from 'react-router-dom';
import "./Sending.css";

const Sending = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { characterId } = location.state || {};

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/', {state: {characterId}}); // 이동할 경로로 변경
    }, 3000); // 3초 뒤에 이동

    return () => clearTimeout(timer);
  }, [navigate]);

  useEffect(() => {
    const images = document.querySelectorAll('.fly img');
    let currentImageIndex = 0;

    const showNextImage = () => {
      images.forEach(img => img.classList.add('hidden')); // 모든 이미지를 숨김
      images[currentImageIndex].classList.remove('hidden'); // 현재 이미지를 표시
      currentImageIndex = (currentImageIndex + 1) % images.length;
    };

    // 처음에 모든 이미지를 숨기고, 순차적으로 나타나게 함
    images.forEach(img => img.classList.add('hidden'));
    setTimeout(() => {
      showNextImage();
      const intervalId = setInterval(showNextImage, 1000); // 1초 간격으로 이미지 변경
      return () => clearInterval(intervalId);
    }, 0); // 처음 1초 후 첫 이미지 나타남
  }, []);

  return (
    <>
    <div>
      <div className='fly'>
        <img src="/images/letterPage/1.png" alt="1" />
        <img src="/images/letterPage/2.png" alt="2" />
        <img src="/images/letterPage/3.png" alt="3" />
      </div>
    </div>
    <div>
      <p>전송중</p>
    </div>
    </>
  );
};

export default Sending;
