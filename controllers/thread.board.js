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
      return res.status(200).json('success!');
    } else {
      return res.status(500).json('failure');
    }
  });
};

exports.deleteThread = (req, res) => {
  const { thread_id, delete_password } = req.body;
  
  model.threadModel.findById(thread_id, (err, doc) => {
    if (err) return res.status(500).json({ error: err });
    
    if (doc !== null) {
      bcrypt.compare(delete_password, doc.password, (err, compare) => {
        if (compare) {
          doc.delete();
          res.status(200).json('success!');
        } else {
          res.status(500).json('incorrect password');
        }
      });
    } else {
      res.status(404).json("Sorry, we couldn't find that thread!");
    }
  });
};
