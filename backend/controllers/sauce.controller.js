const Sauce = require("../models/sauce.model");

const addSauce = async (req, res) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject.userId;
    const sauce = new Sauce({
        ...sauceObject,
        userId: req.auth.userId,
        imageUrl:`${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`
    });

    try {
        await sauce.save();
        res.status(201).json({message: "Registered with sucess!"});
    } catch(error) {
        res.status(400).json({ error });
    }
}

module.exports = ({addSauce});