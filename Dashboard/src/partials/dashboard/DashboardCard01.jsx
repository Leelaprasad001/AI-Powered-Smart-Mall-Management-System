import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Icon from '../../images/icon-01.svg';
import RealtimeChart from '../../charts/RealtimeChart';

// Import utilities
import { tailwindConfig, hexToRGB } from '../../utils/Utils';

function DashboardCard01() {
const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        data: [0],
        fill: true,
        backgroundColor: `rgba(${hexToRGB(tailwindConfig().theme.colors.blue[500])}, 0.08)`,
        borderColor: tailwindConfig().theme.colors.indigo[500],
        borderWidth: 2,
        tension: 0,
        pointRadius: 0,
        pointHoverRadius: 3,
        pointBackgroundColor: tailwindConfig().theme.colors.indigo[500],
        pointHoverBackgroundColor: tailwindConfig().theme.colors.indigo[500],
        pointBorderWidth: 0,
        pointHoverBorderWidth: 0,
        clip: 20,
      },
    ],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/current_count');
        if (response.status === 200) {
          const newData = response.data; // Assuming the response contains the data you want to display
          const newLabels = chartData.labels.concat(new Date());
          const newDatasets = chartData.datasets.map((dataset) => ({
            ...dataset,
            data: dataset.data.concat(newData), // Assuming the response data matches your dataset structure
          }));
          setChartData({
            labels: newLabels,
            datasets: newDatasets,
          });
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    
    const interval = setInterval(() => {
      fetchData();
    }, 5000);

    return () => clearInterval(interval);
  }, [chartData]);

  
  return (
    <div className="flex flex-col col-span-full sm:col-span-6 bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700">
      <header className="px-5 py-4 border-b border-slate-100 dark:border-slate-700 items-center">
        <img src={Icon} width="32" height="32" alt="Icon 03" />
        <h2 className="mt-3 font-semibold text-slate-800 dark:text-slate-100">Current Visitors Count</h2>
      </header>
      {/* Chart built with Chart.js 3 */}
      {/* Change the height attribute to adjust the chart height */}
      <RealtimeChart data={chartData} width={595} height={248} />
    </div>
  );
}

export default DashboardCard01;
