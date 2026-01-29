import { useContext, useEffect, useState } from "react";
import "./payment.css";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../AuthContext";
import { v4 as generateId } from "uuid";

function Payment() {
  const [method, setMethod] = useState("");
  const navigate = useNavigate()
  const [paymentError, setPaymentError] = useState('');
  const [user, setUser] = useState({
    name: "",
    phone: "",
    address: ""
  });

  const {payment, setPayment, cleanCart, buyNow, setBuyNow, allOrders, getProductById, buyNowProId, createDate, currentUser} = useContext(AuthContext);

  useEffect(() => {
    if(!payment){
      navigate('/')
    }
    return () => {
      setPayment(false)
      setBuyNow(false)
    }
  }, [])

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handlePayment = async () => {
    if (!method) {
      setPaymentError("Please select a payment method");
      return;
    }
    

    if(!buyNow) {
      cleanCart(user.address)
    } else {
      let res = await currentUser()
      let product = await getProductById(buyNowProId)
      await allOrders([{
        id: generateId(),
        product,
        date: createDate(),
        quantity: 1,
        address: user.address,
        status: 'Pending',
        user: {
          name: res.name,
          email: res.email
        }
      }])
    }

    toast.success('✅ Order Successful Thank you for shopping with SmartBuy')
    navigate('/')
  };

  const radioChange = (data) => {
    setMethod(data)
    setPaymentError('')
  }

  

  return (
    <div className="payment-container">
      <h2>Payment Method</h2>
      {
        paymentError && 
        <div className="payment-error">
            <p>{paymentError}</p>
        </div>
      }
       <input
        type="text"
        name="name"
        placeholder="Full Name"
        value={user.name}
        onChange={handleChange}
      />

      <input
        type="tel"
        name="phone"
        placeholder="Phone Number"
        value={user.phone}
        onChange={handleChange}
      />

      <textarea
        name="address"
        placeholder="Delivery Address"
        value={user.address}
        onChange={handleChange}
      />
    <div>
          <label>
          <input
            type="radio"
            name="payment"
            className="radio"
            onChange={() => radioChange("card")}
          />
          Credit / Debit Card
        </label>

        <label>
          <input
            type="radio"
            name="payment"
            className="radio"
            onChange={() => radioChange("upi")}
          />
          UPI
        </label>

        <label>
          <input
            type="radio"
            name="payment"
            className="radio"
            onChange={() => radioChange("cod")}
          />
          Cash on Delivery
        </label>
      </div>
      
      <button onClick={handlePayment}>Pay Now</button>
    </div>
  );
}

export default Payment;
