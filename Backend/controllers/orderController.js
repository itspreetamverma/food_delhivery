import orderModel from "../models/orderModel.js";
import userModel from '../models/userModel.js'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

// placing user order from frontend

const placeOrder = async (req,res)=>{
    const frontend_url = "https://fooddelhiveryfrontend.vercel.app/"
    try {
        const newOrder= new orderModel({
            userId:req.user.userId,
            items:req.body.items,
            amount:req.body.amount,
            address:req.body.address
        })
        await newOrder.save();
        await userModel.findByIdAndUpdate(req.user.userId,{cartData:{}} )

        // const lineItems = req.body.items.map((item)=>({
        //     price_data:{
        //         currency:"inr",
        //         product_data:{
        //             name:item.name,
                    
        //         },
        //         unit_amount:item.price*100*80

        //     },
        //     quantity:item.quantity
        // }))
        // lineItems.push({
        //     price_data:{
        //         currency:"inr",
        //         product_data:{
        //             name:"Delivery Charges"
        //         },
        //         unit_amount:2*100*80
        //     },
        //     quantity:1
        // })





const lineItems = req.body.items.map((item) => ({
  price_data: {
    currency: "inr",
    product_data: {
      name: item.name,
    },
    unit_amount: item.price * 100 * 80,
  },
  quantity: item.quantity,
}));

// ✅ delivery charge only if items exist
if (req.body.items.length > 0) {
  lineItems.push({
    price_data: {
      currency: "inr",
      product_data: {
        name: "Delivery Charges",
      },
      unit_amount: 2 * 100 * 80,
    },
    quantity: 1,
  });
}















        const session = await stripe.checkout.sessions.create({
            line_items:lineItems,
            mode:"payment",
            success_url:`${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url:`${frontend_url}/verify?success=false&orderId=${newOrder._id}`
        })
        res.json({success:true,session_url:session.url})

    } catch (error) {
        res.json({success:false,message:"error"})
        
    }


}

const verifyOrder = async (req,res)=>{
    const {orderId,success} = req.query
    const userId = req.user.userId;
    try {
        if (success === "true"){
            await orderModel.findByIdAndUpdate(orderId,{payment:true});
            await userModel.findByIdAndUpdate(userId, { cartData: {} });
            res.json({success:true,message:"Paid"})
            console.log("usercart", userId)
        }
        else{
            await orderModel.findByIdAndDelete(orderId)
            
            res.json({success:false,messege:"Not Paid"})
        }

        
    } catch (error) {
        res.json({success:false,message:"Error"})
        
    }

}

// user orders for frontend
const userOrders = async (req, res) => {
  try {

    const orders = await orderModel.find({ userId: req.user.userId });

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    console.error("USER ORDERS ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// listing order for admin panel
const listOrders = async(req,res)=>{
  try {
    const orders = await orderModel.find({});
    res.json({success:true, data:orders})
    
  } catch (error) {
    console.log(error);
    res.json({success:false,message:error})
    
  }

}

// api for updating order status
const updateStatus = async (req,res)=>{
  try {
    await orderModel.findByIdAndUpdate(req.body.orderId,{status:req.body.status})
    res.json({success:true, message:"Status Updated"})
    
  } catch (error) {
    console.log(error);
    res.json({success:false, message:"error"})
    
  }

}

export{userOrders,verifyOrder,placeOrder,listOrders,updateStatus}