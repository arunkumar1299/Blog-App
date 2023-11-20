import User from "../model/User.js";
import bcrypt from "bcryptjs";

export const getAllUser = async (req, res, next) => {
    let users;
    try {
        users = await User.find();
    } catch (err) {
        console.log(err.message);
        return res.status(500).json({ message: "Internal Server Error" });
    }
    if (!users) {
        return res.status(404).json({ message: "No User found " })
    }
    return res.status(200).json({ users: users })
}

export const signup = async (req, res, next) => {
    const { name, email, password } = req.body;
    let existingUser;
    try {
        existingUser = await User.findOne({ email })
    } catch (err) {
        return console.log(err.message);
    }
    if (existingUser) {
        return res.status(400).json({ message: "User Already exist, Login Instead" })
    }
    const hashedPassword = bcrypt.hashSync(password);
    const user = new User({
        name: name,
        email: email,
        password: hashedPassword,
        blogs:[]
    })
    try {
      await  user.save();
    } catch (err) {
        return console.log(err.message);
    }
    return res.status(201).json({ user: user });
}
export const login = async (req, res, next) => {
    const { email, password } = req.body;
    let existingUser;
    try {
        existingUser = await User.findOne({ email })
    } catch (err) {
        return console.log(err.message);
    }
    if (!existingUser) {
        return res.status(404).json({ message: "Couldn't find User by this email" })
    }
    const isPasswordCorrect = bcrypt.compareSync(password, existingUser.password);
    if(!isPasswordCorrect){
        return res.status(400).json({message:"Incorrect password"});
    }
    return res.status(200).json({message:"Login successful",user: existingUser});
}