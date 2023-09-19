import React, { useEffect, useState } from 'react';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

function CircularProgressBar({ percentage }) {
  const [currentPercentage, setCurrentPercentage] = useState(percentage);

  useEffect(() => {
    if (currentPercentage < percentage) {
      const timer = setInterval(() => {
        setCurrentPercentage((prevPercentage) => {
          if (prevPercentage < percentage) {
            return prevPercentage + 1;
          }
          clearInterval(timer);
          return percentage;
        });
      }, 50);
    }
  }, [currentPercentage, percentage]);

  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ width: 100}}>
        <CircularProgressbar
            value={currentPercentage}
            text={`${currentPercentage}%`}
            styles={{
              path: {
                stroke: `#27374D`, 
                strokeLinecap: 'round',
                transition: 'stroke-dashoffset 0.5s ease 0s', 
              },
              trail: {
                
              },
              text: {
                fill: '#27374D',
                fontSize: '20px',
                fontWeight: 'bold',
              },
            }}
          />      
      </div>
    </div>
  );
}

export default CircularProgressBar;
