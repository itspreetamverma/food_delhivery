import React, { useContext, useEffect } from 'react'
import './FoodDisplay.css'
import FoodItem from '../FoodItem/FoodItem'
import { StoreContext } from '../../context/StoreContext'

const FoodDisplay = ({category}) => {

    const {foodlist} = useContext(StoreContext)
console.log("render foodlist length:", foodlist.length);

  return (
    <div className='food-display' id='food-display'>
        <h2>Top dishes near your</h2>
        <div className="food-display-list" >
            {foodlist.map((item)=>{
              if(category==="all" || category.toLowerCase() === item.category.toLowerCase()){

                return <FoodItem key={item._id} id={item._id} name={item.name} description={item.description} price={item.price} image={item.image} />
              }
            
            })}
        </div>
    </div>
  )
}

export default FoodDisplay