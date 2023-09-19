import React, { useEffect, useState } from 'react';

function TypingText() {
  const [text, setText] = useState('');
  const fullText = 'Smart Mall Management System';

  useEffect(() => {
    let currentIndex = 0;
    let typingInterval = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setText(fullText.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
      }
    }, 100); 

    const resetInterval = setInterval(() => {
      clearInterval(typingInterval); 
      currentIndex = 0; 
      setText(""); 
      typingInterval = setInterval(() => {
        if (currentIndex <= fullText.length) {
          setText(fullText.slice(0, currentIndex));
          currentIndex++;
        } else {
          clearInterval(typingInterval);
        }
      }, 100); 
    }, 8000); 

    return () => {
      clearInterval(typingInterval); 
      clearInterval(resetInterval); 
    };
  }, []);

  return (
    <span className="ml-2 font-bold" style={{ fontFamily: 'Quicksand', fontSize: '34px', fontWeight: '900', letterSpacing: '1px' }}>
      {text}
    </span>
  );
}

export default TypingText;
