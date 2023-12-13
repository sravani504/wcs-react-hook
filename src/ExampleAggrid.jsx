import React, { useState, useEffect, useMemo } from 'react'
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import {faTrash} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '@fortawesome/fontawesome-svg-core/styles.css';
import { AgGridReact } from 'ag-grid-react';
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import './style.css'


const ExampleAggrid = () => {
    const [rowData, setRowData] = useState([]);
    const [selectedUser, setSelectedUser] = useState('');
    const [selectedStreet,setSelectedStreet]=useState('');

    const [newRecord, setNewRecord] = useState({
        id:0,
        username: '',
        email: '',
       name:{ 
        firstname: '',
        lastname: ''
            },
        address:{
            street: '',
            city: '',
            zipcode: ''
        } ,   
       
        phone: ''
    })

console.log('rowdata:',rowData)
    useEffect(() => {
        const extractUserData = async () => {
            try {
                const response = await fetch('https://fakestoreapi.com/users');
                const result = await response.json();
                setRowData(result);
            }
            catch (error) {
                console.error('fetching data', error)
            }

        }
        extractUserData();
    }, [])


    const defaultColDef = useMemo(() => ({
        filter: true,
    }));

    const paginationPageSize = 5;

    const handleSearch = (selectedStreet) => {
        const filteredData = selectedStreet
          ? rowData.filter((user) => user.address && user.address.street === selectedStreet)
          : rowData;
        setRowData(filteredData);
      };


    const handleAddButtonClick = () => {
        if (!newRecord.username || !newRecord.email) {
            alert('Please fill in all required fields.');
            return;
        }
        const existingIndex = rowData.findIndex((user) => user.id === newRecord.id);

        if (existingIndex !== -1) {
            // Update existing row
            const updatedData = [...rowData];
            updatedData[existingIndex] = { ...newRecord };
            setRowData(updatedData);
        } else {
            // Add new row
            const nextId = rowData.length > 0 ? Math.max(...rowData.map((user) => user.id)) + 1 : 1;
            const newRecordWithId = { ...newRecord, id: nextId };
            setRowData([...rowData, newRecordWithId]);
        }
        setSelectedStreet('');
    
      
// setRowData([...rowData, newRecord]);       
        setNewRecord({
            id:0,
            username: '',
            email: '',
           name:{ 
            firstname: '',
            lastname: ''
                },
            address:{
                street: '',
                city: '',
                zipcode: ''
            } ,   
           
            phone: ''
        })
    };
    // Edit functinality
    const editButtonRenderer = ({ data }) => {
        console.log(data)
        return (
            <FontAwesomeIcon
                icon={faEdit}
                className="edit-icon"
                onClick={() => handleEditButtonClick(data)}
            />
        );
    };
    

    const handleEditButtonClick = (rowData) => {
        console.log(rowData)
        setNewRecord({
            id:rowData.id,
            username:rowData.username,
            email:rowData.email,
            name:{...rowData.name},
            address:{...rowData.address},
            phone:rowData.phone
        })
        console.log('Edit button clicked for row:', rowData);
        // You can open a modal or perform any other action here
    };


    //delete functionality

    const deleteButtonRenderer = ({data})=>{
        console.log(data)
        return(
            <FontAwesomeIcon 
              icon={faTrash}
              className='delete-icon'
              onClick={()=>handleDeleteButton(data)}
            />
        )
        } 
    
        const handleDeleteButton = (rowToDelete) => {
            const updatedData = rowData.filter((user) => user.id !== rowToDelete.id);
            setRowData(updatedData);
        };

    const colDefsWithEditButton = [
        { headerName: 'ID', field: 'id' },
        { headerName: 'Username', field: 'username' },
        { headerName: 'Email', field: 'email' },
        { headerName: 'FirstName', field: 'name.firstname' },
        { headerName: 'LastName', field: 'name.lastname' },
        { headerName: 'Street', field: 'address.street' },
        { headerName: 'City', field: 'address.city' },
        { headerName: 'Zipcode', field: 'address.zipcode' },
        { headerName: 'Phone', field: 'phone' },
        {
            headerName: 'Edit',
            cellRenderer: editButtonRenderer,
            // cellRendererFramework: EditButtonRenderer,
            sortable: false,
            filter: false,
            width: 60,
        },
        {
            headerName:'Delete',
            cellRenderer:deleteButtonRenderer,
            sortable:false,
            filter:false,
            width:80
        }
    ];
    
  

    return (
        <div >
            <div className=' row d-flex justify-content-around mt-4'>
                <div className='col-4'>
                    <select
                        className="form-select form-select-sm"
                        style={{ backgroundColor: "#e0ebeb" }}
                        aria-label=".form-select-sm example"
                        value={selectedUser}
                       onChange={(e) => {
              setSelectedStreet(e.target.value);
              handleSearch(e.target.value);
            }}
                    >
                        <option value="" disabled hidden>Select...</option>
                        {rowData.map((option, index) => (
                            <option key={index} value={option.address?.street} >
                                {option.address?.street}
                            </option>
                        ))}
                    </select>
                </div>
                

                <div className='col-1'>
                    <button type='button' className='btn btn-success' onClick={handleAddButtonClick}>Add...</button>
                </div>
              

            </div>
            <div className='row d-flex justify-content-between '> 
                <div className='col-3'>
                    <input
                        type='text'
                        className='form-control '
                        placeholder='Username'
                        value={newRecord.username}
                        onChange={(e) => setNewRecord({ ...newRecord, username: e.target.value })}
                    />
                    </div>
                    <div className='col-3'>
                    <input
                        type='text'
                        className='form-control mt-2 col-3'
                        placeholder='Email'
                        value={newRecord.email}
                        onChange={(e) => setNewRecord({ ...newRecord, email: e.target.value })}
                    />
                    </div>
                   <div className='col-3'>
                    <input
                        type='text'
                        className='form-control mt-2 col-3'
                        placeholder='First Name'
                        value={newRecord.name.firstname}
                        onChange={(e) => setNewRecord({ ...newRecord, name:{...newRecord.name,firstname:e.target.value} })}
                    />
                    </div> 
                    <div className='col-3'>
                    <input
                        type='text'
                        className='form-control mt-2 col-3'
                        placeholder='Last Name'
                        value={newRecord.name.lastname}
                        onChange={(e) => setNewRecord({ ...newRecord, name:{...newRecord.name,lastname:e.target.value} })}
                    />
                    </div>
                    <div className='col-3'>                  
                    <input
                        type='text'
                        className='form-control mt-2 col-3'
                        placeholder='Street'
                        value={newRecord.address.street}
                        onChange={(e) => setNewRecord({ ...newRecord,address:{...newRecord.address,street:e.target.value} })}
                    />
                    </div>
                    <div className='col-3'>
                    <input
                        type='text'
                        className='form-control mt-2 col-3'
                        placeholder='City'
                        value={newRecord.address.city}
                        onChange={(e) => setNewRecord({ ...newRecord,address:{...newRecord.address,city:e.target.value} })}
                    />
                    </div>
                    <div className='col-3'>
                    <input
                        type='text'
                        className='form-control mt-2 col-3'
                        placeholder='Zipcode'
                        value={newRecord.address.zipcode}
                        onChange={(e) => setNewRecord({ ...newRecord,address:{...newRecord.address,zipcode:e.target.value} })}
                    />
                    </div>
                    <div className='col-3'>
                    <input
                        type='number'
                        className='form-control mt-2 col-3'
                        placeholder='Phone'
                        value={newRecord.phone}
                        onChange={(e) => setNewRecord({ ...newRecord, phone: e.target.value })}
                    />
                    </div>
                  
                </div>
            <div
                className="ag-theme-quartz mt-4" style={{ width: '100%', height: '85vh' }} >
                    <AgGridReact
                        rowData={rowData}
                        columnDefs={colDefsWithEditButton}
                        defaultColDef={defaultColDef}
                        pagination={true}
                        frameworkComponents={{
                            editButtonRenderer: editButtonRenderer,
                            deleteButtonRenderer: deleteButtonRenderer,
                        }}

                    />
                        </div>
        </div>

    )
}

export default ExampleAggrid;
