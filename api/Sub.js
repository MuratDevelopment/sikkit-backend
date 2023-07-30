const express = require('express');
const router = express.Router();

const User = require('../models/User');
const Sub = require('../models/Sub');
const Post = require('../models/Post');

const isAuth = require('../config/authMiddleware').isAuth;


router.post('/create', isAuth, (req, res) => {
    let { name, description } = req.body;

    if (name == '' || description == '') {
        res.json({
            status: 'FAILED',
            message: 'Empty input fields!'
        });
    } else {
        const newSub = new Sub({
            name,
            description,
            owner: req.user.id,
            moderators: [req.user.id]
        });
        newSub.save().then(result => {
            res.json({
                status: 'SUCCESS',
                message: 'Sub created successfully!',
                data: result
            });
        }
        ).catch(err => {
            res.json({
                status: 'FAILED',
                message: 'An error occurred while creating sub!',
                error: err
            });
        }
        );
    }
});

router.post('/subscribe', isAuth, (req, res) => {
    Sub.findById(req.body.subId).then(sub => {
        if (sub) {
            if (sub.users.includes(req.user.id)) {
                res.json({
                    status: 'FAILED',
                    message: 'Already subscribed!'
                });
            } else {
                sub.users.push(req.user.id);
                sub.save().then(result => {
                    User.findById(req.user.id).then(user => {
                        if (user) {
                            user.subs.push(sub.id);
                            user.save().then(() => {
                                res.json({
                                    status: 'SUCCESS',
                                    message: 'Subscribed successfully!',
                                    data: result
                                });
                            }).catch(err => {
                                res.json({
                                    status: 'FAILED',
                                    message: 'An error occurred while subscribing!',
                                    error: err
                                });
                            });
                        } else {
                            res.json({
                                status: 'FAILED',
                                message: 'User does not exist!'
                            });
                        }
                    }
                    ).catch(err => {
                        res.json({
                            status: 'FAILED',
                            message: 'An error occurred while subscribing!',
                            error: err
                        });
                    }
                    );
                }).catch(err => {
                    res.json({
                        status: 'FAILED',
                        message: 'An error occurred while subscribing!',
                        error: err
                    });
                });
            }
        } else {
            res.json({
                status: 'FAILED',
                message: 'Sub does not exist!'
            });
        }
    }
    ).catch(err => {
        res.json({
            status: 'FAILED',
            message: 'An error occurred while subscribing!',
            error: err
        });
    }
    );
});

router.post('/getsub', (req, res) => {
    Sub.findById(req.body.id).then(sub => {
        if (sub) {
            res.json({
                status: 'SUCCESS',
                message: 'Sub found!',
                data: {
                    id: sub.id,
                    name: sub.name,
                    description: sub.description,
                    owner: sub.owner,
                    users: sub.users,
                    posts:  sub.posts,
                    banned: sub.banned,
                    moderators: sub.moderators,
                    created: sub.created
                }
            });
        } else {
            res.json({
                status: 'FAILED',
                message: 'Sub does not exist!'
            });
        }
    }
    ).catch(err => {
        res.json({
            status: 'FAILED',
            message: 'An error occurred while searching for sub!',
            error: err
        });
    }
    );
});

router.post('/ban', isAuth, (req, res) => {
    Sub.findById(req.body.subId).then(sub => {
        if (sub) {
            if (sub.moderators.includes(req.user.id)) {
                sub.bannedUsers.push(req.body.userId);
                sub.save().then(result => {
                    res.json({
                        status: 'SUCCESS',
                        message: 'User banned successfully!'
                    });
                }).catch(err => {
                    res.json({
                        status: 'FAILED',
                        message: 'An error occurred while banning user!',
                        error: err
                    });
                });
            } else {
                res.json({
                    status: 'FAILED',
                    message: 'Not a moderator!'
                });
            }
        } else {
            res.json({
                status: 'FAILED',
                message: 'Sub does not exist!'
            });
        }
    }
    ).catch(err => {
        res.json({
            status: 'FAILED',
            message: 'An error occurred while banning user!',
            error: err
        });
    }
    );
});

router.post('/unban', isAuth, (req, res) => {
    Sub.findById(req.body.subId).then(sub => {
        if (sub) {
            if (sub.moderators.includes(req.user.id)) {
                sub.bannedUsers.pull(req.body.userId);
                sub.save().then(result => {
                    res.json({
                        status: 'SUCCESS',
                        message: 'User unbanned successfully!'
                    });
                }).catch(err => {
                    res.json({
                        status: 'FAILED',
                        message: 'An error occurred while unbanning user!',
                        error: err
                    });
                });
            } else {
                res.json({
                    status: 'FAILED',
                    message: 'Not a moderator!'
                });
            }
        } else {
            res.json({
                status: 'FAILED',
                message: 'Sub does not exist!'
            });
        }
    }
    ).catch(err => {
        res.json({
            status: 'FAILED',
            message: 'An error occurred while unbanning user!',
            error: err
        });
    }
    );
});



router.post('/unsubscribe', isAuth, (req, res) => {
    Sub.findById(req.body.subId).then(sub => {
        if (sub) {
            if (sub.users.includes(req.user.id)) {
                sub.users.pull(req.user.id);
                sub.save().then(result => {
                    User.findById(req.user.id).then(user => {
                        if (user) {
                            user.subs.pull(sub.id);
                            user.save().then(() => {
                                res.json({
                                    status: 'SUCCESS',
                                    message: 'Unsubscribed successfully!',
                                    data: result
                                });
                            }).catch(err => {
                                res.json({
                                    status: 'FAILED',
                                    message: 'An error occurred while unsubscribing!',
                                    error: err
                                });
                            });
                        } else {
                            res.json({
                                status: 'FAILED',
                                message: 'User does not exist!'
                            });
                        }
                    }
                    ).catch(err => {
                        res.json({
                            status: 'FAILED',
                            message: 'An error occurred while unsubscribing!',
                            error: err
                        });
                    }
                    );
                }).catch(err => {
                    res.json({
                        status: 'FAILED',
                        message: 'An error occurred while unsubscribing!',
                        error: err
                    });
                });
            } else {
                res.json({
                    status: 'FAILED',
                    message: 'Not subscribed!'
                });
            }
        } else {
            res.json({
                status: 'FAILED',
                message: 'Sub does not exist!'
            });
        }
    }
    ).catch(err => {
        res.json({
            status: 'FAILED',
            message: 'An error occurred while unsubscribing!',
            error: err
        });
    }
    );
});

router.post('/moderator/add', isAuth, (req, res) => {
    Sub.findById(req.body.subId).then(sub => {
        if (sub) {
            if (sub.owner == req.user.id) {
                if (sub.moderators.includes(req.body.userId)) {
                    res.json({
                        status: 'FAILED',
                        message: 'Already a moderator!'
                    });
                } else {
                    sub.moderators.push(req.body.userId);
                    sub.save().then(result => {
                        res.json({
                            status: 'SUCCESS',
                            message: 'Moderator added successfully!',
                            data: result
                        });
                    }).catch(err => {
                        res.json({
                            status: 'FAILED',
                            message: 'An error occurred while adding moderator!',
                            error: err
                        });
                    });
                }
            } else {
                res.json({
                    status: 'FAILED',
                    message: 'Not authorized!'
                });
            }
        } else {
            res.json({
                status: 'FAILED',
                message: 'Sub does not exist!'
            });
        }
    }
    ).catch(err => {
        res.json({
            status: 'FAILED',
            message: 'An error occurred while adding moderator!',
            error: err
        });
    }
    );
});

router.post('/moderator/remove', isAuth, (req, res) => {
    if (req.user.id == req.body.userId) {
        res.json({
            status: 'FAILED',
            message: 'Cannot remove yourself!'
        });
    } else if (req.body.userId == req.body.subOwner) {
        res.json({
            status: 'FAILED',
            message: 'Cannot remove sub owner!'
        });
    } else {

        Sub.findById(req.body.subId).then(sub => {
            if (sub) {
                if (sub.owner == req.user.id) {
                    if (sub.moderators.includes(req.body.userId)) {
                        sub.moderators.pull(req.body.userId);
                        sub.save().then(result => {
                            res.json({
                                status: 'SUCCESS',
                                message: 'Moderator removed successfully!',
                                data: result
                            });
                        }).catch(err => {
                            res.json({
                                status: 'FAILED',
                                message: 'An error occurred while removing moderator!',
                                error: err
                            });
                        });
                    } else {
                        res.json({
                            status: 'FAILED',
                            message: 'Not a moderator!'
                        });
                    }
                } else {
                    res.json({
                        status: 'FAILED',
                        message: 'Not authorized!'
                    });
                }
            } else {
                res.json({
                    status: 'FAILED',
                    message: 'Sub does not exist!'
                });
            }
        }
        ).catch(err => {
            res.json({
                status: 'FAILED',
                message: 'An error occurred while removing moderator!',
                error: err
            });
        }
        );
    }
});

module.exports = router;





