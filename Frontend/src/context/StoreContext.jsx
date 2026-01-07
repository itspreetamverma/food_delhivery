import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const [cartItems, setCartItems] = useState({});
  const url = "https://food-delhivery-backend.onrender.com"
  const [token,setToken] =useState("")
  const [foodlist,setFoodlist] = useState([])

 const addToCart = async (itemId) => {
  setCartItems((prev) => ({
    ...prev,
    [itemId]: (prev[itemId] || 0) + 1
  }));

  if (token) {
    await axios.post(url + "/api/cart/add", { itemId }, { headers: { token } });
  }
};

const removeFromCart = async (itemId) => {
  setCartItems((prev) => {
    if (!prev[itemId] || prev[itemId] === 1) {
      const updated = { ...prev };
      delete updated[itemId];
      return updated;
    }
    return { ...prev, [itemId]: prev[itemId] - 1 };
  });

  if (token) {
    await axios.post(url + "/api/cart/remove", { itemId }, { headers: { token } });
  }
};


const getTotalCartAmount = () => {
  let totalAmount = 0;

  for (const item in cartItems) {
    if (cartItems[item] > 0) {
      const itemInfo = foodlist.find(
        (product) => product._id === item
      );

      if (itemInfo) {
        totalAmount += itemInfo.price * cartItems[item];
      }
    }
  }
  return totalAmount;
};

  const fetchFoodList = async ()=>{
    const response = await axios.get(url+"/api/food/list")
    setFoodlist(response.data.data)
    console.log("foodList:" ,response)
  }

  const loadCartData = async(token)=>{
    const response = await axios.post(url+"/api/cart/get",{},{headers:{token}})
    setCartItems(response.data.cartData)
    console.log("cart response:",response)
  }

  useEffect(()=>{
   
    async function loadData() {
      await fetchFoodList();
       if(localStorage.getItem("token")){
      setToken(localStorage.getItem("token"))
      await loadCartData(localStorage.getItem("token"))
    }
      
    }
    loadData();
  },[])

  const contextValue = {
    foodlist,
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    url,
    token,
    setToken
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
