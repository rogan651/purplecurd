import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaEdit, FaTrash } from 'react-icons/fa';
import './Style/Suppliermasterss.css';

const Suppliermaster = () => {
  const [showRegistration, setShowRegistration] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editSupplierId, setEditSupplierId] = useState(null);
  const [suppliers, setSuppliers] = useState([]);
  const [supplierData, setSupplierData] = useState({
    supplier_name: '',
    mode_of_service: '',
    address: '',
    contacts: [{ name: '', designation: '', phone: '', email: '' }]
  });

  const handleAddSupplierClick = () => {
    setShowRegistration(true);
    setIsEditing(false);
    setSupplierData({
      supplier_name: '',
      mode_of_service: '',
      address: '',
      contacts: [{ name: '', designation: '', phone: '', email: '' }]
    });
  };

  const handleBackClick = () => {
    setShowRegistration(false);
  };

  const handleAddContactClick = () => {
    setSupplierData({
      ...supplierData,
      contacts: [...supplierData.contacts, { name: '', designation: '', phone: '', email: '' }]
    });
  };

  const handleRemoveContactClick = (index) => {
    const newContacts = [...supplierData.contacts];
    newContacts.splice(index, 1);
    setSupplierData({
      ...supplierData,
      contacts: newContacts
    });
  };

  const handleChange = (index, field, value) => {
    const newContacts = [...supplierData.contacts];
    newContacts[index][field] = value;
    setSupplierData({
      ...supplierData,
      contacts: newContacts
    });
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/suppliers/');
      console.log('fetchSuppliers', response.data);
      setSuppliers(response.data);
    } catch (error) {
      console.error('Error fetching suppliers:', error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log('supplierData', supplierData);
    const payload = {
      supplier_name: supplierData.supplier_name,
      mode_of_service: supplierData.mode_of_service,
      address: supplierData.address,
    };
    try {
      const response = await axios.post('http://localhost:8000/api/create-supplier/', payload);
      console.log('Supplier registered:', response.data);
      const id = response.data.id;

      if (response.status === 201) {
        for (const contact of supplierData.contacts) {
          const contactPayload = {
            supplier: id,
            contact_name: contact.name,
            designation: contact.designation,
            phone: contact.phone,
            email: contact.email,
          };
          console.log('contactPayload', contactPayload);
          try {
            const contactResponse = await axios.post('http://localhost:8000/api/create-contactsupplier/', contactPayload);
            console.log('Contact created', contactResponse.data);
          } catch (err) {
            console.log('Error posting contact', err);
          }
        }
      }
      fetchSuppliers(); // Refresh the supplier list after adding a new supplier
      setShowRegistration(false);
    } catch (error) {
      console.error('Error registering supplier:', error);
    }
  };

  const handleEdit = (supplier) => {
    setShowRegistration(true);
    setIsEditing(true);
    setEditSupplierId(supplier.id);
    setSupplierData({
      supplier_name: supplier.supplier_name,
      mode_of_service: supplier.mode_of_service,
      address: supplier.address,
      contacts: supplier.contacts.map(contact => ({
        id: contact.id, // Include contact id for update purposes
        name: contact.contact_name,
        designation: contact.designation,
        phone: contact.phone,
        email: contact.email
      }))
    });
  };

  const handleUpdate = async (event) => {
    event.preventDefault();
    console.log('supplierData', supplierData);
    const payload = {
      supplier_name: supplierData.supplier_name,
      mode_of_service: supplierData.mode_of_service,
      address: supplierData.address,
      contacts: supplierData.contacts.map(contact => ({
        id: contact.id, // Make sure to include the id of the contact if it exists
        contact_name: contact.name,
        designation: contact.designation,
        phone: contact.phone,
        email: contact.email,
      })),
    };
    try {
      const response = await axios.put(`http://localhost:8000/api/update-supplier/${editSupplierId}/`, payload);
      console.log('Supplier updated:', response.data);

      fetchSuppliers(); // Refresh the supplier list after updating the supplier
      setShowRegistration(false);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating supplier:', error);
    }
};

const handleDeleteClick = async (supplierId) => {
  try {
    await axios.delete(`http://localhost:8000/api/delete-supplier/${supplierId}/`);
    console.log('Supplier deleted');
    fetchSuppliers(); // Refresh the supplier list
  } catch (error) {
    console.error('Error deleting supplier:', error);
  }
};


  return (
    <div className="supplier-master">
      {showRegistration ? (
        <div className="supplier-registration">
          <div className="headerss">
            <h1>{isEditing ? 'Supplier Update' : 'Supplier Registration'}</h1>
            <button onClick={handleBackClick} className="back-button">Back</button>
          </div>
          <form onSubmit={isEditing ? handleUpdate : handleSubmit}>
            <div className="form-group">
              <label>Supplier Name</label>
              <input className='form-control'
                type="text"
                placeholder="Enter supplier name"
                value={supplierData.supplier_name}
                onChange={(e) => setSupplierData({ ...supplierData, supplier_name: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Mode of Service</label>
              <select className='form-control'
                value={supplierData.mode_of_service}
                onChange={(e) => setSupplierData({ ...supplierData, mode_of_service: e.target.value })}
              >
                <option value="">select option</option>
                <option value="flight">Flight</option>
                <option value="hostel">Hostel</option>
                <option value="conference">Conference</option>
                <option value="transport">Transport</option>
                <option value="local">Local</option>
              </select>
            </div>
            <div className="form-group">
              <label>Address</label>
              <input className='form-control'
                type="text"
                placeholder="Enter address"
                value={supplierData.address}
                onChange={(e) => setSupplierData({ ...supplierData, address: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Contact Persons</label>
              {supplierData.contacts.map((contact, index) => (
                <div key={index} className="contact-row">
                  <input className='form-control'
                    type="text"
                    placeholder="Contact Name"
                    value={contact.name}
                    onChange={(e) => handleChange(index, 'name', e.target.value)}
                  />
                  <input className='form-control'
                    type="text"
                    placeholder="Designation"
                    value={contact.designation}
                    onChange={(e) => handleChange(index, 'designation', e.target.value)}
                  />
                  <input className='form-control'
                    type="text"
                    placeholder="Phone"
                    value={contact.phone}
                    onChange={(e) => handleChange(index, 'phone', e.target.value)}
                  />
                  <input className='form-control'
                    type="email"
                    placeholder="Email"
                    value={contact.email}
                    onChange={(e) => handleChange(index, 'email', e.target.value)}
                  />
                  <button type="button" onClick={() => handleRemoveContactClick(index)} className="remove-button">
                    Remove
                  </button>
                </div>
              ))}
              <button type="button" onClick={handleAddContactClick} className="add-contact-button">Add Contact</button>
            </div>
            <button type="submit" className="submit-button">{isEditing ? 'Update' : 'Submit'}</button>
          </form>
        </div>
      ) : (
        <div className="supplier-list">
          <div className="headerss">
            <h1>Supplier List</h1>
            <button onClick={handleAddSupplierClick} className="add-button">Add Supplier</button>
          </div>
          <table>
            <thead>
              <tr>
                <th>S.No</th>
                <th>Supplier Name</th>
                <th>Mode of Service</th>
                <th>Address</th>
                <th>Contact Persons</th>
                <th>Mobile No</th>
                <th>Email</th>
                <th>Designation</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {suppliers.map((supplier, index) => (
                <tr key={supplier.id}>
                  <td>{index + 1}</td>
                  <td>{supplier.supplier_name}</td>
                  <td>{supplier.mode_of_service}</td>
                  <td>{supplier.address}</td>
                  <td>
                    {supplier.contacts.map((contact, contactIndex) => (
                      <div key={contactIndex}>
                        {contact.contact_name}
                      </div>
                    ))}
                  </td>
                  <td>
                    {supplier.contacts.map((contact, contactIndex) => (
                      <div key={contactIndex}>
                        {contact.phone}
                      </div>
                    ))}
                  </td>
                  <td>
                    {supplier.contacts.map((contact, contactIndex) => (
                      <div key={contactIndex}>
                        {contact.email}
                      </div>
                    ))}
                  </td>
                  <td>
                    {supplier.contacts.map((contact, contactIndex) => (
                      <div key={contactIndex}>
                        {contact.designation}
                      </div>
                    ))}
                  </td>
                  {/* <td>
                    <button className="edit-button" onClick={() => handleEdit(supplier)}>Edit</button>
                    <button className="delete-button" onClick={() => handleDeleteClick(supplier.id)}>Delete</button>
                  </td> */}
                  <td className="button-container">
                    <button className="edit-button" onClick={() => handleEdit(supplier)}><FaEdit /></button>
                    <button className="delete-button" onClick={() => handleDeleteClick(supplier.id)}><FaTrash /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Suppliermaster;
