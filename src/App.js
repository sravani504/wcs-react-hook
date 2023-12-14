import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SampleData from './SampleForm';
import Post from './Post';
import Dashboard from './Dashboard';
import ExampleAggrid from './ExampleAggrid';
import FormHook from './FormHook';
import './App.css';

function App() {

  const initialRowData = JSON.parse(localStorage.getItem('tableData')) || [];
  console.log(initialRowData);
  
  const [rowData,setRowData]=useState(initialRowData);
  const [editData,setEditData]=useState({});
  const [items, setItems] = useState([]);

  const [newRecord, setNewRecord] = useState({
    jobOpeningDate: '',
    title:'',
    fname:'',
    lname:'',
    mnumber:'',
    mnumberAlt:'',
    emailPrimary:'',
    emailAlt:'',
    currentLocation:'',
    preferredLocation:'',
    dob:'',
    totalExperience:'',
    relevantExperience:''
})

const editdataa = (e)=>
{
console.log(e,"-----------------")
setEditData(e)
}



  return (
    <div className='App'>
    <Router>
      <Routes>
        <Route path="/" element={<SampleData rowData={rowData} setRowData={setRowData} newRecord={newRecord} setNewRecord={setNewRecord} editedData={editData}    />} />
        <Route path='/dashboard' element={<Dashboard  items={items} setItems={setItems}  rowData={rowData} editdataa={editdataa} setRowData={setRowData} newRecord={newRecord} setNewRecord={setNewRecord}  setEditData={setEditData} />} />
        <Route path="/dropdownItem" element={<Post  />} />
        <Route path="/ag-grid" element={<ExampleAggrid />} />
        <Route path='/formhook' element={<FormHook items={items} setItems={setItems} rowData={rowData} setRowData={setRowData} newRecord={newRecord} setNewRecord={setNewRecord} editedData={editData} editdataa={editdataa}/>}/>

      </Routes>
    </Router>
    </div>
  );
}

export default App;