const PostModel = require("../postList/postModel");

const getAllFollowingPosts = async (req, res) => {
  let following = req.user.following;

  try {
    let pageNumber = req.params.pageNumber;

    let nPerPage = 12;

    let result = await PostModel.find({
      userID: following
    })
      .skip(pageNumber > 0 ? (pageNumber - 1) * nPerPage : 0)
      .limit(nPerPage);
    res.json(result);
  } catch (err) {
    res.status(400).json(err);
  }
};

const getAllPosts = async (req, res) => {
  try {
    let pageNumber = req.params.pageNumber;

    let nPerPage = 12;

    let result = await PostModel.find({})
      .populate({
        path: "likes",
        match: {
          _id: req.user._id
        }
      })
      .skip(pageNumber > 0 ? (pageNumber - 1) * nPerPage : 0)
      .limit(nPerPage);
    res.json(result);
  } catch (err) {
    res.status(400).json(err);
  }
};

module.exports = {
  getAllFollowingPosts,
  getAllPosts
};
