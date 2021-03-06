const Posts = require('./db.js');

const router = require('express').Router();


// gets posts
router.get('/', async (req, res) => {
    try {
        const posts = await Posts.find(req.query);
        res.status(200).json(posts);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'The posts information could not be retrieved.',
        });
    }
});

// gets posts by id
router.get('/:id', async (req, res) => {
    try {
        const post = await Posts.findById(req.params.id);

        if (post) {
            res.status(200).json(post);
        } else {
            res.status(404).json({ message: 'The post with the specified ID does not exist.' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'The post information could not be retrieved.',
        });
    }
});

router.post('/', async (req, res) => {
    try {
        const post = req.body;

        if(!post.title || !post.contents){
            return res.status(400).json({
                message: 'Error, please provide title and contents for post.'
            })
        }
        const newPost = await Posts.insert(post);
        res.status(201).json(newPost);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'There was an error while saving the post to the database',
        });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const count = await Posts.remove(req.params.id);
        if (count > 0) {
            res.status(200).json ({ message: 'The post has been removed'});
        } else {
            res.status(404).json({ message: 'The post with the specified ID does not exist.' })
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'The post could not be removed.',
        });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const post = req.body;
        const { id } = req.params;

        if (!post.title || !post.contents) {
            return res.status(400).json({
                message: 'Error, please provide title and contents for posts update.'
            })
        } else if (!id) {
            res
            .status(404).json({
                message: 'The post with the specified ID could not be found.'
            });
        }

        const updatePost = await Posts.update(req.params.id, req.body);
        return res.status(201).json(updatePost);        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: 'The post information could not be modified.',
        });
    }
});

router.get('/:id/comments', (req, res) => {
    Posts.findPostComments(req.params.id)
        .then(comments => {
            res.status(200).json(comments);
        })
        .catch(error => {
            res.status(500).json(error);
        });
});

router.post('/:id/comments', async (req, res) => {
    try {
        const post_id = req.params.id;
        const { text } = await req.body;

        if (!text) {
            return res.status(400).json({
                message: 'Please provide text for the comment.'
            })
        } else if (!post_id) {
            res
            .status(404).json({
                message: 'The post with the specified ID could not be found.'
            });
        }

        const newComment = await Posts.insertComment({ text, post_id });
        return res.status(201).json(newComment);
            

    } catch (error) {
        res.status(500).json({
            message: 'There was an error while saving the comment to the database.',
        });
    }
});

module.exports = router;
