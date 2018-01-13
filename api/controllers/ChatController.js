/**
 * ChatController
 *
 * @description :: Server-side logic for managing chats
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  
  sendMessage: function(req, res) {
    if(req.isSocket && req.method === 'POST'){

//      Chat.find({chatId:req.body.chatId}).exec(function (err, record) {
/*
        if(err)
         return res.json({message:'failed to send message',statusCode:400});
        if(record.length==0)
          return res.json({message:'No chat found with this id',statusCode:400});
        if(record.isAccepted==false)
          return res.json({message:'your chat request has not been accepted yet',statusCode:400});
*/
       Message.create({
            sender: req.body.sender,
            recipient: req.body.recipient,
            content: req.body.content,
            chatId:req.body.chatId
          }).exec(function(err, record) {
            console.log('message has been created successfully');
            if (err)
              return res.json({
                message: 'failed to create message record',
                statusCode: 400
              });
            sails.sockets.broadcast(req.body.chatId,'NEWMESSAGE', {
              message:'message has been sent',
              statusCode :200,
              data : record
            });
            console.log('messages'+record);
            return res.json({
              message: 'message has been sent',
              statusCode: 200,
              data:record
            });
          })
          
      // sails.sockets.broadcast(33,'NEWMESSAGE',
      //  {sender:'pankajjoshi115@gmail.com', recipient:'email2@email.ocm', content:'content is content', chatId:33});
      // return res.json({
      //   message: 'message has been sent',
      //   statusCode: 200,
      //   data:'done'
      // });

     
           // })
    }
  else if(req.method==='GET'){
      var chatId = req.param('chatId');

      sails.sockets.join(req, chatId, function (err) {
        if (err) {
          return res.serverError(err);
    }
        return res.json({
          message: 'Subscribed to a fun room called '+chatId+'!'
        });

      })
    }
    else {
      console.log("method"+req.isSocket+"::"+req.method);
      res.json({message:'bad request, only socket connections are allowed', statusCode:400});
    }
  },


  getChatMessages: function(req, res) {

/*    return res.json({
      statusCode: 200,
      message:'chat retrieved successfully',
      data: 11
    });*/

    Message.find({
      chatId: req.body.chatId
    }).exec(function(err, records) {
      if (err)
        return res.json({
          statusCode: 400,
          message: 'failed to get data'
        });
      return res.json({
        statusCode: 200,
        message:'chat retrieved successfully',
        data: records
      });
    });
  },
  /*
  getUserChats: function(req, res) {
    const email = req.body.email;
    Chat.find({
      sender: email
    }).exec(function(err, records) {
      if (err)
        return res.json({
          statusCode: 400,
          message: 'failed to get data'
        });
      return res.json({
        status: 200,
        data: records
      });
    });
  },*/


  createChat: function(req, res) {
    const senderId = req.body.sender;
    const recipientId = req.body.recipient;

    Chat.create({
      "sender": senderId,
      "recipient": recipientId
    }).exec(function(err, record) {
      if (err)
        return res.json({
          message: 'failed to create chat record',
          error: err,
          statusCode: 400
        })
      return res.json({
        message: 'chat has been created',
        statusCode: 200,
        data:record
      })

    })
  },


  getAllChatInvites: function (req, res) {
    userId = req.body.email;
    Chat.find({recipient:email}).exec(function (err, record) {
      if(err)
        return res.json({message:'failed to load invites', statusCode:400})
        const filteredChats = record.filter(function (t) {
          return !t.isRejected;
        })
        return res.json({'err':'failed to load data', statusCode:400})
      return res.json({message:'Acceptance is success', statusCode:200, data:filteredChats});
    })
  },


  updateAcceptance: function (req, res) {
    const isAccepted = req.body.isAccepted;
    const isRejected = req.body.isRejected;

    const chatId = req.body.chatId;
    if(isAccepted){
      return Chat.update({chatId:chatId}, {isAccepted:isAccepted}).exec(function (err, record) {
          if(err){
            return res.json({'message':'failed to load data', statusCode:400})
            }else{
            return res.json({message:'Acceptance is success', statusCode:200, data:record});
          }
      });
      Chat.destroy({chatId:chatId}).exec(function (err, record) {
          if(err){
           return res.json({'message':'failed to delete record', statusCode:400});
            }else{
            return res.json({'message':'success!', statusCode:200})
          }
      })
    }
    
    if(isRejected){
      return Chat.update({chatId:chatId}, {isRejected: isRejected}).exec(function (err, record) {
          if(err){
            return res.json({'message':'failed to load data', statusCode:400})
            }else{
            return res.json({message:'Request is rejected by Treader', statusCode:200, data:record});
          }
      });
    }
  },


  getUserFriends: function (req, res) {
    var userId = req.body.email;

    Chat.find({
      or : [
        {sender: userId},
        {recipient: userId}
      ]
    }).sort({createdAt: 'desc'})
      .exec(function (err, record) {
      if(err)
        return res.json({message:'failed to retrieve user list', statusCode:400});

      var mappedFriends = record.map(function (t) {
        if(t.sender==userId)
          return {email:t.recipient, chatId:t.chatId,isAccepted:t.isAccepted};
        else return {email:t.sender, chatId:t.chatId,isAccepted:t.isAccepted};
      });
         return res.json({message:'FriendsList retrieved Successfully', statusCode:200, data:mappedFriends});
    })
  },

  getTradersForUser: function (req, res) {
    var userId = req.body.email;

    Chat.find({recipient: userId}).sort({createdAt: 'desc'})
      .exec(function (err, record) {
      if(err){
        return res.json({message:'failed to retrieve user list', statusCode:400});
      }

      // var mappedFriends = record.map(function (t) {
      //   if(t.sender==userId)
      //     return {email:t.recipient, chatId:t.chatId,isAccepted:t.isAccepted};
      //   else return {email:t.sender, chatId:t.chatId,isAccepted:t.isAccepted};
      // });
      else{
         return res.json({message:'FriendsList retrieved Successfully', statusCode:200, data:record});
      }
    })
  },

};
