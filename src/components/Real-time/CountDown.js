import React, { useState, useEffect } from 'react';

function Countdown({ targetDate, onComplete }) {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(targetDate));

  useEffect(() => {
    
    const timer = setTimeout(() => {
      const newTimeLeft = calculateTimeLeft(targetDate);
      const difference = +new Date(targetDate) - +new Date();
      setTimeLeft(newTimeLeft);
      if (difference <= 0) {
        clearInterval(timer);
        console.log(123);
        onComplete();
      }
    }, 1000);

    return () => clearTimeout(timer);
  });

  function calculateTimeLeft(targetDate) {
    const difference = +new Date(targetDate) - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }

    return timeLeft;
  }

  // Render component
  return (
      <div>
         {timeLeft.minutes || 0}:{timeLeft.seconds || 0}      
    </div>
  );
}

export default Countdown;
