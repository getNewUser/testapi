// const likeModel = require("./likeModel");

// const addLike = (req, res) => {
//   const data = req.body;
//   const newLike = new likeModel();

//   newLike.username = req.user.username;
//   newLike.userID = req.user._id;
//   //   newLike.postID =

//   newLike
//     .save()
//     .then(addedLike => {
//       console.log(addedLike);
//       res.status(200).json(addedLike);
//     })
//     .catch(err => {
//       res.status(400).json(err);
//     });
// };

// const getAllLikes = async (req, res) => {
//   try {
//     const likeList = await likeModel.find({
//       //   postID: req.user._id
//     });
//     res.json(likeList);
//   } catch (err) {
//     res.status(400).json(err);
//   }
// };

// module.exports = {
//   addLike,
//   getAllLikes
// };
