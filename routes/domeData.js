var express = require('express');
var router = express.Router();
let userModel = require("./users");
let flash = require("connect-flash");
const passport = require('passport');
let localStrategy = require("passport-local");
let nodemailer = require('nodemailer');
let crypto = require('crypto');
require('dotenv').config(); // Load environment variables
let { Resend } = require("resend");
let upload = require("./multer");

passport.use(new localStrategy(userModel.authenticate()))



router.get("/", async function(req, res, next){
    let user = await userModel.findOne({username: req.session.passport.user});
    res.render("index", {user} )
})



router.post("/login", passport.authenticate("local", {
    successRedirect: "/profile",
    failureRedirect: "/login",
    failureFlash: true
}), function(req, res, next) {});


function isLoggedIn(req, res, next) {
    if (req.isAuthenticated() && req.user && req.user.isVerified) {
      return next();
    }
    res.redirect("/verifyotp");
  }


  router.post("/register", function(req, res) {
    let userdata = new userModel({
        username: req.body.username,
        password: req.body.password,
        email: req.body.email
    });

    userdata.register(userdata, req.body.password)
    .than(function(registereduser){
        passport.authenticate("local")(req, res, function(){
            res.redirect("/profile")
        })
    })
  })



  