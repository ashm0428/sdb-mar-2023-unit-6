const router = require("express").Router();
const validateSession = require("../middleware/validate-session");
// const driverlogModel = require("../models/driverlog.model");
const DriverLog = require("../models/driverlog.model");
// const { validate } = require("../models/user.model");

// https://localhost:4000/log/create
router.post("/create", validateSession, async (req, res) => {

try {
    const { mode, totalHours, totalMiles, licensePlate } = req.body;

    const driverLog = new DriverLog({
        mode: mode,
        totalHours: totalHours,
        totalMiles: totalMiles,
        licensePlate: licensePlate,
        owner_id: req.user._id,
    });

    const newDriverLog = await driverLog.save();

    res.json({message: "log was saved", log: newDriverLog});
} catch (error) {
    res.json({message: error.message})
}
})


// http://localhost:4000/log/view-all
router.get("/view-all", validateSession, async (req, res) => {
    try {
        console.log(req.user);
        let logs = await DriverLog.find().populate("owner_id", "firstname lastname");
        // Could add conditions in the find - ex: find({mode: "day"})

        res.json({message: "works from view all", log: logs});
    } catch (error) {
        res.json({message: error.message});
    }
});

// http://localhost:4000/log/delete/:id
router.delete("/delete/:id", validateSession, async (req, res) => {
    try {
        const id = req.params.id;
        
        const removedLog = await DriverLog.deleteOne({_id: id, owner_id: req.user._id});
        console.log(removedLog);
        res.json({message: removedLog.deletedCount > 0 
            ? "Deleted 1 document"
            : "No documents were deleted"});
    } catch (error) {
        res.json({message: error.message});
    }
});

//http://localhost:4000/log/update/:id
router.patch("/update/:id", validateSession, async (req, res) => {

    try {
        const { mode, totalHours, totalMiles, licensePlate } = req.body;

        const filter = {_id: req.params.id, owner_id: req.user._id};
        const logToUpdate = {
            mode: mode,
            totalHours: totalHours,
            totalMiles: totalMiles,
            licensePlate: licensePlate,
        };

        const returnOptions = { new: true};
        const log = await DriverLog.findOneAndUpdate(filter, logToUpdate, returnOptions);

        if(!log) {
            throw Error("Not authorized to edit entry");
        }
        res.status(200).json({message: "works from update", log: log, });
    } catch (error) {
        res.json({message: error.message});
    }
})

//http:localhost:4000/log/view-owner
router.get("/view-owner", validateSession, async (req, res) => {
    try {
        let logs = await DriverLog.find({ owner_id: req.user._id }).populate("owner_id", "firstname lastname");

        res.json({message: "works from view owner", log: logs})
    } catch (error) {
        res.json({message: error.message})
    }
})

//http:localhost:4000/log/:id
router.get("/:id", async (req, res) => {
    try {
        const log = await DriverLog.findById(req.params.id);

        res.json({message: "works from get by id", log: log});
    } catch (error) {
         res.json({message: error.message});
    }
    });



module.exports = router;