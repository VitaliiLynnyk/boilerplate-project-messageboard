const models = require('../models/thread.model');

exports.getReplies = (req, res) => {
  const { thread_id } = req.query;
  
  models.threadModel.findById(thread_id, (err, data) => {
    if (err) return res.status(500).json({ error: err });
    res.json(data);
  });
};
