const express = require("express");
const router = express.Router();
const request = require("request");
const config = require("config");
const auth = require("../../middleware/auth");
const { check, validationResult } = require("express-validator");
const Profile = require("../../models/Profile");
const User = require("../../models/user");

// @route   GET API/profile/me
// @desc    Get Current user profile
// Route    untuk user nambah apapun
// @access  Private
router.get("/me", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id,
    }).populate("user", ["name", "avatar"]);

    if (!profile) {
      return res.status(400).json({ msg: "There is no Profile for this User" });
    }

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});
// @route   PSOT API/profile
// @desc    Create or Update User profiles
// @access  Private
router.post(
  "/",
  [
    auth,
    [
      check("status", "Status is Required").not().isEmpty(),
      check("skills", "Skills is required").not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const {
      location,
      website,
      bio,
      skills,
      status,
      githubusername,
      youtube,
      twitter,
      instagram,
      linkedin,
      facebook,
    } = req.body;

    // Build Profile Object
    const profileFields = {};
    profileFields.user = req.user.id;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;
    if (website) profileFields.website = website;
    if (skills) {
      profileFields.skills = skills.split(",").map((skill) => skill.trim());
    }

    //build social array
    profileFields.social = {};
    if (youtube) profileFields.social.youtube = youtube;
    if (linkedin) profileFields.social.linkedin = linkedin;
    if (instagram) profileFields.social.instagram = instagram;
    if (facebook) profileFields.social.facebook = facebook;
    if (twitter) profileFields.social.twitter = twitter;

    try {
      let profile = await Profile.findOne({ user: req.user.id });

      if (profile) {
        //update
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );

        return res.json(profile);
      }

      //Create
      profile = new Profile(profileFields);
      await profile.save();
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// @route   GET API/profile
// @desc    Get All Profiles
// @access  Public
router.get("/", async (req, res) => {
  try {
    const profiles = await Profile.find().populate("user", ["name", "avatar"]);
    res.json(profiles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   GET API/profile/user/user_id
// @desc    Get Profiles by user id
// @access  Public
router.get("/user/:user_id", async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id,
    }).populate("user", ["name", "avatar"]);
    if (!profile)
      return res.status(400).json({ msg: "There is no profile for this user" });
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    if (err.name == "CastError") {
      return res.status(400).json({ msg: "Profile Not Found" });
    }
    res.status(500).send("Server Error");
  }
});

// @route   DELETE API/profile
// @desc    Delete Profile, user and Posts
// @access  PPrivate
router.delete("/", auth, async (req, res) => {
  try {
    //@todo -- Remove users post
    //remove Profile
    await Profile.findOneAndRemove({ user: req.user.id });
    //Remove User
    await User.findOneAndRemove({ _id: req.user.id });
    res.json({ msg: "User Removed!" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   GET api/profile/github/:username
// @desc    get user repos git
// @access  Public
router.get("/github/:username", (req, res) => {
  try {
    const options = {
      uri: `https://api.github.com/users/${
        req.params.username
      }/repos?per_page=5&sort=created:asc&client_id=${config.get(
        "githubClientId"
      )}&client_secret=${config.get("githubSecret")}`,
      method: "GET",
      headers: { "user-agent": "node-js" },
    };

    request(options, (error, response, body) => {
      if (error) console.error(error);

      if (response.statusCode !== 200) {
        return res.status(400).json({ msg: "No github profile found!" });
      }
      res.json(JSON.parse(body));
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   PUT api/profile/follow/:id
// @desc    Follow someone profile
// @access  Private
router.put("/follow/:id", auth, async (req, res) => {
  try {
    const users = await Profile.findById(req.params.id);
    // const user2 = await Profile.findById(req.Profile.id);

    // check if the profile has already been follow by spesific user
    if (
      users.friends.filter((like) => like.user.toString() === req.user.id)
        .length > 0
    ) {
      return res.status(400).json({ msg: "You alerady follow this guy" });
    }

    users.friends.unshift({ user: req.user.id });
    // user2.friends.unshift({ user: req.params.id });
    await users.save();
    // await user2.save();

    res.json(users.friends);
  } catch (err) {
    console.error(err.message);
    if (err.name == "CastError") {
      return res.status(404).json({ msg: "User not Found" });
    }
    res.status(500).send("Server Error");
  }
});

// @route   PUT api/posts/unfollow/:id
// @desc    unfollow a profiles
// @access  Private
router.put("/unfollow/:id", auth, async (req, res) => {
  try {
    const users = await Profile.findById(req.params.id);

    // check if the post has already been like by spesific user
    if (
      users.friends.filter((like) => like.user.toString() === req.user.id)
        .length === 0
    ) {
      return res.status(400).json({ msg: "You not follow this guy" });
    }

    // get remove index like
    const removeIndex = users.friends
      .map((like) => like.user.toString())
      .indexOf(req.user.id);
    users.friends.splice(removeIndex, 1);
    await users.save();

    res.json(users.friends);
  } catch (err) {
    console.error(err.message);
    if (err.name == "CastError") {
      return res.status(404).json({ msg: "User not Found" });
    }
    res.status(500).send("Server Error");
  }
});
module.exports = router;
