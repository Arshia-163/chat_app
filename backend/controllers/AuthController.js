import User from "../models/UserModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { renameSync, unlinkSync } from "fs";

const maxAge = 3 * 24 * 60 * 60 * 1000; // 3 days in ms

// Create JWT Token
const createToken = (email, userId) => {
  return jwt.sign({ email, userId }, process.env.JWT_SECRET, { expiresIn: maxAge / 1000 });
};

// -------------------- SIGNUP --------------------
export const signup = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ error: "Email and password are required" });

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ error: "User already exists" });

    // Hash password manually (if not done in model)
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      password: hashedPassword,
      firstName: "",
      lastName: "",
    });

    const token = createToken(email, user._id);

    res.status(201).json({
      user: {
        id: user._id,
        email: user.email,
        token,
        profileSetup: user.profileSetup,
      },
    });
  } catch (error) {
    console.error("Signup error:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// -------------------- LOGIN --------------------
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ error: "Email and password are required" });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ error: "User with given email not found" });

    const auth = await bcrypt.compare(password, user.password);
    if (!auth)
      return res.status(400).json({ error: "Password is incorrect" });

    const token = createToken(email, user._id);

    res.cookie("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge,
    });

    res.status(200).json({
      user: {
        id: user._id,
        email: user.email,
        profileSetup: user.profileSetup,
        token,
        firstName: user.firstName,
        lastName: user.lastName,
        image: user.image,
        color: user.color,
      },
    });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// -------------------- GET USER INFO --------------------
export const getUserInfo = async (req, res) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    res.status(200).json({
      id: user._id,
      email: user.email,
      profileSetup: user.profileSetup,
      firstName: user.firstName,
      lastName: user.lastName,
      image: user.image,
      color: user.color,
    });
  } catch (error) {
    console.error("Get user info error:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// -------------------- UPDATE USER PROFILE --------------------
export const userProfile = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const { firstName, lastName, color } = req.body;

    if (!firstName || !lastName)
      return res.status(400).json({ error: "First name and last name are required" });

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        firstName,
        lastName,
        color,
        profileSetup: true,
      },
      { new: true }
    );

    if (!updatedUser)
      return res.status(404).json({ error: "User not found" });

    res.status(200).json({
      id: updatedUser._id,
      email: updatedUser.email,
      profileSetup: updatedUser.profileSetup,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      image: updatedUser.image,
      color: updatedUser.color,
    });
  } catch (error) {
    console.error("User profile update error:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// -------------------- ADD PROFILE IMAGE --------------------
export const addProfileImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).send("File is required");

    const date = Date.now();
    const fileName = `uploads/profiles/${date}_${req.file.originalname}`;
    renameSync(req.file.path, fileName);

    const updatedUser = await User.findByIdAndUpdate(
      req.body.user,
      { image: fileName },
      { new: true }
    );

    res.status(200).json({ image: updatedUser.image });
  } catch (error) {
    console.error("Profile image upload error:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// -------------------- REMOVE PROFILE IMAGE --------------------
export const removeProfileImage = async (req, res) => {
  try {
    const userId = req.user?.userId;
    const user = await User.findById(userId);
    if (!user) return res.status(404).send("User not found");

    if (user.image) unlinkSync(user.image);

    user.image = null;
    await user.save();

    res.status(200).send("Profile removed successfully");
  } catch (error) {
    console.error("Remove profile image error:", error.message);
    res.status(500).send("Internal server error");
  }
};

// -------------------- LOGOUT --------------------
export const logout = async (req, res) => {
  try {
    res.cookie("jwt", "", {
      maxAge: 1,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    res.status(200).send("Logout successful");
  } catch (error) {
    console.error("Logout error:", error.message);
    res.status(500).send("Internal server error");
  }
};
