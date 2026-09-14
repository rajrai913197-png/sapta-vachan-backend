const MessageModel = require("../model/massageModel");

const sendMessage = async (req, res) => {
  try {
    const { sender, receiver, message } = req.body;

    if (!sender || !receiver || !message?.trim()) {
      return res.status(400).json({
        message: "Sender, receiver and message are required",
      });
    }

    const newMessage = await MessageModel.create({
      sender,
      receiver,
      message: message.trim(),
    });

    const populatedMessage = await MessageModel.findById(
      newMessage._id
    )
      .populate("sender", "name image")
      .populate("receiver", "name image");

    res.status(201).json({
      message: "Message sent successfully",
      data: populatedMessage,
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
};


const getMessages = async (req, res) => {
  try {
    const { user1, user2 } = req.params;

    const messages = await MessageModel.find({
      $or: [
        {
          sender: user1,
          receiver: user2,
        },
        {
          sender: user2,
          receiver: user1,
        },
      ],
    })
      .sort({ createdAt: 1 })
      .populate("sender", "name image")
      .populate("receiver", "name image");

    res.status(200).json({
      message: "Messages fetched successfully",
      messages,
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
};


module.exports = {
  sendMessage,
  getMessages,
};