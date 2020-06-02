const User = require('./userModel.js');
const PostModel = require('../postList/postModel.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../config/config.js');

const register = (req, res) => {
  let data = req.body;
  let user = new User();
  user.username = data.username;
  user.fullName = data.fullName;
  user.password = data.password;
  user
    .save()
    .then(createdUser => {
      res.json(createdUser);
    })
    .catch(err => {
      res.status(400).json(err);
    });
};

const addProfileImage = async (req,res)=>{
    const imgFile = req.file;
    let user = req.user;

    user.imageURL = `http://localhost:2000/${imgFile.path}`;
    user.save().then((uploadedImg) => {

        res.status(200).json(uploadedImg);
    }).catch((err) => {
        console.log(err);
        res.status(400).json(err);
    })
}


const getAll = async (req, res) => {
  try {
    let users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(400).json(err);
  }
};

const logout = (req, res) => {
  let token = req.token;
  let user = req.user;
  user
    .update({
      $pull: {
        tokens: {
          token
        }
      }
    })
    .then(() => {
      res.json("logged out");
    })
    .catch(e => res.status(400).json(e));
};

const getSingleUser = async (req, res) => {
  let id = req.params.id;
  try {
    let user = await User.findById(id);
    user ? res.json(user) : res.json("No such user");
  } catch (err) {
    res.status(400).json(err);
  }
};

const getUserName = async (req, res) => {};

const login = async (req, res) => {

    try {
        let user = await User.findOne({
            username: req.body.username
        })
        if (!user) {
            res.status(400).json('No such user');
            return
        }
        bcrypt.compare(req.body.password, user.password, (err, response) => {

            if (response) {
                
                let access = 'auth';
                let token = jwt.sign({
                    _id: user._id.toHexString(),
                    access: access
                }, config.password).toString();

                user.tokens.push({
                    token,
                    access
                })
                user.save().then(() => {
                    res.header('x-auth', token).json(user);
                })

            } else {
                res.status(401).json('Login failed');
            }
        });


    } catch (err) {
        res.status(400).json(err);
    }
}


//post list by user ID
const getAllPostsById = async (req, res) => {

    let id = req.user._id;

    try {
        const postList = await PostModel.find({
            userID: id
        })
        
        res.json({postList : postList.length});

    } catch (err) {
        res.status(400).json(err);
    }
};

const getLoggedUserInfo = async (req,res)=>{
    try {
        let fullName = req.user.fullName;
        let username = req.user.username;
        let followers = req.user.followers;
        let following = req.user.following;
        let id = req.user._id;
        let image = typeof(req.user.imageURL) == !String ? undefined : req.user.imageURL;
        let userInfo = {
            fullName: fullName,
            followers: followers.length,
            following: following.length,
            username: username,
            image: image,
            id: id
        }
        
        res.json(userInfo);
    } catch (err) {
        res.status(400).json(err);
    }
}

const checkIfFollow = async (req,res)=>{
    let followingId = await req.params.id;
    let followerId = await req.user._id;


    try {
        let checkIfFollow = await User.findById(followingId)
        .populate({
            path: "followers",
            match: {_id: followerId}
        });
        res.json(checkIfFollow);
    } catch (error) {
        res.status(400).json(error);
    }
    
}

const follow = async (req,res)=>{
    let followingId = await req.params.id;
    let followerId = await req.user._id;
    try{
         await User.findByIdAndUpdate(followerId,
            {$push: {following: followingId}}
        );
        console.log('added to following');

        await User.findByIdAndUpdate(followingId,
            {$push: {followers: followerId}}
        );
        console.log('added to followers');
    }
    catch(error){
        res.status(400).json(error);
    }
}
const unfollow = async (req,res)=>{
    let followingId = await req.params.id;
    let followerId = await req.user._id;
    try{
         await User.findByIdAndUpdate(followerId,
            {$pull: {following: followingId}}
        );
        console.log('removed from following');

        await User.findByIdAndUpdate(followingId,
            {$pull: {followers: followerId}}
        );
        console.log('removed from followers');
    }
    catch(error){
        res.status(400).json(error);
    }
}

module.exports = {
    register,
    getAll,
    getSingleUser,
    login,
    logout,
    getLoggedUserInfo,
    addProfileImage,
    getAllPostsById,
    follow,
    unfollow,
    checkIfFollow,
  getUserName
};