const express = require("express");
const userRouter = express.Router();
const user = require("../controllers/user.controller");
const User = require("../models/user.model");
const saltRounds = 10;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

userRouter.post("/signup", (req, res) => {
    user.registerUser(req, res, saltRounds, User, bcrypt);    
});

userRouter.post("/login", (req, res) => {
    user.logUserIn(req, res, User, jwt, bcrypt);
});

module.exports = userRouter;