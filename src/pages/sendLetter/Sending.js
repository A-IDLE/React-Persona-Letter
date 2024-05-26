import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Sending.css';

const Sending = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { characterId } = location.state || {};

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/', { state: { characterId } }); // 이동할 경로로 변경
    }, 2000); // 3초 뒤에 이동

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
