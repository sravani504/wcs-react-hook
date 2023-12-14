import React,{useEffect} from 'react';
import { Formik, Form, Field, ErrorMessage,FormikProvider} from 'formik';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const SampleData = ({ setRowData, editedData, rowData }) => {
  console.log(editedData, "editedData")

  const initialValues = {
    jobOpeningDate: editedData.jobOpeningDate || '',
    title: editedData.title || '',
    fname: editedData.fname || '',
    lname: editedData.lname || '',
    mnumber: editedData.mnumber || '',
    mnumberAlt: editedData.mnumberAlt || '',
    emailPrimary: editedData.emailPrimary || '',
    emailAlt: editedData.emailAlt || '',
    currentLocation: editedData.currentLocation || '',
    preferredLocation: editedData.preferredLocation || '',
    dob: editedData.dob || '',
    totalExperience: editedData.totalExperience || '',
    relevantExperience: editedData.relevantExperience || '',
  };


  const validationSchema = Yup.object({
    jobOpeningDate: Yup.date().required('Please select a job opening date'),
    title: Yup.string().required('Title is required'),
    fname: Yup.string().required('First Name is required'),
    lname: Yup.string().required('Last Name is required'),
    mnumber: Yup.string()
      .matches(/^[0-9]+$/, 'Mobile number should only contain digits')
      .matches(/^[6789]\d{9}$/, 'Invalid mobile number')
      .required('Mobile No.(Primary) is required'),
    mnumberAlt: Yup.string()
      .matches(/^[0-9]*$/, 'Alternate mobile number should only contain digits')
      .matches(/^[6789]\d{9}$/, 'Invalid alternate mobile number'),
    emailPrimary: Yup.string().email('Invalid email address').required('Email(Primary) is required'),
    emailAlt: Yup.string()
      .email('Invalid email address')
      .notOneOf([Yup.ref('emailPrimary')], 'Email (Alt) should be different from Email (Primary)')
      .nullable(),

    currentLocation: Yup.string().required('Current Location is required'),
    preferredLocation: Yup.string().required('Preferred Location is required'),
    dob: Yup.date()
      .required('Date of Birth is required')
      .test('valid-date', 'Invalid Date of Birth', function (value) {
        const currentDate = new Date();
        const selectedDate = new Date(value);

        if (selectedDate.toDateString() === currentDate.toDateString()) {
          return false;
        }
        const minDate = new Date('1923-01-01');
        if (selectedDate < minDate) {
          return false;
        }
        return selectedDate <= currentDate; 
      }), 

    totalExperience: Yup.number()
      .required('Total Experience is required')
      .max(10, 'Maximum 10 years'),

    relevantExperience: Yup.number()
      .required('Relevant Experience is required')
      .max(10, 'Maximum 10 years')
      .test(
        'is-greater-than-total-experience',
        'Relevant Experience should be less than Total Experience',
        function (value) {
          const totalExperience = this.parent.totalExperience;
          return value <= totalExperience;
        }
      ),
  });

  const generateDates = () => {
    const currentDate = new Date();
    const dates = [];

    for (let i = 0; i < 30; i++) {
      const nextDate = new Date(currentDate);
      nextDate.setDate(currentDate.getDate() + i);
      dates.push(nextDate.toISOString().split('T')[0]);
    }

    return dates;
  };



const onSubmit = (values,{resetForm}) => {
  console.log('Form submitted with values:', values);
  console.log("rowData", rowData);
  console.log("editdeds", editedData);

  setTimeout(() => {
    console.log('Form submitted with values:', values);
    const index = rowData.findIndex((row) => row === editedData);
    console.log("indexx", index);

    if (index > -1) {
      // Editing
      setRowData((prevData) => {
        const newData = [...prevData];
        newData[index] = values;
        return newData;
      });

      toast.success('Form Edited successfully!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      // Reset the form after editing
      resetForm();
    } else {
      // Creating
      const isDuplicateValues = rowData.filter((row) => row.emailPrimary === values.emailPrimary);
      console.log(isDuplicateValues);

      if (isDuplicateValues?.length > 0) {
        toast.error("Duplicate email, please use a different email", {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } else {
        // Add
        setRowData((prevData) => [...prevData, values]);
        toast.success('Form submitted successfully!', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });

        // Reset the form after creating
      resetForm();
      }
    }
  }, 500);
};

  return (
    <div>
      <div>
        <nav className="navbar navbar-expand-sm bg-danger" style={{ height: '60px' }}>
          <div className="container-fluid"></div>
        </nav>
      </div>

      <div className=' p-4'>
        <div className="card mt-4" style={{ width: '90rem', height: '48rem' }}>
          <div className="card-body border">
            <h5 className="card-title border-bottom p-2">Add</h5>
            <div className="row">
              <div className='bg-light'>
                <FormikProvider>
                <Formik
                  initialValues={initialValues}
                  validationSchema={validationSchema}
                  onSubmit={onSubmit}
                                   
                >
                  <Form >
                    <div className="mb-3 col-6">
                      <label htmlFor="jobOpeningDate" className="form-label">
                        Job Opening<span style={{ color: 'red' }}>*</span>
                      </label>
                      <Field
                        as="select"
                        id="jobOpeningDate"
                        name="jobOpeningDate"
                        className="form-select"

                      >
                        <option value="" label="Select a date" />
                        {generateDates().map((date) => (
                          <option key={date} value={date}>
                            {new Date(date).toLocaleDateString('en-US', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </option>   
                        ))}   
                      </Field>
                      <ErrorMessage name="jobOpeningDate" component="div" className="text-danger" />
                    </div>
                    <div className='row'>
                      <div className="mb-3 col-1 mr-0">
                        <label htmlFor="title" className="form-label">
                          Title<span style={{ color: 'red' }}>*</span>
                        </label>
                        <Field as="select" id="title" name="title" className="form-select">
                          <option value="" label="Select a title" />
                          <option value="Mr">Mr</option>
                          <option value="Ms">Ms</option>
                          <option value="Mrs">Mrs</option>
                        </Field>
                        <ErrorMessage name="title" component="div" className="text-danger" />
                      </div>

                      <div className="mb-3 col-5 ">
                        <label htmlFor="fname" className="form-label">
                          First Name<span style={{ color: 'red' }}>*</span>
                        </label>
                        <Field type="text" id="fname" name="fname" className="form-control"
  
                        />
                        <ErrorMessage name="fname" component="div" className="text-danger" />
                      </div>

                      <div className="mb-3 col-5">
                        <label htmlFor="lname" className="form-label">
                          Last Name<span style={{ color: 'red' }}>*</span>
                        </label>
                        <Field type="text" id="lname" name="lname" className="form-control" />
                        <ErrorMessage name="lname" component="div" className="text-danger" />
                      </div>
                    </div>
                    
                    <div className='row '>
                      <div className="mb-3 col-6">
                        <label htmlFor="mnumber" className="form-label">
                          Mobile No.(Primary)<span style={{ color: 'red' }}>*</span>
                        </label>
                        <Field type="text" id="mnumber" name="mnumber" className="form-control" />
                        <ErrorMessage name="mnumber" component="div" className="text-danger" />
                      </div>

                      <div className="mb-3 col-6">
                        <label htmlFor="mnumberAlt" className="form-label">
                          Mobile No.(alt)<span style={{ color: 'red' }}>*</span>
                        </label>
                        <Field type="text" id="mnumberAlt" name="mnumberAlt" className="form-control" />
                        <ErrorMessage name="mnumberAlt" component="div" className="text-danger" />
                      </div>

                    </div>

                    <div className='row'>
                      <div className="mb-3 col-6">
                        <label htmlFor="emailPrimary" className="form-label">
                          Email(Primary)<span style={{ color: 'red' }}>*</span>
                        </label>
                        <Field type="text" id="emailPrimary" name="emailPrimary" className="form-control" />
                        <ErrorMessage name="emailPrimary" component="div" className="text-danger" />
                      </div>

                      <div className="mb-3 col-5">
                        <label htmlFor="emailAlt" className="form-label">
                          Email(Alt)
                        </label>
                        <Field type="text" id="emailAlt" name="emailAlt" className="form-control" />
                        <ErrorMessage name="emailAlt" component="div" className="text-danger" />
                      </div>
                    </div>
                    <div className='row'>
                      <div className="mb-3 col-6">
                        <label htmlFor="currentLocation" className="form-label">
                          Current Location<span style={{ color: 'red' }}>*</span>
                        </label>
                        <Field type="text" id="currentLocation" name="currentLocation" className="form-control" />
                        <ErrorMessage name="currentLocation" component="div" className="text-danger" />
                      </div>

                      <div className="mb-3 col-5">
                        <label htmlFor="preferredLocation" className="form-label">
                          Preferred Location<span style={{ color: 'red' }}>*</span>
                        </label>
                        <Field type="text" id="preferredLocation" name="preferredLocation" className="form-control" />
                        <ErrorMessage name="preferredLocation" component="div" className="text-danger" />
                      </div>
                    </div>

                    <div className="mb-3 col-6 ">
                      <label htmlFor="dob" className="form-label">
                        Date of Birth
                      </label>
                      <Field type="date" id="dob" name="dob" className="form-control" />
                      <ErrorMessage name="dob" component="div" className="text-danger" />
                    </div>
                    <div className='row'>
                      <div className="mb-3 col-6">
                        <label htmlFor="totalExperience" className="form-label">
                          Total Experience<span style={{ color: 'red' }}>*</span>
                        </label>
                        <Field as="select" id="totalExperience" name="totalExperience" className="form-select">
                          <option value="" label="Select total experience" />
                          {[...Array(11).keys()].map((num) => (
                            <option key={num} value={num}>
                              {num} years
                            </option>
                          ))}
                        </Field>
                        <ErrorMessage name="totalExperience" component="div" className="text-danger" />
                      </div>

                      <div className="mb-3 col-5">
                        <label htmlFor="relevantExperience" className="form-label">
                          Relevant Experience<span style={{ color: 'red' }}>*</span>
                        </label>
                        <Field as="select" id="relevantExperience" name="relevantExperience" className="form-select">
                          <option value="" label="Select relevant experience" />
                          {[...Array(11).keys()].map((num) => (
                            <option key={num} value={num}>
                              {num} years
                            </option>
                          ))}
                        </Field>
                        <ErrorMessage name="relevantExperience" component="div" className="text-danger" />
                      </div>
                    </div>

                    <button type="submit" className="btn btn-primary m-4">
                      Submit
                    </button>

                    <Link to="/dashboard" className="btn btn-danger">
                      Go to Dashboard
                    </Link>
                  </Form>
                </Formik>
                </FormikProvider>
                <ToastContainer />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SampleData;