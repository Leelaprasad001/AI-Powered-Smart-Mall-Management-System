import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Icon from '../../images/icon-02.svg';
import RealtimeChart from '../../charts/RealtimeChart';

// Import utilities
import { tailwindConfig, hexToRGB } from '../../utils/Utils';

function DashboardCard04() {
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
        const response = await axios.get('http://127.0.0.1:8000/count_cam/?cam_id=1');
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
    <div className="flex flex-col col-span-full sm:col-span-6 xl:col-span-4 bg-white dark:bg-slate-800 shadow-lg rounded-sm border border-slate-200 dark:border-slate-700">
      <header className="px-4 py-3 border-b border-slate-100 dark:border-slate-700 items-center">
        <img src={Icon} width="26" height="26" alt="Icon 03" />
        <h5 className="mt-3 font-semibold text-slate-800 dark:text-slate-100">Stall - 2 Visitors Count</h5>
      </header>
      {/* Chart built with Chart.js 3 */}
      {/* Change the height attribute to adjust the chart height */}
      <RealtimeChart data={chartData} width={389} height={128} />
    </div>
  );
}

export default DashboardCard04;
