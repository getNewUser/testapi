const PostModel = require("./postModel");
const date = new Date();

const addPost = (req, res) => {
  const imgFile = req.file;
  const data = req.body;
  const newPost = new PostModel();

  //console.log(req.user)
  newPost.imageURL = `http://localhost:2000/${imgFile.path}`;
  newPost.caption = data.caption;
  newPost.username = req.user.username;
  newPost.userID = req.user._id;

  newPost.date = date.getTime();
  // newPost.latestComments = []

  newPost
    .save()
    .then(createdPost => {
      //console.log(createdPost);

      res.status(200).json(createdPost);
    })
    .catch(err => {
      console.log(err);
      res.status(400).json(err);
    })
    .catch(err => {
      res.status(400).json(err);
    });
};

const addLike = async (req, res) => {
  const user = req.user._id;
  const objID = req.params.id;
  try {
    let addLike = await PostModel.findById(objID, (err, obj) => {
      obj.likes = user;
      obj.save();
    });
    addLike ? res.json(addLike) : res.json("No such post");
  } catch (err) {
    res.status(400).json(err);
  }
};

const removeLike = async (req, res) => {
  // let user = req.user;
  console.log("zinau");
  let objID = req.params.id;
  const user = req.user._id;
  let post = await PostModel.findOne({
    _id: objID
  });
  console.log(user);
  console.log(post);
  post
    .updateOne({
      $pull: {
        likes: user
      }
    })
    .then(() => {
      res.json("Like Removed");
    })
    .catch(e => res.status(400).json(e));
};

const getAllLikes = async (req, res) => {
    let id = req.params.id;
    let user = JSON.stringify(req.user._id);

  try {
    const likeList = await PostModel.find({
      userID: req.user._id
    })
      .select("likes")
      // .populate("likes", "username");
      // console.log(likeList)

      let result = likeList.map((el) => {
        if (el.likes.length === 1) {
          return el.likes;
        }
      })
      let rez = result.map((e) => {
        if (e.length === 1) {
          return e;
        }
      })
      console.log(rez);
    // console.log(likeList);
    // res.json(result);
  } catch (err) {
    res.status(400).json(err);
  }
};

//post list by user ID
const getAllPosts = async (req, res) => {
  try {
    const postList = await PostModel.find({
      userID: req.user._id
    })
      .populate({
        path: "latestComments"
        // options: {
        //     limit: 2,
        //     sort: { _id : -1}
        // }
      })
      .populate({
        path: "likes",
        match: {
          _id: req.user._id
        }
      });

    res.json(postList);
  } catch (err) {
    res.status(400).json(err);
  }
};

const getAllPostsById = async (req, res) => {
  let id = req.params.id;

  try {
    const postList = await PostModel.find({
      userID: id
    });
    res.json(postList.length);
  } catch (err) {
    res.status(400).json(err);
  }
};

//unused
const getSingleList = async (req, res) => {
  let id = req.params.id;
  let myId = req.user._id;
  let result = JSON.stringify(myId);

  try {
    let post = await PostModel.findById(id);
    console.log(post.likes);

    if (post.likes.length >= 1) {
      post.likes.forEach((e) => {   
        let eId = JSON.stringify(e);
        if (eId === result) {
          res.json('dislike');
        } else {
          res.json('like');
        }
      })
    } else {
      res.json('like');
    }
  } catch (err) {
    res.status(400).json(err);
  }
};

const findOneAndRemove = async (req, res) => {
  let id = req.params.id;
  try {
    let toDoList = await ToDoList.findByIdAndRemove(id);
    res.json(toDoList);
  } catch (err) {
    res.status(400).json(err);
  }
};

const findOneAndUpdate = async (req, res) => {
  let id = req.params.id;
  try {
    let toDoList = await ToDoList.findById(id, (err, obj) => {
      obj.completed = !obj.completed;
      obj.save();
    });
    toDoList ? res.json(toDoList) : res.json("No such list");
  } catch (err) {
    res.status(400).json(err);
  }
};

module.exports = {
  addPost,
  getAllPosts,
  getAllPostsById,
  addLike,
  getAllLikes,
  removeLike,
  getSingleList

  // getSingleList,
  // findOneAndRemove,
  // findOneAndUpdate
};
