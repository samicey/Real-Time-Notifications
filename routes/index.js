const router = require('express').Router();
    const Post = require('./../models/post');
    const Notifications = require('../models/notification')

    router.get('/', async (req, res, next) => {
        const notifications = await Notifications.find({})

        Post.find({}, {title: true}).exec((err, posts) => {
            for(let i =0; i<posts.length;i++){
                posts[i].notifications = [];
            }
            
            for(let i = 0; i<posts.length;i++){
                for(let j = 0; j<notifications.length;j++){
                    if(posts[i]._id == notifications[j].postId){
                        posts[i].notifications.push(notifications[j])
                    }
                }
            }
            res.render('index', { posts});
        });
    });

    router.get('/posts/:id', async (req, res, next) => {
        Post.findOne({ _id: req.params.id }).exec((err, post) => {
            res.render('post', { post});
        });
    });

    router.post('/posts/:id', (req, res, next) => {
      Post.findByIdAndUpdate(req.params.id, {body: req.body.body}, (err, post) => {
        let Pusher = require('pusher');
        let pusher = new Pusher({
            appId: process.env.PUSHER_APP_ID,
            key: process.env.PUSHER_APP_KEY,
            secret: process.env.PUSHER_APP_SECRET,
            cluster: process.env.PUSHER_APP_CLUSTER
        });

        Notifications.create([{
            postId:req.params.id,
            body:req.body.body,
            read:false
         }])
        

        pusher.trigger('notifications', 'post_updated', post, req.headers['x-socket-id']);
        res.send('');
    });
  });
    module.exports = router;