 import express from "express";
import mongoose from "mongoose";
 import router from "./routes/user-routes.js";
import blogRouter from "./routes/blog-routes.js";
import cors from 'cors';
 const app = express();
 app.use(cors())
  app.use(express.json());
app.use('/api/user',router);
app.use("/api/blog",blogRouter);

mongoose.connect('mongodb+srv://arunkumarjr1999:arunkumarjak@blog-app.hqqpem9.mongodb.net/?retryWrites=true&w=majority')
.then(()=>{
    app.listen(5000,()=>console.log('Connection to the database and listening to the port 5000'));
})
.catch((err)=>{console.log(err.message)})

