import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEdit, FaTrash } from 'react-icons/fa';
import './Style/Customermasterss.css'; 

const Customermaster = () => {
  const [showRegistration, setShowRegistration] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editCustomerId, setEditCustomerId] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [customerData, setCustomerData] = useState({
    customer_name: '',
    gst_no: '',
    address: '',
    contacts: [{ name: '', designation: '', phone: '', email: '' }]
  });

  const handleAddCustomerClick = () => {
    setShowRegistration(true);
    setIsEditing(false);
    setCustomerData({
      customer_name: '',
      gst_no: '',
      address: '',
      contacts: [{ name: '', designation: '', phone: '', email: '' }]
    });
  };

  const handleBackClick = () => {
    setShowRegistration(false);
  };

  const handleAddContactClick = () => {
    setCustomerData({
      ...customerData,
      contacts: [...customerData.contacts, { name: '', designation: '', phone: '', email: '' }]
    });
  };

  const handleRemoveContactClick = (index) => {
    const newContacts = [...customerData.contacts];
    newContacts.splice(index, 1);
    setCustomerData({
      ...customerData,
      contacts: newContacts
    });
  };

  const handleChange = (index, field, value) => {
    const newContacts = [...customerData.contacts];
    newContacts[index][field] = value;
    setCustomerData({
      ...customerData,
      contacts: newContacts
    });
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/customers/');
      setCustomers(response.data);
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const payload = {
      customer_name: customerData.customer_name,
      gst_no: customerData.gst_no,
      address: customerData.address,
    };
    try {
      const response = await axios.post('http://localhost:8000/api/create-customer/', payload);
      const id = response.data.id;

      if (response.status === 201) {
        for (const contact of customerData.contacts) {
          const contactPayload = {
            customer: id,
            contact_name: contact.name,
            designation: contact.designation,
            phone: contact.phone,
            email: contact.email,
          };
          try {
            await axios.post('http://localhost:8000/api/create-contactcustomer/', contactPayload);
          } catch (err) {
            console.error('Error posting contact', err);
          }
        }
      }
      fetchCustomers(); 
      setShowRegistration(false);
    } catch (error) {
      console.error('Error registering customer:', error);
    }
  };

  const handleEdit = (customer) => {
    setShowRegistration(true);
    setIsEditing(true);
    setEditCustomerId(customer.id);
    setCustomerData({
      customer_name: customer.customer_name,
      gst_no: customer.gst_no,
      address: customer.address,
      contacts: customer.contacts.map(contact => ({
        name: contact.contact_name,
        designation: contact.designation,
        phone: contact.phone,
        email: contact.email
      }))
    });
  };

  const handleUpdate = async (event) => {
    event.preventDefault();
    const payload = {
      customer_name: customerData.customer_name,
      gst_no: customerData.gst_no,
      address: customerData.address,
      contacts: customerData.contacts.map(contact => ({
        contact_name: contact.name,
        designation: contact.designation,
        phone: contact.phone,
        email: contact.email,
      })),
    };
    try {
      await axios.put(`http://localhost:8000/api/update-customer/${editCustomerId}/`, payload);
      fetchCustomers(); // Refresh the customer list after updating the customer
      setShowRegistration(false);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating customer:', error);
    }
  };
  const handleDelete = async (customerId) => {
    try {
      await axios.delete(`http://localhost:8000/api/delete-customer/${customerId}/`);
      fetchCustomers(); 
    } catch (error) {
      console.error('Error deleting customer:', error);
    }
  };

  return (
    <div className="customer-master">
      {showRegistration ? (
        <div className="customer-registration">
          <div className="headersss">
            <h1>{isEditing ? 'Customer Update' : 'Customer Registration'}</h1>
            <button onClick={handleBackClick} className="back-button">Back</button>
          </div>
          <form onSubmit={isEditing ? handleUpdate : handleSubmit}>
            <div className="form-group">
              <label>Customer Name</label>
              <input className='form-control'
                type="text"
                placeholder="Enter customer name"
                value={customerData.customer_name}
                onChange={(e) => setCustomerData({ ...customerData, customer_name: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>GST No</label>
              <input className='form-control'
                type="text"
                placeholder="Enter GST number"
                value={customerData.gst_no}
                onChange={(e) => setCustomerData({ ...customerData, gst_no: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Address</label>
              <input className='form-control'type="text"placeholder="Enter address"value={customerData.address} onChange={(e) => setCustomerData({ ...customerData, address: e.target.value })}/>
            </div>
            <div className="form-group">
              <label>Contact Persons</label>
              {customerData.contacts.map((contact, index) => (
                <div key={index} className="contact-row">
                  <input className='form-control'type="text"placeholder="Contact Name"value={contact.name}onChange={(e) => handleChange(index, 'name', e.target.value)}/>
                  <input className='form-control'type="text" placeholder="Designation" value={contact.designation} onChange={(e) => handleChange(index, 'designation', e.target.value)}/>
                  <input className='form-control'type="text" placeholder="Phone" value={contact.phone} onChange={(e) => handleChange(index, 'phone', e.target.value)}/>
                  <input className='form-control'type="email" placeholder="Email" value={contact.email} onChange={(e) => handleChange(index, 'email', e.target.value)}/>
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
        <div className="customer-list">
          <div className="headersss">
            <h1>Customer List</h1>
            <button onClick={handleAddCustomerClick} className="add-button">Add Customer</button>
          </div>
          <table>
            <thead>
              <tr>
                <th>S.No</th>
                <th>Customer Name</th>
                <th>GST No</th>
                <th>Address</th>
                <th>Contact Persons</th>
                <th>Phone</th>
                <th>Email</th>
                <th>Designation</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer, index) => (
                <tr key={customer.id}>
                  <td>{index + 1}</td>
                  <td>{customer.customer_name}</td>
                  <td>{customer.gst_no}</td>
                  <td>{customer.address}</td>
                  <td>
                    {customer.contacts.map((contact, contactIndex) => (
                      <div key={contactIndex}>
                        {contact.contact_name}
                      </div>
                    ))}
                  </td>
                  <td>
                    {customer.contacts.map((contact, contactIndex) => (
                      <div key={contactIndex}>
                        {contact.phone}
                      </div>
                    ))}
                  </td>
                  <td>
                    {customer.contacts.map((contact, contactIndex) => (
                      <div key={contactIndex}>
                        {contact.email}
                      </div>
                    ))}
                  </td>
                  <td>
                    {customer.contacts.map((contact, contactIndex) => (
                      <div key={contactIndex}>
                        {contact.designation}
                      </div>
                    ))}
                  </td>
                  <td className="button-container">
                    <button className="edit-button" onClick={() => handleEdit(customer)}><FaEdit /></button>
                    <button className="delete-button" onClick={() => handleDelete(customer.id)}><FaTrash /></button>
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

export default Customermaster;