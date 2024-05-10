import React, { useEffect } from 'react';
import { useNavigate, } from 'react-router-dom';

const Sending = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/LetterPage'); // 이동할 경로로 변경
    }, 3000); // 3초 뒤에 이동

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div>
      <p>부엉이가 전송 중</p>
    </div>
  );
};

export default Sending;
