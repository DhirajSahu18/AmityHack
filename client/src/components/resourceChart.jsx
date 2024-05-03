import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';

const ResourceChart = ({ allocatedResources }) => {
  const [data, setData] = useState({
    labels: [],
    datasets: []
  });

  useEffect(() => {
    const updateChartData = () => {
      setData(prevState => ({
        ...prevState,
        labels: [...prevState.labels, prevState.labels.length],
        datasets: Object.keys(allocatedResources).map(resourceType => ({
          label: resourceType,
          data: [...prevState.datasets.find(dataset => dataset.label === resourceType)?.data || [], allocatedResources[resourceType]],
          fill: false,
          borderColor: getRandomColor(),
          tension: 0.1
        }))
      }));
    };

    updateChartData();
  }, [allocatedResources]);

  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  return (
    <div>
      <h2>Resource Allocation Over Time</h2>
      <Line data={data} />
    </div>
  );
};

export default ResourceChart;
