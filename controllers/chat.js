import Message from "../models/Message.js";

export const sendMessage = (req, res) => {
    const { userId, message } = req.body;
console.log({req})
    const newMessage = new Message({
        userId,
        message
    });
    newMessage.save()
        .then(() => {
            res.status(201).json({ message: 'Message sent successfully' });
        })
        .catch(err => {
            console.error('Error saving message:', err);
            res.status(500).json({ error: 'Failed to send message' });
        });
};

export const getChats = (req, res) => {
    Message.find()
        .sort({ timestamp: -1 })
        .limit(10)
        .exec((err, messages) => {
            if (err) {
                console.error('Error fetching messages:', err);
                res.status(500).json({ error: 'Failed to fetch messages' });
            } else {
                res.json(messages);
            }
        });
};
