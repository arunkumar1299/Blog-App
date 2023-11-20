import mongoose from "mongoose";
import Blog from "../model/Blog.js";
import User from "../model/User.js";

export const getAllBlogs = async(req,res,next)=>{
    let blogs;
    try{
        blogs = await Blog.find().populate("user");
    }catch(err){
        return console.log(err.message);
    }
    if(!blogs){
        return res.status(404).json({message: "No Blogs Found"});
    }
    return res.status(200).json({blogs:blogs})
}

export const getBlog = async(req,res,next)=>{
 
    const blogId = req.params.id;
    let blog;
    try{
         blog = await Blog.findById(blogId);
    }catch(err){
        return console.log(err.message)
    }
    if(!blog){
       return res.status(404).json({message:"Could not find a blog by id"})
    }
    return res.status(200).json({blog:blog});
}


export const addBlog = async(req,res,next)=>{
    const {title, description, image, user} = req.body;
    let existingUser;
    try{
        existingUser = await User.findById(user);
    }catch(err){
        return console.log(err.message)
    }
    if(!existingUser){
        return res.status(400).json({message:"Unable to find user by id"})
    }
    const blog = new Blog({
        title:title,
        description:description,
        image:image,
        user:user
    })
    try{
            const session = await mongoose.startSession();
            session.startTransaction();
            await blog.save({session:session});
            existingUser.blogs.push(blog);
            await existingUser.save({session:session});
            await session.commitTransaction();
    }catch(err){
         console.log(err.message)
        return res.status(500).json({message:err.message})
    }
    return res.status(200).json({blog:blog});
}

export const updateBlog = async(req,res,next)=>{
    const {title,description} = req.body; 
    const blogId = req.params.id;
    let blog;
    try{
        blog = await Blog.findByIdAndUpdate(blogId,{
            title:title,
            description:description
        })
    }catch(err){
        return console.log(err.message);
    }
    if(!blog){
        return res.status(500).json({message:"Unable to update the blog"})
    }
    return res.status(200).json({blog:blog});
        
}

export const deleteBlog = async(req,res,next)=>{

    const blogId = req.params.id;
    let blog;
    try{
        blog = await Blog.findByIdAndDelete(blogId).populate('user');
            await blog.user.blogs.pull(blog);
            await blog.user.save()
    }catch(err){
        return console.log(err.message);
    }
    if(!blog){
        return res.status(400).json({message:"Unable to delete"})
    }
    return res.status(200).json({message:"Deleted Successfully"});
}

export const getByUserId = async(req,res,next)=>{

    const userId = req.params.id;
    let userBlogs;
    try{
        userBlogs = await User.findById(userId).populate("blogs");
    }catch(err){
        return console.log(err.message);
    }
    if(!userBlogs){
        return res.status(404).json({message:"No Blog Found"});
    }
    return res.status(200).json({user:userBlogs})
}