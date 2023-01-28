const Sauce = require("../models/sauce.model");
const { removeImageFromPath, updateLikes } = require("../utils");

const addSauce = async (req, res) => {
    try {
        // Parse the sauce object from the request body
        const sauceObject = JSON.parse(req.body.sauce);

        // Create the image URL using the file's filename
        const path = "uploads";
        const imageUrl = `${req.protocol}://${req.get("host")}/${path}/${req.file.filename}`;
    
        // Create the sauce object and set default values for 'likes' 
        const sauce = new Sauce({
            ...sauceObject,
            likes: 0,
            dislikes: 0,
            usersLiked: [],
            usersDisliked: [],
            imageUrl: imageUrl
        });

        // save the sauce to the database
        await sauce.save();

        // Send a successful response
        res.status(201).json({message: "sauce registered with success!"});
    } catch(error) {
        // Remove the image from the path if there is an error
        removeImageFromPath(path, imageUrl);
        // Send an error response 
        res.status(400).json({ error });
    }
}

const getAllSauces = async (req, res) => {
    try {
        // Get all the sauces
        const sauces = await Sauce.find();
        // Send a successful response
        res.status(200).json(sauces);
    }catch(error) {

        // Send an error response
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
    try {
        // Get the sauce id from the request
        const { id } = req.params;

        // Create and empty object of the sauce
        let sauceObject = {};

        // Find the sauce with the id
        const sauce = await Sauce.findById(id);

        // Return 404 error if the sauce doesn't exist
        if (!sauce) {
            return res.status(404).json({message: "Sauce not found"});
        }

        // Update the sauce object with request sauce and the imageUrl if we receive a file
        if (req.file) {
            sauceObject = {
                ...JSON.parse(req.body.sauce), 
                imageUrl:`${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`
            }
            removeImageFromPath("uploads", sauce.imageUrl);
        } else {
            // If no file received update the sauce with the new sauce
            sauceObject = {...req.body};
        }
        
        // Validate the user and send the right response
        if (sauce.userId !== req.auth.userId) {
            res.status(403).json({message: "Unauthorized request"});
        } else {
            await sauce.updateOne({...sauceObject});
            res.status(200).json({message: "Sauce modified with success!"});
        }
    }catch(error) {
        console.error(error);
        res.status(500).json({ error });
    }
}

const deleteSauce = async (req, res) => {
    try {
        const { id } = req.params;

        const sauce = await Sauce.findById(id);
        if (!sauce) {
            res.status(404).json({message: "Sauce not found"});
        }

        if (sauce.userId !== req.auth.userId) {
            res.status(403).json({message: "Unauthorized request"});
        } else {
            removeImageFromPath("uploads", sauce.imageUrl);
            await sauce.deleteOne();
            res.status(201).json({message: "Sauce deleted with success!"});
        }
    }catch(error) {
        console.error(error);
        res.status(500).json({error});
    }
}

const updateSauceLikes = async (req, res) => {
    try {
        // Get the values from the request
        const { id } = req.params;
        const { userId, like } = req.body;
        // Find the sauce and validate
        const sauce = await Sauce.findById(id);
        if (!sauce) {
            return res.status(404).json({message: "Sauce not found"});
        }

        // Update the sauce with the like value
        const message = await updateLikes(sauce, userId, like);

        // Send the response with the message
        res.status(200).json({message});
    }catch(error) {
        console.error(error);
        res.status(500).json({ error });
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