import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const Post = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [modalData, setModalData] = useState([]);


  const handleModelData = (value) => {
    console.log(value);
    const model = data.filter((item) => item.userId !== Number(value ));
    setModalData(model);
    console.log(model)
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts');
        const result = await response.json();
        setData(result);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!data) {
    return <p>Error fetching data</p>;
  }

  // Extract the values you want to display in the dropdown
  const dropdownOptions = [...new Set(data.map((item) => item.userId))];

  return (
    
    <div className='container mt-5'>

      <div className='row'>
        <div className='col-6'>
          <select
            className="form-select form-select-sm"
            style={{ backgroundColor: "#e0ebeb" }}
            aria-label=".form-select-sm example"
            value={selectedUserId}
            onChange={(e) => {
              setSelectedUserId(e.target.value);
              handleModelData(e.target.value);
            }}
          >
            <option value="" disabled hidden>Select...</option>
            {dropdownOptions.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div className='col-6'>
          <select className="form-select form-select-sm" style={{ backgroundColor: "#e0ebeb" }} aria-label=".form-select-sm example">
            {modalData.map((item, index) => (
              <option key={index}>{item.userId}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default Post;