/**
 * TraderController
 *
 * @description :: Server-side logic for managing traders
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const request = require('request');
const transporter = nodemailer.createTransport({
  service: sails.config.common.supportEmailIdService,
  auth: {
    user: sails.config.common.supportEmailId,
    pass: sails.config.common.supportEmailIdpass
  }
});

module.exports = {


  getAllTrader: function (req, res) {
    Trader.find().exec(function (err, record) {
      if (err)
        return res.json({'message': 'failed to get users', statusCode: 400})
      return res.json({'message': 'traders retrieved successfully', statusCode: 200, data: record});
    })
  },

  getCurrencies : function (req, res){
    return res.json({data : sails.config.common.currency, statusCode: 200})
  },

  createNewTrader: function (req, res) {
    console.log("Enter into createNewTrader :: " + req.body.email);
    var traderfullName = req.body.fullName;
    var tradermobileNumber = req.body.mobileNumber;
    var traderemailaddress = req.body.email;
    var traderpassword = req.body.password;
    var traderconfirmPassword = req.body.confirmPassword;
    if (!traderemailaddress || !traderpassword || !traderconfirmPassword || !traderfullName || !tradermobileNumber) {
      console.log("Trader Entered invalid parameter ");
      return res.json({
        "message": "Can't be empty!!!",
        statusCode: 400
      });
    }
    if (traderpassword !== traderconfirmPassword) {
      console.log("Password and confirmPassword doesn\'t match!");
      return res.json({
        "message": 'Password and confirmPassword doesn\'t match!',
        statusCode: 400
      });
    }
    Trader.findOne({
      email: traderemailaddress
    }, function (err, trader) {
      if (err) {
        console.log("Error to find trader from database");
        return res.json({
          "message": "Error to find Trader",
          statusCode: 400
        });
      }
      if (trader && !trader.verifyEmail) {
        console.log("Use email exit But but not verified ");
        return res.json({
          "message": 'Email already exit but not varifed please login and verify',
          statusCode: 400
        });
      }
      if (trader) {
        console.log("Use email exit and return ");
        return res.json({
          "message": 'email already exist',
          statusCode: 400
        });
      }
      if (!trader) {
        var otpForEmail = Math.floor(Math.random() * 899999 + 100000);
        console.log("otpForEmail :: " + otpForEmail);
        bcrypt.hash(otpForEmail.toString(), 10, function (err, hash) {
          if (err) return next(err);
          var encOtpForEmail = hash;
          var traderObj = {
            fullName: traderfullName,
            mobileNumber: tradermobileNumber,
            email: traderemailaddress,
            password: traderpassword,
            encryptedEmailVerificationOTP: encOtpForEmail
          }

          var buySellVolumeObj ={
            buyRate : 0,
            sellRate : 0,
            volume : 0,
            email : traderemailaddress,
            currencyType : 'BTC'
          }

          var mailOptions = {
            from: sails.config.common.supportEmailId,
            to: traderemailaddress,
            subject: 'Please verify email !!!',
            html: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
							<html xmlns="http://www.w3.org/1999/xhtml" style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;">
							<head>
								<meta name="viewport" content="width=device-width" />
								<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
								<title>Actionable emails e.g. reset password</title>


								<style type="text/css">
									img {
										max-width: 100%;
									}

									body {
										-webkit-font-smoothing: antialiased;
										-webkit-text-size-adjust: none;
										width: 100% !important;
										height: 100%;
										line-height: 1.6em;
									}

									body {
										background-color: #f6f6f6;
									}

									@media only screen and (max-width: 640px) {
										body {
											padding: 0 !important;
										}
										h1 {
											font-weight: 800 !important;
											margin: 20px 0 5px !important;
										}
										h2 {
											font-weight: 800 !important;
											margin: 20px 0 5px !important;
										}
										h3 {
											font-weight: 800 !important;
											margin: 20px 0 5px !important;
										}
										h4 {
											font-weight: 800 !important;
											margin: 20px 0 5px !important;
										}
										h1 {
											font-size: 22px !important;
										}
										h2 {
											font-size: 18px !important;
										}
										h3 {
											font-size: 16px !important;
										}
										.container {
											padding: 0 !important;
											width: 100% !important;
										}
										.content {
											padding: 0 !important;
										}
										.content-wrap {
											padding: 10px !important;
										}
										.invoice {
											width: 100% !important;
										}
									}
								</style>
							</head>
							<body itemscope itemtype="http://schema.org/EmailMessage" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; -webkit-font-smoothing: antialiased; -webkit-text-size-adjust: none; width: 100% !important; height: 100%; line-height: 1.6em; background-color: #f6f6f6; margin: 0;"
								bgcolor="#f6f6f6">

								<table class="body-wrap" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; width: 100%; background-color: #f6f6f6; margin: 0;" bgcolor="#f6f6f6">
									<tr style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;">
										<td style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0;" valign="top"></td>
										<td class="container" width="600" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; display: block !important; max-width: 600px !important; clear: both !important; margin: 0 auto;"
											valign="top">
											<div class="content" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; max-width: 600px; display: block; margin: 0 auto; padding: 20px;">
												<table class="main" width="100%" cellpadding="0" cellspacing="0" itemprop="action" itemscope itemtype="http://schema.org/ConfirmAction" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; border-radius: 3px; background-color: #fff; margin: 0; border: 1px solid #e9e9e9;"
													bgcolor="#fff">
													<tr style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;">
														<td class="content-wrap" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 20px;" valign="top">
															<meta itemprop="name" content="Confirm Email" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;" />
															<table width="100%" cellpadding="0" cellspacing="0" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;">
																<tr style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;">
																	<td class="content-block" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 0 0 20px;" valign="top">

																	</td>
																</tr>
																<tr style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;">
																	<td class="content-block" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 0 0 20px;" valign="top">
																		Dear trader,
																	</td>
																</tr>
																<tr style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;">
																	<td class="content-block" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 0 0 20px;" valign="top">
																		Thank you for signing up with us. Please enter this otp to verify your Email.
																	</td>
																</tr>
																<tr style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;">
																	<td class="content-block" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 0 0 20px;" valign="top">
																		 Your OTP is : ${otpForEmail}
																	</td>
																</tr>
																<tr style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;">
																	<td class="content-block" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 0 0 20px;" valign="top">
																		Kind Regards,
																	</td>
																</tr>
																<tr style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;">
																	<td class="content-block" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 0 0 20px;" valign="top">
																		The BitWireMe Team
																	</td>
																</tr>
															</table>
														</td>
													</tr>
												</table>
												<div class="footer" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; width: 100%; clear: both; color: #999; margin: 0; padding: 20px;">
													<table width="100%" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;">
														<tr style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;">
															<td class="aligncenter content-block" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 12px; vertical-align: top; color: #999; text-align: center; margin: 0; padding: 0 0 20px;" align="center"
																valign="top">Follow <a href="http://twitter.com/bitwireme" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 12px; color: #999; text-decoration: underline; margin: 0;">@Mail_Gun</a> on Twitter.</td>
														</tr>
													</table>
												</div>
											</div>
										</td>
										<td style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0;" valign="top"></td>
									</tr>
								</table>
							</body>
							</html>`
          };
          transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
              return res.json({
                "message": "Try after some time!!!",
                statusCode: 400
              });
            } else {
              console.log('Email sent: ' + info.response);
              Trader.create(traderObj)
                .exec(function (err, traderAddDetails) {
                  if (err) {
                    console.log("Error to Create New trader !!!");
                    return res.json({
                      "message": "Error to create New Trader",
                      statusCode: 400
                    });
                  }

                  BuySellVolume.create(buySellVolumeObj).exec(function(err,data){
                        if(err){
                            return res.json({
                            "message": "Error to entering in buySellUpdate",
                            statusCode: 400
                          });
                        }
                        else{
                            return res.json({
                              "message": "Save buySellUpdate",
                              statusCode: 200
                            });
                        }
                    });

                  console.log("Trader Create Succesfully...........");
                  return res.json({
                    "message": "We sent OTP on your email address please verify email!!!",
                    "traderMailId": traderemailaddress,
                    statusCode: 200
                  });
                });
            }
          });
        });
      }
    });
  },
  verifyEmailAddress: function (req, res, next) {
    console.log("Enter into verifyEmailAddress");
    var traderMailId = req.param('email');
    var otp = req.param('otp');
    if (!traderMailId || !otp) {
      console.log("Can't be empty!!! by trader.....");
      return res.json({
        "message": "Can't be empty!!!",
        statusCode: 400
      });
    }
    Trader.findOne({
      email: traderMailId
    }).exec(function (err, trader) {
      if (err) {
        return res.json({
          "message": "Error to find trader",
          statusCode: 401
        });
      }
      if (!trader) {
        return res.json({
          "message": "Invalid email!",
          statusCode: 401
        });
      }
      if (trader.verifyEmail) {
        return res.json({
          "message": "Email already verified !!",
          statusCode: 401
        });
      }
      Trader.compareEmailVerificationOTP(otp, trader, function (err, valid) {
        if (err) {
          console.log("Error to compare otp");
          return res.json({
            "message": "Error to compare otp",
            statusCode: 401
          });
        }
        if (!valid) {
          return res.json({
            "message": "OTP is incorrect!!",
            statusCode: 401
          });
        } else {
          console.log("OTP is verified successfully");
          Trader.update({
            email: traderMailId
          }, {
            verifyEmail: true
          })
            .exec(function (err, updatedTrader) {
              if (err) {
                return res.json({
                  "message": "Error to update passoword!",
                  statusCode: 401
                });
              }
              console.log("Update passoword successfully!!!");
              res.json(200, {
                // "message": "Email verified successfully",
                // "traderMailId": traderMailId,
                trader : updatedTrader[0],
                statusCode: 200
              });
            });
        }
      });
    });
  },


  login: function (req, res) {
    console.log("Enter into login!!!" + req.body.email);
    var traderemail = req.param('email');
    var password = req.param('password');
    if (!traderemail || !password) {
      console.log("email and password required");
      return res.json({
        "message": "Can't be empty!!!",
        statusCode: 401
      });
    }
    console.log("Finding trader....");
    Trader.findOne({
      email: traderemail
    })
      .populateAll()
      .exec(function (err, trader) {
        if (err) {
          return res.json({
            "message": "Error to find trader",
            statusCode: 401
          });
        }
        if (!trader) {
          return res.json({
            "message": "Please enter registered email!",
            statusCode: 401
          });
        }
    
        console.log("Compare passs");
        Trader.comparePassword(password, trader, function (err, valid) {
          if (err) {
            console.log("Error to compare password");
            return res.json({
              "message": "Error to compare password",
              statusCode: 401
            });
          }
          if (!valid) {
            return res.json({
              "message": "Please enter correct password",
              statusCode: 401
            });
          } else {
            console.log("Trader is valid return trader details !!!");
            //updation of longitude and lattitude code

            console.log('this is body', req.body);

            Trader.update({email: traderemail}, {
              lat: req.body.lat,
              long: req.body.long
            }).exec(function (err, response) {
              if (err)
                return res.json({message: 'failed to update lat long', status: 400});
              return res.json({
                trader: response[0],
                statusCode: 200,
                token: jwToken.issue({
                  id: trader.id
                })
              });
            })
          }
        });
      });
  },
  logout: function (req, res) {
    req.session.destroy()
    res.json({
      message: 'Logout Successfully',
      statusCode: 200
    });
  },


///////////////// forgot password code starts here //////////////

  sentOtpToEmailForgotPassword: function (req, res, next) {

    console.log("Enter into sentOtpToEmail");
    var userMailId = req.body.email;
    if (!userMailId) {
      console.log("Invalid Parameter by user.....");
      return res.json({
        "message": "Invalid Parameter",
        statusCode: 400
      });
    }
    Trader.findOne({
      email: userMailId
    }).exec(function (err, user) {
      if (err) {
        return res.json({
          "message": "Error to find user",
          statusCode: 401
        });
      }
      if (!user) {
        return res.json({
          "message": "Invalid email!",
          statusCode: 401
        });
      }
      var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'wallet.bcc@gmail.com',
          pass: 'boosters@123'
        }
      });
      var newCreatedPassword = Math.floor(100000 + Math.random() * 900000);
      console.log("newCreatedPassword :: " + newCreatedPassword);
      var mailOptions = {
        from: 'wallet.bcc@gmail.com',
        to: userMailId,
        subject: 'Please reset your password',
        text: 'We heard that you lost your BccPay password. Sorry about that! ' +
        '\n But don’t worry! You can use this otp reset your password ' + newCreatedPassword
      };
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log(newCreatedPassword + 'Email sent: ' + info.response);
          //res.json(200,"Message Send Succesfully");
          console.log("createing encryptedPassword ....");
          bcrypt.hash(newCreatedPassword.toString(), 10, function (err, hash) {
            if (err) return next(err);
            var newEncryptedPass = hash;
            Trader.update({
              email: userMailId
            }, {
              encryptedForgotPasswordOTP: newEncryptedPass
            })
              .exec(function (err, updatedUser) {
                if (err) {
                  return res.serverError(err);
                }
                console.log("OTP forgot update succesfully!!!");
                return res.json({
                  "message": "Otp sent on user mail id",
                  "userMailId": userMailId,
                  statusCode: 200
                });
              });
          });
        }
      });
    });
  },
  verifyOtpToEmailForgotPassord: function (req, res, next) {

    console.log("Enter into sentOtpToEmail");
    var userMailId = req.body.userMailId;
    var otp = req.body.otp;
    if (!userMailId || !otp) {
      console.log("Invalid Parameter by user.....");
      return res.json({
        "message": "Invalid Parameter",
        statusCode: 400
      });
    }
    Trader.findOne({
      email: userMailId
    }).exec(function (err, user) {
      if (err) {
        return res.json({
          "message": "Error to find user",
          statusCode: 401
        });
      }
      if (!user) {
        return res.json({
          "message": "Invalid email!",
          statusCode: 401
        });
      }
      Trader.compareForgotpasswordOTP(otp, user, function (err, valid) {
        if (err) {
          console.log("Error to compare otp");
          return res.json({
            "message": "Error to compare otp",
            statusCode: 401
          });
        }
        if (!valid) {
          return res.json({
            "message": "Please enter correct otp",
            statusCode: 401
          });
        } else {
          console.log("OTP is varified succesfully");
          res.json(200, {
            "message": "OTP is varified succesfully",
            "userMailId": userMailId,
            statusCode: 200
          });
        }
      });
    });
  },
  updateForgotPassordAfterVerify: function (req, res, next) {
    console.log("Enter into sentOtpToEmail");
    var userMailId = req.body.userMailId;
    var newPassword = req.body.newPassword;
    var confirmNewPassword = req.body.confirmNewPassword;
    if (!userMailId || !newPassword || !confirmNewPassword) {
      console.log("Invalid Parameter by user.....");
      return res.json({
        "message": "Invalid Parameter",
        statusCode: 401
      });
    }
    if (newPassword != confirmNewPassword) {
      console.log("Invalid Parameter by user.....");
      return res.json({
        "message": "New Password and Confirm New Password not match",
        statusCode: 401
      });
    }
    Trader.findOne({
      email: userMailId
    }).exec(function (err, user) {
      if (err) {
        return res.json({
          "message": "Error to find user",
          statusCode: 401
        });
      }
      if (!user) {
        return res.json({
          "message": "Invalid email!",
          statusCode: 401
        });
      }
      bcrypt.hash(confirmNewPassword, 10, function (err, hash) {
        if (err) res.json({
          "message": "Errot to bcrypt passoword",
          statusCode: 401
        });
        var newEncryptedPass = hash;
        Trader.update({
          email: userMailId
        }, {
          encryptedPassword: newEncryptedPass
        })
          .exec(function (err, updatedUser) {
            if (err) {
              return res.json({
                "message": "Error to update passoword!",
                statusCode: 401
              });
            }
            console.log("Update passoword succesfully!!!");
            return res.json({
              "message": "Your passoword updated succesfully",
              statusCode: 200
            });
          });
      });
    });
  },


  buySellUpdate: function (req, res) {
    // if(req.isSocket){
    //   console.log('socket has been connected'+req.isSocket+req.body.currencyType);
    //    return res.json({
    //     "message": "Socket Connected",
    //     statusCode: 200
    //   });
    // }
    console.log('in buysellupdate action');
    const email = req.body.email;
    const buyRate = req.body.buyRate;
    const sellRate = req.body.sellRate;
    const volume = req.body.volume;
    const currencyType = req.body.currencyType;

    if (!email)
      return res.json({
        "message": "Email field cannot be empty!",
        statusCode: 400
      });
    if (!currencyType)
      return res.json({
        "message": "CurrencyType field cannot be empty!",
        statusCode: 400
      });
    if (!buyRate && !sellRate && !volume)
      return res.json({
        "message": "Nothing was found to update!",
        statusCode: 200
      })

    if (volume) {
      console.log('in volume block'+buyRate)
      Trader.update({email: email}, {volume: volume})
      .exec(function (err, TraderRecord) {
        if (err){
          console.log('error is here', err);
          return res.json({
            "message": "Failed to update volume, won't proceed ahead!",
            statusCode: 400
          })
        }

        // console.log('volume has been updated', email);
          if (buyRate && sellRate) {

                BuySellVolume.findOne({email : email , currencyType : currencyType})
                .exec(function(error,data){
                  if(data){
                        BuySellVolume.update({email: email, currencyType: currencyType}, {
                        buyRate: buyRate,
                        sellRate: sellRate,
                        volume : volume
                      }).exec(function (err, record) {
                        if (err){
                          console.log('error is here', err)
                          return res.json({
                            "message": "Failed to update buyRate and sellRate",
                            statusCode: 400
                          })
                        }
                        
                        sails.sockets.blast('updatedTrades', {
                          message:'Successfully updated buy and sell',
                          statusCode :200,
                          data : record
                        });

                        res.json({
                          "message": "Successfully updated buy and sell",
                          statusCode: 200
                        })
                      });
                  }
                  else{
                    var buySellUpdateNewCuurencyObj = {
                      buyRate: buyRate,
                      sellRate: sellRate,
                      email: email,
                      volume: volume,
                      currencyType: currencyType
                    }

                    BuySellVolume.create(buySellUpdateNewCuurencyObj).exec(function(err, data){
                      if(err){

                      }
                      else{

                        sails.sockets.blast('updatedTrades', {
                          message:'Successfully updated buy and sell',
                          statusCode :200,
                          data : data
                        });

                        return res.json({
                          "message": "Successfully updated buy and sell on new Currency",
                          statusCode: 200
                        })
                      }
                    });
                  }

                });

                
          }
          else if (buyRate) {
            BuySellVolume.update({
              email: email,
              currencyType: currencyType
            }, {buyRate: buyRate}).exec(function (err, record) {
              if (err)
                return res.json({
                  "message": "Failed to update buyRate",
                  statusCode: 400
                })

              sails.sockets.blast('updatedTrades', {
                message:'message has been sent',
                statusCode :200,
                data : record
              });

              res.json({
                "message": "Successfully updated buy",
                statusCode: 200
              })
            })

          }
          else if (sellRate) {
            BuySellVolume.update({
              email: email,
              currencyType: currencyType
            }, {sellRate: sellRate}).exec(function (err, record) {
              if (err)
                return res.json({
                  "message": "Failed to update sellRate",
                  statusCode: 400
                })

              sails.sockets.blast('updatedTrades', {
                message:'message has been sent',
                statusCode :200,
                data : record
              });

              res.json({
                "message": "Successfully updated sell",
                statusCode: 200
              })

            })
          }
      })
    }
    else
      {
        console.log('in else block of volume');

        if (buyRate && sellRate) {
          BuySellVolume.update({email: email, currencyType: currencyType}, {
            buyRate: buyRate,
            sellRate: sellRate
          }).exec(function (err, record) {
            if (err){
              console.log('error is here', err)
              return res.json({
                "message": "Failed to update buyRate and sellRate",
                statusCode: 400
              })
            }

            sails.sockets.blast('updatedTrades', {
                          message:'Successfully updated buy and sell',
                          statusCode :200,
                          data : record
                        });
            res.json({
              "message": "Successfully updated",
              statusCode: 200
            })
          })
        }
        else if (buyRate) {
          BuySellVolume.update({
            email: email,
            currencyType: currencyType
          }, {buyRate: buyRate}).exec(function (err, record) {
            if (err)
              return res.json({
                "message": "Failed to update buyRate",
                statusCode: 400
              })

            sails.sockets.blast('updatedTrades', {
                          message:'Successfully updated buy',
                          statusCode :200,
                          data : record
                        });

            res.json({
              "message": "Successfully updated",
              statusCode: 200
            })
          })

        }
        else if (sellRate) {
          BuySellVolume.update({
            email: email,
            currencyType: currencyType
          }, {sellRate: sellRate}).exec(function (err, record) {
            if (err)
              return res.json({
                "message": "Failed to update sellRate",
                statusCode: 400
              })
            
            sails.sockets.blast('updatedTrades', {
                          message:'Successfully updated sell',
                          statusCode :200,
                          data : record
                        });

            res.json({
              "message": "Successfully updated",
              statusCode: 200
            })

          })
        }
      }
    },


  //https://cex.io/api/ticker/BTC/USD
  //https://www.zebapi.com/api/v1/market/ticker/btc/inr

  getRates: function (req, res) {
    var opt = {
    method: 'GET',
    headers: {'content-type': 'application/json', 'charset':'utf-8'},
    json: true
    };
      var data = {};
      opt.url = 'https://cex.io/api/ticker/BTC/USD';
    request(opt, function (err, response, body) {
      if(err)
        return res.json({
          message: "Failed to get data from cex.io",
          statusCode: 400
        })
      data.cex = body
      opt.url = 'https://www.zebapi.com/api/v1/market/ticker/btc/inr';
      request(opt, function (err, response, body){
        if(err)
         return res.json({
            message: "failed to get response from zebpay",
            statusCode: 400
          });
        data.zeb = body;
        res.json({
          "message": "Success",
          statusCode: 200,
          data:data
        })
      })
    })
  },

  updateLocation: function (req, res) {
    const lat = req.body.lat,
      long = req.body.long,
      email=req.body.email;
    Trader.update({email: email}, {lat:lat, long:long}).exec(function (err, record) {
      if(err)
        return res.json({
          message: "failed to update location, this might be a problem with database",
          statusCode: 400
        });
      console.log('updated successfully');

      return res.json({
        message: "location has been updated successfully",
        statusCode: 200
      });

    })

  },

  getTraderInfo : function (req,res) {
    const email = req.body.email;
    const currency = req.body.currencyType;
    console.log('currencyType::'+req.body.currencyType);

    BuySellVolume.find({email:email}).exec(function (err, record) {
        if(err){
          return res.json({
            message:'failed to load trader data',
            statusCode: 400
          })
        }
        else{
          console.log('Inside data found');
        return res.json({
          message:'success',
          statusCode: 200,
          data: record
        });
       }
      })

    // Trader.findOne({email:email}).exec(function (err, record) {
    //   if(err)
    //     return res.json({
    //       message:'failed to load trader data',
    //       statusCode:400
    //     })
    //   var data = {
    //     volume:record.volume
    //   }
    //   BuySellVolume.findOne({email:email, currencyType:currency}).exec(function (err, record) {
    //     if(err)
    //       return res.json({
    //         message:'failed to load trader data',
    //         statusCode: 400
    //       })

    //     data.sellRate = record.sellRate;
    //     data.buyRate = record.buyRate;

    //     return res.json({
    //       message:'success',
    //       statusCode: 200,
    //       data: data
    //     });
    //   })
    // })
  },

  getTradersByLocation : function(req, res){
    Trader.find({verifyEmail : 1}, {email : 1, lat:1,long:1,traderId:1,id:1}).exec( function(err, results){
      if(!err){
        return res.json({
          data : results
        })
      }
    });
  },


  sentOtpToEmailVerificatation: function(req, res, next) { 
    console.log("Enter into sentOtpToEmailVerificatation");
    var userMailId = req.body.email;
    if (!userMailId) {
      console.log("Invalid Parameter by user.....");
      return res.json({
        "message": "Invalid Parameter",
        statusCode: 400
      });
    }
    Trader.findOne({
      email: userMailId
    }).exec(function(err, trader) {
      if (err) {
        return res.json({
          "message": "Error to find user",
          statusCode: 401
        });
      }
      if (!trader) {
        return res.json({
          "message": "Invalid email!",
          statusCode: 401
        });
      }
      var createNewOTP = Math.floor(100000 + Math.random() * 900000);
      console.log("createNewOTP :: " + createNewOTP);
      var mailOptions = {
        from: 'wallet.bcc@gmail.com',
        to: trader.email,
        subject: 'Please verify your email',
        text: 'Your otp to varify email ' + createNewOTP
      };
      transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log(createNewOTP + 'Email sent: ' + info.response);
          console.log("createing encryptedPassword ....");
          bcrypt.hash(createNewOTP.toString(), 10, function(err, hash) {
            if (err) return next(err);
            var newEncryptedPass = hash;
            Trader.update({
                email: userMailId
              }, {
                encryptedEmailVerificationOTP: newEncryptedPass
              })
              .exec(function(err, updatedUser) {
                if (err) {
                  return res.serverError(err);
                }
                console.log("OTP  update encryptedEmailVerificationOTP succesfully!!!");
                return res.json({
                  "message": "Otp sent on mail id",
                  statusCode: 200
                });
              });
          });
        }
      });
    });
  },

}





