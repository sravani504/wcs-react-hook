import React, { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import {faTrash} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '@fortawesome/fontawesome-svg-core/styles.css';
import { AgGridReact } from 'ag-grid-react';
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";  
import 'ag-grid-enterprise';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import 'bootstrap/dist/js/bootstrap.bundle.min.js';





const Dashboard = ({ rowData, setRowData,newRecord,setNewRecord,setEditData ,editdataa,items,setItems}) => {
    const [gridApi, setGridApi] = useState(null);
    const [gridColumnApi, setGridColumnApi] = useState(null);
    
    const [quickFilterText, setQuickFilterText] = useState('');


    useEffect(() => {
        const storedItems = JSON.parse(localStorage.getItem('items')) || [];
        setItems(storedItems);
    }, []);
     
    useEffect(() => {
        if (gridApi) {
          gridApi.setQuickFilter(quickFilterText);
        }
      }, [quickFilterText, gridApi]);
    
      const onGridReady = (params) => {
        setGridApi(params.api);
        setGridColumnApi(params.columnApi);
      };

      const exportToExcel = () => {
        const exportParams = {
          processRowGroupCallback: (params) => {
            return params.node.group
              ? true
              : params.data[params.column.getId()]
                  .toString()
                  .toLowerCase()
                  .includes(quickFilterText.toLowerCase());
          },
        };
    
        gridApi.exportDataAsExcel(exportParams);
      };





      

const navigate=useNavigate();

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
        // editdataa(rowData)
        setEditData(rowData)
        setNewRecord({
            jobOpeningDate:rowData.jobOpeningDate,
            title:rowData.title,
            fname:rowData.fname,
            lname:rowData.lname,
            mnumber:rowData.mnumber,
            mnumberAlt:rowData.mnumberAlt,
            emailPrimary:rowData.emailPrimary,
            emailAlt:rowData.emailAlt,
            currentLocation:rowData.currentLocation,
            preferredLocation:rowData.preferredLocation,
            dob:rowData.dob,
            totalExperience:rowData.totalExperience,
            relevantExperience:rowData.relevantExperience
        
        })
        console.log('Edit button clicked for row:', rowData);

        navigate('/formhook');
    };

    const handleDeleteButtonClick = (rowToDelete) => {
        const updatedData = rowData.filter((user) => user.id !== rowToDelete.id);
        setRowData(updatedData);
        navigate('/')
    };

    const deleteButtonRenderer = ({ data }) => {
        console.log(data)
        return (
            <FontAwesomeIcon
                icon={faTrash}
                className="edit-icon"
                onClick={() => handleDeleteButtonClick(data)}
            />
        );
    };

    const colDefsWithEditButton = [
        { headerName: 'Job Opening', field: 'jobOpeningDate' },
        { headerName: 'Title', field: 'title' },
        { headerName: 'FirstName', field: 'fname' },
        { headerName: 'LastName', field: 'lname' },
        { headerName: 'Mobile No.(Primary)', field: 'mnumber' },
        { headerName: 'Mobile No.(Alt)', field: 'mnumberAlt' },
        { headerName: 'Email(Primary)', field: 'emailPrimary' },
        { headerName: 'Email(Alt)', field: 'emailAlt' },
        { headerName: 'Current Location', field: 'currentLocation' },
        { headerName: 'Preferred Location', field: 'preferredLocation' },
        { headerName: 'Date of Birth', field: 'dob' },
        { headerName: 'Total Experience', field: 'totalExperience' },
        { headerName: 'Relevant Experience', field: 'relevantExperience' },

        
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
    <div>
<div className=" d-flex justify-content-end m-2 ">
      <button type="button" className="btn btn-success">Export to excel</button>
    </div>         <div
                className="ag-theme-quartz mt-4" style={{ width: '100%', height: '85vh' }} >
                    <AgGridReact
                        rowData={rowData}
                        columnDefs={colDefsWithEditButton}
                        // defaultColDef={defaultColDef}
                        pagination={true}
                        onGridReady={onGridReady}
                        floatingFilter={true}
     
                        frameworkComponents={{
                            editButtonRenderer: editButtonRenderer,
                            deleteButtonRenderer: deleteButtonRenderer,
                        }}
                    />
                        </div>
    </div>
  )
}

export default Dashboard
