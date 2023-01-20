const Sauce = require("../models/sauce.model");

const addSauce = async (req, res) => {
    const sauceObject = JSON.parse(req.body.sauce);
    
    const sauce = new Sauce({
        ...sauceObject,
        userId: req.auth.userId,
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: [],
        imageUrl:`${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`
    });

    try {
        await sauce.save();
        res.status(201).json({message: "sauce registered with sucess!"});
    } catch(error) {
        res.status(400).json({ error });
    }
}

const getAllSauces = async (req, res) => {
    try {
        const sauces = await Sauce.find();
        res.status(200).json(sauces);
    }catch(error) {
        res.status(400).json({ error });
    }
};

module.exports = ({addSauce, getAllSauces});