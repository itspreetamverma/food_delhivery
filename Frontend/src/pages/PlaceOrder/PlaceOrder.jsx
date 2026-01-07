import React, { useContext, useState } from 'react'
import './PlaceOrder.css'
import { StoreContext } from '../../context/StoreContext'
import axios from 'axios'
import { useEffect} from 'react'
import { useNavigate } from 'react-router-dom'

const PlaceOrder = () => {
  const {getTotalCartAmount,token,foodlist,cartItems,url} = useContext(StoreContext)
  const [data,setData]= useState({
    firstName:"",
    lastName:"",
    email:"",
    street:"",
    city:"",
    state:"",
    zipcode:"",
    country:"",
    phone:"",
  })

  const onChangeHandler = (event)=>{
    const name=event.target.name;
    const value=event.target.value
    setData(data=>({...data,[name]:value}))
  }

  const placeOrder = async (event) => {
    event.preventDefault();

    // 🔐 Safety checks
    if (!token || getTotalCartAmount() === 0) {
      navigate("/cart");
      return;
    }

    // 🛒 Build order items safely
    const orderItems = [];
    foodlist.forEach((item) => {
      if (cartItems[item._id] > 0) {
        orderItems.push({
          ...item,
          quantity: cartItems[item._id],
        });
      }
    });

    const orderData = {
      address: data,
      items: orderItems,
      amount: getTotalCartAmount() + 2,
    };

    try {
      const response = await axios.post(
        url + "/api/order/place",
        orderData,
        { headers: { token } }
      );

      console.log("ORDER RESPONSE:", response.data);

      if (response.data.success && response.data.session_url) {
        // 💳 Redirect to Stripe payment
        window.location.replace(response.data.session_url);
      } else {
        alert("Payment session not created");
      }
    } catch (error) {
      console.error("ORDER ERROR:", error);
      alert("Something went wrong");
    }
  };





  return (
    <form onSubmit={placeOrder} action="" className='place-order'>
      <div className="place-order-left">
        <p className='title'>Delivery info</p>
        <div className="multi-fields">
          <input required name='firstName' onChange={onChangeHandler} value={data.firstName} type="text" placeholder='First Name' />
          <input required name='lastName' onChange={onChangeHandler} value={data.lastName} type="text" placeholder='Last Name' />
        </div>
        <input required name='email' onChange={onChangeHandler} value={data.email} type="email" placeholder='Email address' />
        <input required name='street' onChange={onChangeHandler} value={data.street} type="text" placeholder='Street' />
      

      <div className="multi-fields">
          <input required name='city' onChange={onChangeHandler} value={data.city} type="text" placeholder='City' />
          <input required name='state' onChange={onChangeHandler} value={data.state} type="text" placeholder='State' />
        </div>

        <div className="multi-fields">
          <input required name='zipcode' onChange={onChangeHandler} value={data.zipcode} type="number" placeholder='Zip Code' />
          <input required name='country' onChange={onChangeHandler} value={data.country} type="text" placeholder='Country' />
        </div>
        <input required name='phone' onChange={onChangeHandler} value={data.phone} type="text"  placeholder='Phone'/>
        </div>

      <div className="place-order-right">
        <div className="cart-total">
            <h2>Cart Total</h2>
            <div>
              <div className="cart-total-detail">
                <p>Subtotal</p>
                <p>${getTotalCartAmount()}</p>
              </div>
              <hr/>
              <div className="cart-total-detail">
                <p>Delivery Fee</p>
                <p>${2}</p>
              </div>
              <hr/>
              <div className="cart-total-detail">
                <b>Total</b><b>${getTotalCartAmount()+2}</b>
              </div>
              
            </div>
            <button type='submit' >PROCEED TO PAYMENT</button>
          </div>
      </div>
    </form>
  )
}

export default PlaceOrder