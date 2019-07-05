const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: 'tigermatch19@gmail.com', 
      pass: 'thisisthetigermatchpassword' 
    }
  });

exports.sendVerificationEmail = function(netid) {
    
    let info = transporter.sendMail({
        from: '"TigerMatch" <tigermatch19@gmail.com>', // sender address
        to: netid + "@princeton.edu", // list of receivers
        subject: "Test email", // Subject line
        text: "It works!", // plain text body
    });
    
}
