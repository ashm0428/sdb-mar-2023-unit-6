const router = require("express").Router();
const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

router.post("/create", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = new User({
      username: username,
      password: bcrypt.hashSync(password, 10),
    });

    const newUser = await user.save();

    let token = jwt.sign({id: newUser._id}, "best_animal_is_doggo", {
      expiresIn: 60 * 60 * 48,
    });

    res.status(200).json({ user: newUser, message: "Created a new Zoo User!", token: token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// Prior code for reference:
 // let passwordMatch = false;
            // if(req.body.password === user.password) {
            //     passwordMatch = true;
            //     res.status(200).json({ message: "Login successful"});
            // } else {
            //     passwordMatch = false;
            //     res.json({message: "Incorrect Password"})
            // }

router.post("/login", async (req, res) => {
    try {
        const { username, password} = req.body;
        const user = await User.findOne({username: username})
        if(user) {
          const passwordMatch = await bcrypt.compare(
            req.body.password,
            user.password
          );

        
          let token = jwt.sign({id: user._id}, "best_animal_is_doggo", {
            expiresIn: 60 * 60 * 2, // Expires in 2 hr
          });

          res.status(200).json({
            message: passwordMatch ? "passwords matched" : "passwords do not match",
            token: passwordMatch ? token : "invalid token",
          });
        } else {
            res.json({message: "Username not found"})
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})


module.exports = router;
