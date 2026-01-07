import React, { useCallback, useContext } from 'react'
import './Cart.css'
import {StoreContext} from '../../context/StoreContext'
import { useNavigate } from 'react-router-dom'

const Cart = () => {

  const {cartItems,foodlist,removeFromCart,getTotalCartAmount, url,token} = useContext(StoreContext)
  const navigate = useNavigate();
  const subtotal = getTotalCartAmount();
  const deliveryFee = subtotal > 0 ? 2 : 0;
  const total = subtotal+deliveryFee;



  return (
    <div className='cart'>
      <div className="cart-items">
        <div className="cart-items-title">
          <p>Items</p>
          <p>Title</p>
          <p>Price</p>
          <p>Quantity</p>
          <p>Total</p>
          <p>Remove</p>
        </div>
        <br/>
        <hr/>
        {foodlist.map((item,index)=>{
          if(cartItems[item._id]>0){
            return(
              <div>
                <div className="cart-items-title cart-items-item">
                  <img src={url+"/images/"+item.image} alt="" />
                  <p>{item.name}</p>
                  <p>${item.price}</p>
                  <p>{cartItems[item._id]}</p>
                  <p>${item.price*cartItems[item._id]}</p>
                  <p onClick={()=>removeFromCart(item._id)} className='cross'>X</p>
                </div>
                <hr/>
              </div>
              
              
            )
          }

        })}
      </div>
        <div className="cart-bottom">
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
                <p>${deliveryFee}</p>
              </div>
              <hr/>
              <div className="cart-total-detail">
                <b>Total</b><b>${total}</b>
              </div>
              
            </div>
            <button
                onClick={() => {
                  if(!token){
                      navigate('/cart')
                      return;
                    }

                  if (getTotalCartAmount() === 0){ 
                    navigate('/')          
                    return};
        
                  navigate("/order");
                }}>
              PROCEED TO CHECKOUT
            </button>
          </div>
          <div className="cart-promocode">
            <div>
              <p>If you have a promo code, Enter it here</p>
              <div className='cart-promocode-input'>
                <input type='text' placeholder='promo code'/>
                <button>Submit</button>

              </div>
            </div>
          </div>
        </div>
    </div>
  )
}

export default Cart