import React, { useEffect, useState } from 'react';
import CircularProgressBar from '../../charts/CircularProgressBar';
import 'react-circular-progressbar/dist/styles.css';
import axios from 'axios';

function DashboardCard07() {
  const [peakHourData, setPeakHourData] = useState({
    peak_hour: '',
    count: 0,
    count_per: 0, 
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/peak_hour');
        const peakHourData = {
          peak_hour: response.data.peak_hour,
          count: response.data.count,
          count_per:  Math.round(response.data.count_per), 
        };

        setPeakHourData(peakHourData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
    const intervalId = setInterval(fetchData, 5000);

    return () => {
      clearInterval(intervalId); 
    };
  }, []);

  return (
    <div className="col-span-full xl:col-span-6 bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700">
      <header className="px-5 py-4 border-b border-slate-100 dark:border-slate-700 flex">
        <svg
          className="text-emerald-500"
          width="35"
          height="35"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
        >
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 7v3.764a2 2 0 0 0 1.106 1.789L16 14" />
        </svg>
        <h2 className="ml-3 font-semibold text-slate-800 dark:text-slate-100">Peak Hours</h2>
      </header>
      <div className="ml-5 p-3">
        <div className="ml-2 flex items-center">
          <div>
            <h3 className="mt-3 font-semibold text-gray-800 dark:text-gray-200">
              <span className="mr-3">🚀</span>
              {peakHourData.peak_hour}
            </h3>
            <p className="mt-4 text-gray-500 dark:text-gray-400" style={{ marginLeft: '3.3rem' }}>
              Peak Hour Count: {peakHourData.count}
            </p>
            {/* <p className="text-gray-500 dark:text-gray-400" style={{ marginLeft: '3.3rem' }}>
              Percentage Of Visitors: {peakHourData.count_per} %
            </p> */}
          </div>
          {/* <div className="ml-5 " style={{ marginLeft: '10rem',  }}>
            <CircularProgressBar percentage={peakHourData.count_per} />
          </div> */}
        </div>
      </div>
    </div>
  );
}

export default DashboardCard07;
