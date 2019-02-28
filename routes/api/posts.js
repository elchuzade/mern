const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

const Profile = require("../../models/Profile");
const Post = require("../../models/Post");
const validatePostInput = require("../../validation/post");
// @route GET api/posts/test
// @desc Tests post route
// @access Public
router.get("/test", (req, res) => {
  res.json({ msg: "Posts works fine" });
});

// @route GET api/posts
// @desc Get all post
// @access Public
router.get("/", (req, res) => {
  Post.find()
    .sort({ createdAt: -1 })
    .then(posts => res.json(posts))
    .catch(err => res.status(404).json({ postsnotfound: "Posts not found" }));
});

// @route GET api/post/:id
// @desc Get a single post by id
// @access Public
router.get("/:id", (req, res) => {
  Post.findById(req.params.id)
    .then(post => res.json(post))
    .catch(err => res.status(404).json({ postnotfound: "Post not found" }));
});

// @route POST api/posts
// @desc Create post
// @access Private
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    // Validating start
    const { errors, isValid } = validatePostInput(req.body);
    // Check validation
    if (!isValid) {
      // Return any errors with 400 status
      return res.status(400).json(errors);
    }
    // Validating end
    const newPost = new Post({
      text: req.body.text,
      name: req.body.name,
      avatar: req.body.avatar,
      user: req.user.id
    });

    newPost.save().then(post => res.json(post));
  }
);

// @route DELETE api/post/:id
// @desc Delete a post
// @access Private
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      Post.findById(req.params.id).then(post => {
        // Check for post owner
        if (post.user.toString() !== req.user.id) {
          return res.status(401).json({ notauthorized: "User not authorized" });
        }
        // Delete
        post
          .remove()
          .then(() => res.json({ success: true }))
          .catch(err =>
            res.status(404).json({ postnotfound: "Post not found" })
          );
      });
    });
  }
);

// @route POST api/post/like/:id
// @desc Like a post
// @access Private
router.post(
  "/like/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          // check if the current user's id is already in the post.likes array
          if (
            post.likes.filter(like => like.user.toString() === req.user.id)
              .length > 0
          ) {
            return res
              .status(400)
              .json({ alreadyliked: "You have already liked this post" });
          }
          // Add user id to the likes array
          post.likes.unshift({ user: req.user.id });
          post.save().then(post => res.json(post));
        })
        .catch(err => res.status(404).json({ postnotfound: "Post not found" }));
    });
  }
);

// @route POST api/post/unlike/:id
// @desc Unlike a post
// @access Private
router.post(
  "/unlike/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          // check if the current user's id is already in the post.likes array
          if (
            post.likes.filter(like => like.user.toString() === req.user.id)
              .length === 0
          ) {
            return res
              .status(400)
              .json({ notliked: "You have not yet liked this post" });
          }
          // Remove user id from the likes array
          const removeIndex = post.likes
            .map(item => item.user.toString())
            .indexOf(req.user.id);
          // Splice out of array
          post.likes.splice(removeIndex, 1); // 1 means only one value staring from removeIndex
          post.save().then(post => res.json(post));
        })
        .catch(err => res.status(404).json({ postnotfound: "Post not found" }));
    });
  }
);

// @route POST api/post/comment/:id
// @desc Add comment to post
// @access Private
router.post(
  "/comment/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    // Validating start
    // comment has the same structure as post for validation
    const { errors, isValid } = validatePostInput(req.body);
    // Check validation
    if (!isValid) {
      // Return any errors with 400 status
      return res.status(400).json(errors);
    }
    // Validating end
    Post.findById(req.params.id)
      .then(post => {
        const newComment = {
          text: req.body.text,
          name: req.body.name,
          avatar: req.body.avatar,
          user: req.user.id
        };
        // Add to comments array
        post.comments.unshift(newComment);
        post.save().then(post => res.json(post));
      })
      .catch(err => res.status(404).json({ postnotfound: "Post not found" }));
  }
);

// @route DELETE api/post/comment/:id/:comment_id
// @desc Remove comment from post
// @access Private
router.delete(
  "/comment/:id/:comment_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Post.findById(req.params.id)
      .then(post => {
        // Check if comment exists
        if (
          post.comments.filter(
            comment => comment._id.toString() === req.params.comment_id
          ).length === 0
        ) {
          // The comment we are trying to delete doesnt exist
          return res
            .status(404)
            .json({ commentnotexist: "Comment does not exist" });
        }
        const removeIndex = post.comments
          .map(item => item._id.toString())
          .indexOf(req.params.comment_id);
        post.comments.splice(removeIndex, 1);
        post.save().then(post => res.json(post));
      })
      .catch(err => res.status(404).json({ postnotfound: "Post not found" }));
  }
);

module.exports = router;
