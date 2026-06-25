import { Response } from "express";
import User from "../models/user.model";
import { AuthRequest } from "../middleware/auth.middleware";

// Get all users (Admin only)
export const getUsers = async (req: AuthRequest, res: Response) => {
  try {
    const users = await User.find({}).select("-password");

    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// Update user role (Admin only)
export const updateUserRole = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    // Validate role
    if (!["admin", "sales"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role value",
      });
    }

    // Prevent self-demotion
    if (String(req.user._id) === id) {
      return res.status(400).json({
        success: false,
        message: "Admins cannot demote themselves",
      });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.role = role;
    await user.save();

    res.status(200).json({
      success: true,
      message: "User role updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// Delete user account (Admin only)
export const deleteUser = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    // Prevent self-deletion
    if (String(req.user._id) === id) {
      return res.status(400).json({
        success: false,
        message: "Admins cannot delete their own account",
      });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    await User.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "User account deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};
