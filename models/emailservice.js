const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: 'tigermatch19@gmail.com', 
      pass: 'thisisthetigermatchpassword' 
    }
  });

exports.sendVerificationEmail = function(req, res) {
        
    let info = transporter.sendMail({
        from: '"TigerMatch" <tigermatch19@gmail.com>',
        to: req.user.username + "@princeton.edu",
        subject: "TigerMatch Verification",
        text: "Welcome to TigerMatch! Verify your email using this link: \nhttp:\/\/" + req.headers.host + "\/verify?token=" + req.user.verifyHash + ".\n"
    });
    
}
