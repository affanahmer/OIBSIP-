import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [inventory, setInventory] = useState([]);
  const [orders, setOrders] = useState([]);
  const [updateAmounts, setUpdateAmounts] = useState({});

  const fetchData = async () => {
    try {
      const invRes = await axios.get('http://localhost:5000/api/inventory');
      setInventory(invRes.data);
      const ordRes = await axios.get('http://localhost:5000/api/orders/all');
      setOrders(ordRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateStock = async (id) => {
    const amount = parseInt(updateAmounts[id] || 0);
    if (amount === 0) return;
    try {
      await axios.put(`http://localhost:5000/api/inventory/${id}`, { amount });
      setUpdateAmounts({ ...updateAmounts, [id]: '' });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await axios.put(`http://localhost:5000/api/orders/${id}/status`, { status });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Admin Dashboard</h2>
      
      <div className="card">
        <h3>Inventory Management</h3>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Category</th>
                <th>Name</th>
                <th>Stock</th>
                <th>Price</th>
                <th>Update Stock</th>
              </tr>
            </thead>
            <tbody>
              {inventory.map(item => (
                <tr key={item._id} style={{ color: item.stock <= item.threshold ? '#cf6679' : 'inherit' }}>
                  <td>{item.category}</td>
                  <td>{item.name}</td>
                  <td>{item.stock} {item.stock <= item.threshold && '(Low)'}</td>
                  <td>₹{item.price}</td>
                  <td>
                    <input 
                      type="number" 
                      style={{ width: '80px', display: 'inline', marginRight: '10px' }} 
                      value={updateAmounts[item._id] || ''} 
                      onChange={e => setUpdateAmounts({ ...updateAmounts, [item._id]: e.target.value })} 
                    />
                    <button style={{ width: 'auto' }} onClick={() => handleUpdateStock(item._id)}>Add</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card">
        <h3>Order Management</h3>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>User</th>
                <th>Amount</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order._id}>
                  <td>{order._id}</td>
                  <td>{order.userId?.email || 'N/A'}</td>
                  <td>₹{order.totalAmount}</td>
                  <td>{order.paymentStatus}</td>
                  <td>{order.orderStatus}</td>
                  <td>
                    <select 
                      value={order.orderStatus} 
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                    >
                      <option value="Order Received">Order Received</option>
                      <option value="In Kitchen">In Kitchen</option>
                      <option value="Sent to Delivery">Sent to Delivery</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
