const bcrypt = require('bcrypt');
const saltRounds = 12;

const models = require('../models/thread.model');

exports.getReplies = (req, res) => {
  const { thread_id } = req.query;
  
  models.threadModel.findById(thread_id, (err, data) => {
    if (err) return res.status(500).json({ error: err });
    return res.status(200).json(data);
  });
};

exports.postReplies = (req, res) => {
  const { board } = req.params;
  const { delete_password, thread_id, text } = req.body;
  
  if (!(board && delete_password && thread_id && text))
    return res.status(500).json({ error: 'require all fields' });
  
  bcrypt.hash(delete_password, saltRounds, (err, hash) => {
    models.threadModel.findById(thread_id, (err, data) => {
      if (err) return res.status(500).json({ error: err });
      
      if (data !== null) {
        data.replycount = data.replycount + 1;
        const reply = new models.childModel({
          text,
          delete_password: hash,
          thread_id,
          reported: false
        });
        data.replies.push(reply);
        
        data.save((err, obj) => {
          if (err) return res.status(500).json({ error: err });
          return res.redirect('/b/' + board + '/' + thread_id);
        });
      } else {
        return res.status(404).json("Sorry, but we couldn't find that thread!");
      }
    })
  })
};

exports.putReplies = (req, res) => {
  const { thread_id, reply_id } = req.body;
  
  models.threadModel.findById(thread_id, (err, doc) => {
    if (err) return res.status(500).json({ error: err });
    
    if (doc !== null) {
      let check;
      for (let i = 0; i < doc.replies.length; i++) {
        if (doc.replies[i]._id === reply_id) {
          doc.replies[i].reported = true;
          check = true;
        }
      }
      if (check) {
        doc.save((err, obj) => {
          if (err) return res.status(500).json({ error: err });
          
          return res.status(200).json('Success!');
        });
      } else {
        return res.status(500).json('failure');
      }
    } else {
      return res.status(500).json('failure');
    }
  });
};

exports.deleteReplies = (req, res) => {
  const { thread_id } = req.body;
  
  models.threadModel.findById(thread_id, (err, doc) => {
    if (doc !== null) {
      if (err) return res.status(500).json({ error: err });
      
      let delete_password;
      for (let i = 0; i < doc.replies.length; i++) {
        if (doc.replies[i]._id == req.body.reply_id) {
          delete_password = doc.replies[i].delete_password;
          doc.replies[i].remove();
        }
      }
      bcrypt.compare(req.body.delete_password, delete_password, (err, bool) => {
        if (bool) {
          doc.replycount = doc.replycount - 1;
          doc.save((err, obj) => {
            if (err) return res.status(500).json({ error: err });
            
            return res.status(200).json('Success!');
          });
        } else {
          res.json('incorrect password');
        }
      });
    } else {
      res.json("Sorry, but we couldn't find that thread!");
    }
  });
};
