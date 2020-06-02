const CommentModel = require('./commentModel');
const PostModel = require('../postList/postModel');
const date = new Date();



const addComment = async (req, res) => {
    const data = req.body;
    const newComment = new CommentModel();
    //const newPost = new PostModel();

    // newComment._id = mongoose.Types.ObjectId()
    newComment.date = date.getTime();
    newComment.text = data.text;
    //newComment.commentOfText = data.caption;
    newComment.postID = data.postID
    newComment.userID = req.user._id;
    newComment.username = req.user.username;
    //newPost.latestComments = newComment._id
    //console.log(data.postID)

    // newComment.save().then((createdComment) => {
    //     //console.log(createdPost);
    //     newPost.save()
    //     res.json(createdComment)
    // }).catch((err) => {
    //     res.status(400).json(err);
    // })
    try {
        const comment = await newComment.save()

        const post = await PostModel.findById(data.postID, function (err, obj) {

            //console.log(obj.latestComments)
            obj.latestComments.unshift(comment._id)

            if (obj.latestComments.length > 2) {

                obj.latestComments.splice(2, obj.latestComments.length - 2)
            }

            obj.latestComments.reverse()

            //console.log(obj.latestComments)

            obj.save();
            // console.log(err)
            // console.log(obj)
            // res.status(200).json(obj);
            res.status(200).json(obj);
        })

        // await res.status(200).json(post);

    } catch (err) {
        res.status(400).json(err);
    }

}

const getPostComments = async (req, res) => {
    try {
        //console.log(req.params.id)
        const commentModel = await CommentModel.find({
            postID: req.params.id
        }).lean()
        //console.log(commentModel)

        // commentModel[0].showDeleteAction = 2;
        // console.log(commentModel[0].showDeleteAction)
        // console.log(commentModel[0])

        commentModel.forEach(obj => {
            //obj['show'] = true
            //console.log(obj.userID, '----', req.user._id)
            if (obj.userID.toString() == req.user._id.toString()) {
                
                obj.showDeleteAction = true;
                obj.showEditAction = true;
            } else {
                
                obj.showDeleteAction = false;
                obj.showEditAction = false;
            }
            
            // console.log(obj.userID.toString() == req.user._id.toString() )
            // console.log(obj.userID != req.user._id )
            // console.log(obj)
            // console.log(obj.show)
            // console.log(Object.keys(obj))
        });

        //console.log(commentModel)

        res.json(commentModel)
    } catch (err) {
        res.status(400).json(err);
    }

}

const getPostLatestComments = async (req, res) => {
    try {
        //console.log(req.params.id)
        const commentModel = await CommentModel.find({
            postID: req.params.id
        }).limit(2).sort({
            _id: -1
        });

        

        //console.log(commentModel)
        res.json(commentModel.reverse())
    } catch (err) {
        res.status(400).json(err);
    }

}

const deleteComment = async (req, res) => {
    // console.log(req.user._id);
    //console.log(req.params.id);
    try {
        //console.log(req.params.id)
        await CommentModel.findByIdAndRemove(req.params.id, {
                useFindAndModify: false
            },
            function (err, obj) {
                res.status(200).json(obj)
            })

    } catch (err) {
        res.status(400).json(err);
    }
}

const editComment = async (req, res) => {
    let id = req.params.id;
    const data = req.body;

    try {
        await CommentModel.findByIdAndUpdate(id,{useFindAndModify: false}, {
            text: data.text
        }, function (err, obj) {
            obj.text = data.text;
            res.status(200).json(obj)
        })
    } catch (err) {
        res.status(400).json(err);
    }
}

module.exports = {
    addComment,
    getPostComments,
    getPostLatestComments,
    deleteComment,
    editComment
}