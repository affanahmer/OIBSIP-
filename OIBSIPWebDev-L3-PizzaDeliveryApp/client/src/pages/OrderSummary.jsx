import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const OrderSummary = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  
  const { customPizza, totalAmount } = location.state || {};

  if (!customPizza) {
    return <div className="card">No order data found.</div>;
  }

  const handlePayment = async () => {
    try {
      const orderRes = await axios.post('http://localhost:5000/api/orders/razorpay', { amount: totalAmount });
      const options = {
        key: 'rzp_test_12345',
        amount: orderRes.data.amount,
        currency: "INR",
        name: "PizzaApp",
        description: "Custom Pizza Order",
        order_id: orderRes.data.id,
        handler: async function (response) {
          try {
            await axios.post('http://localhost:5000/api/orders/verify', {
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              customPizza,
              totalAmount
            });
            navigate('/dashboard');
          } catch (err) {
            setError('Payment verification failed or insufficient stock.');
          }
        },
        theme: {
          color: "#bb86fc"
        }
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      setError('Could not initialize payment.');
    }
  };

  return (
    <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h2>Order Summary</h2>
      {error && <p className="error">{error}</p>}
      
      <div style={{ marginBottom: '20px' }}>
        <p><strong>Base:</strong> {customPizza.base.name} (₹{customPizza.base.price})</p>
        <p><strong>Sauce:</strong> {customPizza.sauce.name} (₹{customPizza.sauce.price})</p>
        <p><strong>Cheese:</strong> {customPizza.cheese.name} (₹{customPizza.cheese.price})</p>
        <p><strong>Veggies:</strong> {customPizza.veggies.length > 0 ? customPizza.veggies.map(v => v.name).join(', ') : 'None'} (₹{customPizza.veggies.reduce((a, b) => a + b.price, 0)})</p>
      </div>

      <h3>Total to Pay: ₹{totalAmount}</h3>
      <button onClick={handlePayment}>Pay with Razorpay</button>
    </div>
  );
};

export default OrderSummary;
