/**
 * Chat.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {
    chatId:{
      type: 'integer',
      unique: true,
      primaryKey: true,
      },
    sender: {
      type: 'string'
    },
    recipient: {
      type:'string'
    },
    isAccepted:{
      type:'boolean',
      defaultsTo:false
    },
    isRejected: {
      type:'boolean',
      defaultsTo:false
    }
  }
};

