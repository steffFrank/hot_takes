const express = require("express");
const sauceRouter = express.Router();
const auth = require("../middleware/auth");
const sauceController = require("../controllers/sauce.controller");
const multer = require("../middleware/multer-config");

sauceRouter.get("/", auth, sauceController.getAllSauces);

sauceRouter.get("/:id", auth, sauceController.getSauce);

sauceRouter.post("/", auth, multer, sauceController.addSauce);

sauceRouter.put("/:id", auth, multer, sauceController.updateSauce);

sauceRouter.post("/:id/like", auth, sauceController.updateLikes);
sauceRouter.delete("/:id", auth, sauceController.deleteSauce)
module.exports = sauceRouter;
