import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Sending.css';

const Sending = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { characterId } = location.state || {};

  useEffect(() => {
    // characterId가 없으면 홈 페이지로 리다이렉트
    if (!characterId) {
      navigate('/');
      return;
    }

    const timer = setTimeout(() => {
      navigate('/', { state: { characterId } });
    }, 2000); // 2초 뒤에 이동

    return () => clearTimeout(timer);
  }, [navigate, characterId]);

  return (
    <>
      <div>
        <img src="/images/sendLetter/send_letter.png" alt="편지" className="owl" />
      </div>
    </>
  );
};

export default Sending;
