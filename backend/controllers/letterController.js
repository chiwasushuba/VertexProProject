// controllers/requestController.js
import Request from "../models/Request.js";

export const createRequest = async (req, res) => {
  try {
    const { type } = req.body;
    const request = await Request.create({
      user: req.user._id, // comes from auth middleware
      type
    });
    res.status(201).json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getRequests = async (req, res) => {
  try {
    const requests = await Request.find().populate("user", "name email");
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminNote } = req.body;

    const request = await Request.findByIdAndUpdate(
      id,
      { status, adminNote, updatedAt: Date.now() },
      { new: true }
    );

    res.json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
