import express from "express";
import { addBlog, deleteBlog, getAllBlogs, getBlog, getByUserId, updateBlog } from "../controllers/blog-controller.js";
const blogRouter = express.Router();

blogRouter.get('/',getAllBlogs);
blogRouter.get('/:id',getBlog);
blogRouter.post('/add',addBlog);
blogRouter.put('/update/:id',updateBlog);
blogRouter.delete('/delete/:id',deleteBlog)
blogRouter.get('/user/:id',getByUserId);
export default blogRouter;