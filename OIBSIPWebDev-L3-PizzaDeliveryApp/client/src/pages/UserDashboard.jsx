import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const UserDashboard = () => {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/orders/my-orders');
      setOrders(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Welcome to PizzaApp</h2>
        <Link to="/build-pizza"><button style={{ width: 'auto' }}>Build Custom Pizza</button></Link>
      </div>

      <h3>Your Active Orders</h3>
      {orders.length === 0 ? <p>No orders yet.</p> : (
        <div className="grid">
          {orders.map(order => (
            <div key={order._id} className="card">
              <p><strong>Order ID:</strong> {order._id}</p>
              <p><strong>Total Amount:</strong> ₹{order.totalAmount}</p>
              <p><strong>Status:</strong> <span style={{ color: '#bb86fc' }}>{order.orderStatus}</span></p>
              
              <div className="stepper">
                <div className={`step ${order.orderStatus === 'Order Received' || order.orderStatus === 'In Kitchen' || order.orderStatus === 'Sent to Delivery' ? 'active' : ''}`}>Received</div>
                <div className={`step ${order.orderStatus === 'In Kitchen' || order.orderStatus === 'Sent to Delivery' ? 'active' : ''}`}>Kitchen</div>
                <div className={`step ${order.orderStatus === 'Sent to Delivery' ? 'active' : ''}`}>Delivery</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
