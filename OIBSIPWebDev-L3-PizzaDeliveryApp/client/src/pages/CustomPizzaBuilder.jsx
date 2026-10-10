import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CustomPizzaBuilder = () => {
  const [inventory, setInventory] = useState({ base: [], sauce: [], cheese: [], veggie: [] });
  const [step, setStep] = useState(1);
  const [selection, setSelection] = useState({ base: null, sauce: null, cheese: null, veggies: [] });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/inventory');
        const grouped = { base: [], sauce: [], cheese: [], veggie: [] };
        res.data.forEach(item => {
          if (grouped[item.category]) {
            grouped[item.category].push(item);
          }
        });
        setInventory(grouped);
      } catch (err) {
        console.error(err);
      }
    };
    fetchInventory();
  }, []);

  const handleNext = () => setStep(prev => prev + 1);
  const handleBack = () => setStep(prev => prev - 1);

  const handleVeggieToggle = (veggie) => {
    setSelection(prev => {
      const exists = prev.veggies.find(v => v._id === veggie._id);
      if (exists) {
        return { ...prev, veggies: prev.veggies.filter(v => v._id !== veggie._id) };
      } else {
        return { ...prev, veggies: [...prev.veggies, veggie] };
      }
    });
  };

  const calculateTotal = () => {
    let total = 0;
    if (selection.base) total += selection.base.price;
    if (selection.sauce) total += selection.sauce.price;
    if (selection.cheese) total += selection.cheese.price;
    selection.veggies.forEach(v => total += v.price);
    return total;
  };

  const proceedToCheckout = () => {
    navigate('/order-summary', { state: { customPizza: selection, totalAmount: calculateTotal() } });
  };

  return (
    <div className="card">
      <h2>Build Your Pizza</h2>
      <div className="stepper">
        <div className={`step ${step >= 1 ? 'active' : ''}`}>1. Base</div>
        <div className={`step ${step >= 2 ? 'active' : ''}`}>2. Sauce</div>
        <div className={`step ${step >= 3 ? 'active' : ''}`}>3. Cheese</div>
        <div className={`step ${step >= 4 ? 'active' : ''}`}>4. Veggies</div>
      </div>

      <div style={{ margin: '20px 0' }}>
        {step === 1 && (
          <div>
            <h3>Select Base</h3>
            {inventory.base.map(item => (
              <label key={item._id} style={{ display: 'block', margin: '10px 0' }}>
                <input type="radio" name="base" style={{ width: 'auto' }} onChange={() => setSelection({ ...selection, base: item })} checked={selection.base?._id === item._id} />
                {item.name} - ₹{item.price} (Stock: {item.stock})
              </label>
            ))}
            <button onClick={handleNext} disabled={!selection.base}>Next</button>
          </div>
        )}
        
        {step === 2 && (
          <div>
            <h3>Select Sauce</h3>
            {inventory.sauce.map(item => (
              <label key={item._id} style={{ display: 'block', margin: '10px 0' }}>
                <input type="radio" name="sauce" style={{ width: 'auto' }} onChange={() => setSelection({ ...selection, sauce: item })} checked={selection.sauce?._id === item._id} />
                {item.name} - ₹{item.price} (Stock: {item.stock})
              </label>
            ))}
            <button onClick={handleBack} style={{ marginRight: '10px', width: 'auto' }}>Back</button>
            <button onClick={handleNext} disabled={!selection.sauce} style={{ width: 'auto' }}>Next</button>
          </div>
        )}

        {step === 3 && (
          <div>
            <h3>Select Cheese</h3>
            {inventory.cheese.map(item => (
              <label key={item._id} style={{ display: 'block', margin: '10px 0' }}>
                <input type="radio" name="cheese" style={{ width: 'auto' }} onChange={() => setSelection({ ...selection, cheese: item })} checked={selection.cheese?._id === item._id} />
                {item.name} - ₹{item.price} (Stock: {item.stock})
              </label>
            ))}
            <button onClick={handleBack} style={{ marginRight: '10px', width: 'auto' }}>Back</button>
            <button onClick={handleNext} disabled={!selection.cheese} style={{ width: 'auto' }}>Next</button>
          </div>
        )}

        {step === 4 && (
          <div>
            <h3>Select Veggies</h3>
            {inventory.veggie.map(item => (
              <label key={item._id} style={{ display: 'block', margin: '10px 0' }}>
                <input type="checkbox" style={{ width: 'auto' }} onChange={() => handleVeggieToggle(item)} checked={!!selection.veggies.find(v => v._id === item._id)} />
                {item.name} - ₹{item.price} (Stock: {item.stock})
              </label>
            ))}
            <p><strong>Total: ₹{calculateTotal()}</strong></p>
            <button onClick={handleBack} style={{ marginRight: '10px', width: 'auto' }}>Back</button>
            <button onClick={proceedToCheckout} style={{ width: 'auto' }}>Checkout</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomPizzaBuilder;
