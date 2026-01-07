import mongoose from "mongoose";

export const connectDB = async()=>{
    await mongoose.connect('mongodb+srv://tomato:tomato123@cluster0.rvhoxji.mongodb.net/Food_Delhiveery')
        .then(()=>console.log("DB Connected"));
}
