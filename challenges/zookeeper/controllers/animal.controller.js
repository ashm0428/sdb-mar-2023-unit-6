const router = require("express").Router();
const validateSession = require("../middleware/validate-session");
const Animal = require("../models/animal.model");


router.post("/create", validateSession, async (req, res) => {
    try {
        const { name, legNumber, predator } = req.body;
        const animal = new Animal({
            name: name,
            legNumber: legNumber,
            predator: predator,
            user_id: req.user._id,
        });

        const newAnimal = await animal.save();
        res.status(200).json({animal: newAnimal, message: "Animal was added to the zoo!"});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

router.get("/view-all", validateSession, async (req, res) => {
    try {
let animals = await Animal.find().populate("user_id", "name");
        res.status(200).json({message: "All current zoo animals!", animals: animals});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
})

// http://localhost:4000/anima/delete/:id
router.delete("/delete/:id", validateSession, async (req, res) => {
    try {
        const id = req.params.id;
        const animalsFound = await Animal.find({
            _id: req.params.id,
            user_id: req.user._id,
        });

        if(animalsFound.length === 0) {
            throw Error("Not authorized to delete entry")
        }

        const removedAnimal = await Animal.deleteOne({_id: id, user_id: req.user._id});

        res.status(200).json({message: removedAnimal.deletedCount > 0 
            ? "1 animal removed from zoo :( "
            : "No animals were removed from zoo"});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

// http://localhost:4000/animal/update/:id
router.patch("/update/:id", validateSession, async (req, res) => {
    try {
        const { name, legNumber, predator } = req.body;
        const filter = {_id: req.params.id, user_id: req.user._id};
        const animalToUpdate = {
            name: name,
            legNumber: legNumber,
            predator: predator,
        };

        const returnUpdatedAnimal = { new: true };
        const animal = await Animal.findOneAndUpdate(filter, animalToUpdate, returnUpdatedAnimal);

        if(!animal) {
            throw Error("Not authorized to go near the precious animals...Stay Out!");
        }

        res.status(200).json({message: "Animal updated", animal: animal});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

//http://localhost:4000/animal/view-owner
router.get("/view-zookeeper", validateSession, async (req, res) => {
    try {
        let animals = await Animal.find({ user_id: req.user._id }).populate("user_id", "name");

        res.json({message: "This person has a zoo", animal: animals});
    } catch (error) {
        res.json({message: error.message});
    }
})



module.exports = router;