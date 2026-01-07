import userModel from '../models/userModel.js'

// add items to user car(t
const addToCart = async (req,res)=>{
    try {
        let userData = await userModel.findById(req.user.userId);
        let cartData = await userData.cartData;
        if(!cartData[req.body.itemId])
            {
            cartData[req.body.itemId]=1
            }
        else{
            cartData[req.body.itemId] += 1
        }
        await userModel.findByIdAndUpdate(req.user.userId,{cartData})
        res.json({success:true,message:"Added To Cart"})
    } catch (error) {
        res.json({success:false,message:"Error"})
    }
}

//remove item from user cart

const removeFromCart = async (req,res)=>{

    try {
        let userData =await userModel.findById(req.user.userId)
        let cartData = await userData.cartData;
        if(cartData[req.body.itemId]>0){
            cartData[req.body.itemId] -=1;
        }
        await userModel.findByIdAndUpdate(req.user.userId,{cartData})
        res.json({success:true,message:"Remove From Cart"})

    } catch (error) {
        res.json({success:false,message:"Error"})
    }

}

// fetch user cart data 

const getCart = async (req, res) => {
  try {
    const userData = await userModel.findById(req.user.userId);

    if (!userData) {
      return res.json({ success: false, message: "User not found" });
    }

    res.json({
      success: true,
      cartData: userData.cartData || {}
    });

  } catch (error) {
    res.json({
      success: false,
      message: error.message
    });
  }
};

export {addToCart,removeFromCart,getCart}