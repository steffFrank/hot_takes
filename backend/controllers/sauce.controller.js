const Sauce = require("../models/sauce.model");
const { removeImageFromPath, updateLikes } = require("../utils");

const addSauce = async (req, res) => {
    const sauceObject = JSON.parse(req.body.sauce);
    const path = "uploads";
    const imageUrl = `${req.protocol}://${req.get("host")}/${path}/${req.file.filename}`;
    try {
        const sauce = new Sauce({
            ...sauceObject,
            likes: 0,
            dislikes: 0,
            usersLiked: [],
            usersDisliked: [],
            imageUrl: imageUrl
        });
        await sauce.save();
        res.status(201).json({message: "sauce registered with success!"});
    } catch(error) {
        removeImageFromPath(path, imageUrl);
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

const getSauce = async (req, res) => {
    const { id } = req.params;
    try {
        const sauce = await Sauce.findById(id);
        res.status(200).json(sauce);
    }catch(error) {
        console.error(error);
        res.status(404).json({error});
    }
}

const updateSauce = async (req, res) => {
    const { id } = req.params;
    let sauceObject = {};
    try {
        const sauce = await Sauce.findOne({"_id": id});

        if (req.file) {
            sauceObject = {
                ...JSON.parse(req.body.sauce), 
                imageUrl:`${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`
            }
            removeImageFromPath("uploads", sauce.imageUrl);
        } else {
            sauceObject = {...req.body};
        }

    
        if (sauce.userId !== req.auth.userId) {
            res.status(403).json({message: "Unauthorized request"});
        } else {
            await Sauce.updateOne({"_id": id}, {...sauceObject});
            res.status(200).json({message: "Sauce modified with success!"});
        }
    }catch(error) {
        console.error(error);
        res.status(403).json({ error });
    }
}

const deleteSauce = async (req, res) => {
    const { id } = req.params;
    try {
        const sauce = await Sauce.findOne({"_id": id});
        if (sauce.userId !== req.auth.userId) {
            console.log(sauce.userId, req.auth.userId);
            res.status(403).json({message: "Unauthorized request"});
        } else {
            removeImageFromPath("uploads", sauce.imageUrl);
            await Sauce.deleteOne({"_id": id});
            res.status(201).json({message: "Sauce deleted with success!"});
        }
    }catch(error) {
        console.error(error);
        res.status(401).json({error});
    }
}

const updateSauceLikes = async (req, res) => {
    const { id } = req.params;
    const { userId, like } = req.body;
    try {
        const message = await updateLikes(Sauce, id, userId, like);
        res.status(200).json({message: message});
    }catch(error) {
        console.error(error);
        res.status(404).json({ error });
    }

}

module.exports = ({
     addSauce,
     getAllSauces,
     getSauce,
     updateSauce,
     updateSauceLikes,
     deleteSauce
});