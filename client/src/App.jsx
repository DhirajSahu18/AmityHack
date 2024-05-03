import React, { useState } from 'react';
import './App.css';
import ResourceChart from './components/resourceChart';

function App() {
  const [formData, setFormData] = useState({
    magnitude: 0,
    affectedPopulation: 0,
    totalResources: {
      medicalPersonnel: 0,
      foodSupplies: 0,
      constructionWorkers: 0,
      financialResources: 0
    },
    allocatedResources: {}
  });

  const handleMagnitudeChange = (e) => {
    setFormData(prevState => ({
      ...prevState,
      magnitude: e.target.value
    }));
  };

  const handlePopulationChange = (e) => {
    setFormData(prevState => ({
      ...prevState,
      affectedPopulation: e.target.value
    }));
  };

  const handleTotalResourcesChange = (e) => {
    const { name, value } = e.target;
    const [resourceType, fieldName] = name.split('.');

    setFormData(prevState => ({
      ...prevState,
      totalResources: {
        ...prevState.totalResources,
        [resourceType]: {
          ...prevState.totalResources[resourceType],
          [fieldName]: value
        }
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8080/allocate-minimum-resources', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          magnitude: formData.magnitude,
          population: formData.affectedPopulation,
          totalResources: formData.totalResources
        })
      });
      const data = await response.json();
      setFormData(prevState => ({
        ...prevState,
        allocatedResources: data
      }));
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <h2>Resource Allocation Form</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Magnitude of Disaster:</label>
          <input type="number" value={formData.magnitude} onChange={handleMagnitudeChange} />
        </div>
        <div>
          <label>Population Affected:</label>
          <input type="number" value={formData.affectedPopulation} onChange={handlePopulationChange} />
        </div>
        <div>
          <h3>Total Resources</h3>
          <div>
            <label>Total Medical Personnel:</label>
            <input type="number" name="medicalPersonnel.count" value={formData.totalResources.medicalPersonnel.count} onChange={handleTotalResourcesChange} />
          </div>
          <div>
            <label>Total Food Supplies:</label>
            <input type="number" name="foodSupplies.count" value={formData.totalResources.foodSupplies.count} onChange={handleTotalResourcesChange} />
          </div>
          <div>
            <label>Total Construction Workers:</label>
            <input type="number" name="constructionWorkers.count" value={formData.totalResources.constructionWorkers.count} onChange={handleTotalResourcesChange} />
          </div>
          <div>
            <label>Total Financial Resources:</label>
            <input type="number" name="financialResources.count" value={formData.totalResources.financialResources.count} onChange={handleTotalResourcesChange} />
          </div>
        </div>
        <button type="submit">Allocate Resources</button>
      </form>
      {Object.keys(formData.allocatedResources).length > 0 && <ResourceChart allocatedResources={formData.allocatedResources} />}
    </div>
  );
}

export default App;
