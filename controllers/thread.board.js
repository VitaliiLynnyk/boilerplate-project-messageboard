const bcrypt = require('bcrypt');
const saltRounds = 12;

const model = require('../models/thread.model');

exports.getThread = (req, res) => {
  const { board } = req.params;
  
  model.threadModel.find({ board }, (err, data) => {
    if (err) return res.status(500).json({ error: err });
    
    return res.status(200).json(data);
  });
};

exports.postThread = (req, res) => {
  const { board } = req.params;
  const { delete_password, text } = req.body;
  
  bcrypt.hash(delete_password, saltRounds, (err, hash) => {
    model.threadModel.findOneAndUpdate({ text }, {
        text,
        password: hash,
        board,
        reported: false,
        replies: [],
        replycount: 0
      },
      {
        new: true,
        upsert: true,
        useFindAndModify: false
      }, (err, data) => {
        if (err) return res.status(500).json({ error: err });
        return res.redirect('/b/' + board + '/');
      });
  });
};

exports.putThread = (req, res) => {
  const { report_id } = req.body;
  
  model.threadModel.findByIdAndUpdate(report_id, { $set: { reported: true } }, { new: true }, (err, doc) => {
    if (err) return res.status(500).json({ error: err });
    if (doc !== null) {
      return res.status(200).json('Success!');
    } else {
      return res.status(500).json('failure');
    }
  });
};
