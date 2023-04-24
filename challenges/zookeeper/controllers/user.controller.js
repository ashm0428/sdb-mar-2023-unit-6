const router = require("express").Router();
const User = require("../models/user.model");

router.post("/create", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = new User({
      username: username,
      password: password,
    });
    const newUser = await user.save();
    res.status(200).json({ user: newUser, message: "Created a new Zoo User!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.post("/login", async (req, res) => {
    try {
        const { username, password} = req.body;
        const user = await User.findOne({username: username})
        if(user) {
            let passwordMatch = false;
            if(req.body.password === user.password) {
                passwordMatch = true;
                res.status(200).json({ message: "Login successful"});
            } else {
                passwordMatch = false;
                res.json({message: "Incorrect Password"})
            }
        } else {
            res.json({message: "Username not found"})
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})


module.exports = router;
