const router = require("express").Router();
const bcrypt = require("bcryptjs");
const Users = require("../users/user-model");
const userExists = require("../middleware/userExists");

// Register a new user
router.post("/register", userExists(), async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 14);

    const newUser = await Users.add({
      username,
      password: hashedPassword,
    });

    res.status(201).json(newUser);
  } catch (error) {
    next(error);
  }
});

// Login a existing user
router.post("/login", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await Users.findBy({ username }).first();

    const passwordValid = await bcrypt.compare(password, user.password);

    if (!passwordValid) {
      return res.status(501).json({
        message: "Invalid Credentials",
      });
    }

    req.session.user = user;

    res.json({
      message: `Welcome ${user.username}`,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
