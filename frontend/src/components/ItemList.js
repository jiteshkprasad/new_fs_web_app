import React, { useState, useEffect } from 'react';

function ItemList() {
  const [apiResponse, setApiResponse] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5000/api/items')
      .then(response => response.json())
      .then(data => setApiResponse(data))
      .catch(error => {
        console.error('Error:', error);
        setError('Failed to fetch items');
      });
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!apiResponse) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>API Response</h2>
      <pre>{JSON.stringify(apiResponse, null, 2)}</pre>
    </div>
  );
}

export default ItemList;