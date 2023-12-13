import React, { useState, useEffect } from 'react'
import datae from "./datae.json";
import datam from "./datam.json";
import { Dropdown } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const Equipment = () => {
  const [modalData, setModalData] = useState([]);
  const [selectedEquipment, setSelectedEquipment] = useState('');

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);


  const handleModelData = (eup) => {
    console.log(eup)
    const model = datam.data.filter((item) => item.sparesEquipmentId === eup.sparesEquipmentId);
    setModalData(model)
  }
  console.log(datae);
  console.log(selectedEquipment)

  useEffect(()=>{
    const fetchData = async () =>{
      try{
        const response=await fetch('https://mocki.io/v1/d4867d8b-b5d5-4a48-a4ab-79131b5809b8');
        const result=await response.json();
        setData(result);
        setLoading(false);
      }
      catch(error){
        console.error('error fetching data:',error);
        setLoading(false);
      }
    }
    fetchData();

  },[]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!data) {
    return <p>Error fetching data</p>;
  }

  // Extract the values you want to display in the dropdown
  const dropdownOptions = data.map(item => item.name);


  return (
    <div className='container mt-5' >
      <div className='row'>
        <div className='col-6'>
          {/* <Dropdown>
      <Dropdown.Toggle variant="success" id="dropdown-basic" placeholder='select Equipment'>
        Equipment Dropdown
      </Dropdown.Toggle>
      <Dropdown.Menu>
          {
              datae.data.map((item)=>(
                  <>
                        <Dropdown.Item onClick={()=>handleModelData(item)} key={item.branchId}>{item.equipmentName}</Dropdown.Item>
                  </>
              ))
          }       
      </Dropdown.Menu>
    </Dropdown> */}
          <select
            className="form-select form-select-sm"
            style={{ backgroundColor: "#e0ebeb" }}
            aria-label=".form-select-sm example"
            value={selectedEquipment}
            onChange={(e) => {
              setSelectedEquipment(e.target.value);
              handleModelData(datae.data.find(item => item.equipmentName === e.target.value));
            }}
          >
            <option value="" disabled hidden>Select...</option>
            {
              datae.data.map((item) => (
                <option key={item.branchId}>{item.equipmentName}</option>
              ))
            }
            
          </select>
        </div>

        <div className='col-6'>
          {/* <Dropdown>
      <Dropdown.Toggle variant="secondary" id="dropdown-basic">
        Modal Dropdown
      </Dropdown.Toggle>
      <Dropdown.Menu>
          {
              modalData.map((item, index)=>(
                  <>
                      <Dropdown.Item onClick={() => console.log(item)} key={index}>{item.modelType}</Dropdown.Item>
                  </>
              ))
          }
       
      </Dropdown.Menu>
    </Dropdown> */}


          <select className="form-select form-select-sm" style={{ backgroundColor: "#e0ebeb" }} aria-label=".form-select-sm example">
            {
              modalData.map((item, index) => (
                <option key={index}>{item.modelType}</option>
              ))
            }
          </select>
        </div>
      </div>

    </div>
  )
}

export default Equipment
