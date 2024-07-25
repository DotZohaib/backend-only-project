router.post('/verifyotp', function(req, res, next) {
  console.log("Received email: ", req.body.email);
  console.log("Received OTP: ", req.body.otp);

  userModel.findOne({ email: req.body.email, otp: req.body.otp, otpExpires: { $gt: Date.now() } })
  .then(function(user) {
    if (!user) {
      console.log("No user found or OTP expired");
      return res.redirect('/verifyotp');
    }
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    user.save().then(function() {
      console.log("User verified and saved");
      req.login(user, function(err) { // Log the user in after verification
        if (err) {
          console.error("Error logging in user:", err);
          return next(err);
        }
        res.redirect('/profile');
      });
    });
  })
  .catch(function(err) {
    console.error("Error during verification:", err);
    return next(err);
  });
});