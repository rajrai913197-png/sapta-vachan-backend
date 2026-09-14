const InterestModel = require("../model/intrest");

const sendInterest = async (req, res) => {
  try {
    const { sender, receiver } = req.body;

    if (!sender || !receiver) {
      return res.status(400).json({
        message: "Sender and receiver are required",
      });
    }

    if (sender === receiver) {
      return res.status(400).json({
        message: "You cannot send interest to yourself",
      });
    }

    const alreadyExists = await InterestModel.findOne({
      sender,
      receiver,
    });

    if (alreadyExists) {
      return res.status(400).json({
        message: "Interest already sent",
      });
    }

    const interest = await InterestModel.create({
      sender,
      receiver,
    });

    res.status(201).json({
      message: "Interest sent successfully",
      interest,
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
};
const getReceivedInterests = async (req, res) => {
  try {
    const { userId } = req.params;

    const interests = await InterestModel.find({
      receiver: userId,
      status: "pending",
    })
      .populate("sender", "name email image age city profession")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Received interests fetched successfully",
      interests,
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
};
const acceptInterest = async (req, res) => {
  try {
    const { interestId } = req.params;

    const interest = await InterestModel.findById(interestId);

    if (!interest) {
      return res.status(404).json({
        message: "Interest not found",
      });
    }

    if (interest.status !== "pending") {
      return res.status(400).json({
        message: `Interest is already ${interest.status}`,
      });
    }

    interest.status = "accepted";

    await interest.save();

    res.status(200).json({
      message: "Interest accepted successfully",
      interest,
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
};
const rejectInterest = async (req, res) => {
  try {
    const { interestId } = req.params;

    const interest = await InterestModel.findById(interestId);

    if (!interest) {
      return res.status(404).json({
        message: "Interest not found",
      });
    }

    if (interest.status !== "pending") {
      return res.status(400).json({
        message: `Interest is already ${interest.status}`,
      });
    }

    interest.status = "rejected";

    await interest.save();

    res.status(200).json({
      message: "Interest rejected successfully",
      interest,
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
};
 const getMyConnections = async (req, res) => {
  try {
    const { userId } = req.params;

    const connections = await InterestModel.find({
      status: "accepted",
      $or: [
        { sender: userId },
        { receiver: userId }
      ]
    })
      .populate("sender", "name email image age city profession")
      .populate("receiver", "name email image age city profession");

    const users = connections
      .map((connection) => {
        if (!connection.sender || !connection.receiver) {
          return null;
        }

        if (connection.sender._id.toString() === userId) {
          return connection.receiver;
        }

        return connection.sender;
      })
      .filter(Boolean);

    res.status(200).json({
      message: "Connections fetched successfully",
      connections: users,
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
};
      
module.exports = { sendInterest, getReceivedInterests,acceptInterest, rejectInterest,getMyConnections};