const model = require('../models/thread.model');

exports.getThread = (req, res) => {
  const { board } = req.params;
  
  model.threadModel.find({ board: board }, (err, data) => {
    if (err) return res.status(500).json({ error: err });
    
    res.json(data);
  });
};
