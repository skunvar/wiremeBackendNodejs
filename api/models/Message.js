/**
 * Message.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {
    messageId:{
      type:'integer',
      unique:true,
      autoIncrement:true,
      primaryKey:true
    },
    chatId:{
      type:'string'
    },
    content:{
      type:'string'
    },
    sender:{
      type: 'string'
    },
    recipient: {
      type:'string'
    },
    isRead:{
      type:'boolean',
      defaultsTo:false
    }
  }
};
