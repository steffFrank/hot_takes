const { findOne } = require("../models/sauce.model");
const Sauce = require("../models/sauce.model");
const fs = require("fs").promises;

const addSauce = async (req, res) => {
    const sauceObject = JSON.parse(req.body.sauce);
    const sauce = new Sauce({
        ...sauceObject,
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: [],
        imageUrl:`${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`
    });

    try {
        await sauce.save();
        res.status(201).json({message: "sauce registered with success!"});
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
    const sauceObject = req.file ? 
    {
        ...JSON.parse(req.body.sauce), 
        imageUrl:`${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`
    } : {...req.body};
    try {
        const sauce = await Sauce.findOne({"_id": id});
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
            res.status(401).json({message: "Not Authorized!"});
        } else {
            const filename = sauce.imageUrl.split("/uploads/")[1];
            await fs.unlink(`uploads/${filename}`);
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
        const sauce = await Sauce.findOne({"_id": id});
        if (like === 1) {
            await Sauce.updateOne(
                {"_id": id},
                {
                    $push: {usersLiked: userId},
                    $inc: {likes: 1}
                }
            );
            res.status(200).json({message: "Voted with success!"});
        } else if (like === -1) {
            await Sauce.updateOne(
                {"_id": id},
                {
                    $push: {usersDisliked: userId},
                    $inc: {dislikes: 1}
                }
            );
            res.status(200).json({message: "Voted with success!"});
        } else if (like === 0) {
            if (sauce.usersLiked.includes(userId)) {
                await Sauce.updateOne(
                    {"_id": id},
                    {
                        $pull: {usersLiked: userId},
                        $inc: {likes: -1}
                    }
                );
                res.status(200).json({message: "Vote modify with success"});
            }
            if (sauce.usersDisliked.includes(userId)) {
                await Sauce.updateOne(
                    { "_id":id },
                    {
                        $pull: {usersDisliked: userId},
                        $inc: {dislikes: -1}
                    }
                );
                res.status(200).json({message: "Vote modify with success"});
            }
        }
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