const res = require("express/lib/response");
const bcrypt = require("bcrypt");
const router = require("express").Router();
const User = require("../Models/user.js");

//update user
router.put("/:id", async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    if (req.body.password) {
      try {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
      } catch (error) {
        return res.status(500).json(error);
      }
    }
    try {
      const user = await User.findByIdAndUpdate(req.params.id, {
        $set: req.body,
      });
      res.status(200).json("Account has been updated");
    } catch (error) {
      return res.status(500).json(error);
    }
  } else {
    return res.status(403).json("You can update only your account");
  }
});
//delete user
router.delete("/:id", async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    try {
      await User.findByIdAndDelete(req.params.id);
      res.status(200).json("Account has been deleted successfully");
    } catch (error) {
      return res.status(500).json(error);
    }
  } else {
    return res.status(403).json("You can delete only your account");
  }
});
//get a user
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json(error);
  }
});

//follow a user
router.put("/:id/follow", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const currentUser = await User.findById(req.params.id);
      const user = await User.findById(req.body.userId);
      
      if (!user.followers.includes(req.params.id)) {
           await user.updateOne({
          $push: { followers: req.params.id },
        });
        await currentUser.updateOne({ $push: { following: req.body.userId } });
        res.status(200).json("user has been followed");
      } else {
        res.status(403).json("you already follow this user");
      }
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    res.status(403).json("you cant follow yourself");
  }
})
//unfollow a user
router.put("/:id/unfollow", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      const currentUser = await User.findById(req.params.id);
      const user = await User.findById(req.body.userId);
      if (user.followers.includes(req.params.id)) {
           await user.updateOne({
          $pull: { followers: req.params.id },
        });
        await currentUser.updateOne({ $pull: { following: req.body.userId } });
        res.status(200).json("user has been unfollowed");
      } else {
        res.status(403).json("you dont this user");
      }
    } catch (error) {
      res.status(500).json(error);
    }
  } else {
    res.status(403).json("you cant unfollow yourself");
  }
})

module.exports = router;
