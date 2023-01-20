const express = require("express");
const sauceRouter = express.Router();
const auth = require("../middleware/auth");
const sauceController = require("../controllers/sauce.controller");
const multer = require("../middleware/multer-config");


sauceRouter.get("/", auth, sauceController.getAllSauces);

sauceRouter.get("/:id", auth, (req, res) => {

});

sauceRouter.post("/", auth, multer, sauceController.addSauce);

sauceRouter.put("/:id", auth, (req, res) => {

});

sauceRouter.post("/:id/like", auth, (req, res) => {

});

module.exports = sauceRouter;
