const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authenticate = require('../authenticate');
const cors = require('./cors');
const Favorites = require('../models/favorites');

const favoriteRouter = express.Router();

favoriteRouter.use(bodyParser.json());


//favorites endpoint

favoriteRouter.route('/')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors,authenticate.verifyUser, (req, res, next) => {
    Favorites.find({})
    .populate('user') //populate users
            .populate('dishes') //populate dishes
            .then((favorites) => {         
                if (favorites) {
                    userFav = favorites.filter(fav => fav.user._id.toString() === req.user._id.toString())[0];
                    if (!userFav) {
                        var err = new Error('You have no favorites yet!');
                        err.status = 404;
                        return next(err);
                    }
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "application/json");
                    res.json(userFav);
                } else {
                    var err = new Error('There are no favorites');
                    err.status = 404;
                    return next(err);
                }

            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post(cors.corsWithOptions, authenticate.verifyUser,
        (req, res, next) => {
            Favorites.find({})
                .populate('user')
                .populate('dishes')
                .then((favorites) => {
                    var user;
                    if (favorites)
                        user = favorites.filter(fav => fav.user._id.toString() === req.user._id.toString())[0];
                    if (!user)
                        user = new Favorites({ user: req.user._id });
                    for (let i of req.body) {
                        if (user.dishes.find((d_id) => {
                            if (d_id._id) {
                                return d_id._id.toString() === i._id.toString();
                            }
                        }))
                            continue;
                        user.dishes.push(i._id);
                    }
                    user.save()
                        .then((favorite) => {
                            Favorites.findById(favorite._id)
                                .populate('user')
                                .populate('dishes')
                                .then((favorite) => {
                                    res.statusCode = 200;
                                    res.setHeader('Content-Type', 'application/json');
                                    res.json(favorite);
                                })
                        })
                        .catch((err) => next(err));

                })
                .catch((err) => next(err));
        })
             
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end("PUT operation not supported on /favorites");
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.find({})
        .populate('user')
        .populate('dishes')
        .then((favorites) => {
            var favToDelete;
            if (favorites) {
                favToDelete = favorites.filter(fav => fav.user._id.toString() === req.user._id.toString())[0];
            }
            if (favToDelete) {
                favToDelete.remove()
                    .then((result) => {
                        res.statusCode = 200;
                        res.setHeader("Content-Type", "application/json");
                        res.json(result);
                    }, (err) => next(err));

            } else {
                var err = new Error('You do not have any favorites');
                err.status = 404;
                return next(err);
            }
        }, (err) => next(err))
        .catch((err) => next(err));
});



favoriteRouter.route('/:dishId')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
     .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
        Favorites.findOne({ user: req.user._id })
            .then((favorites) => {
                if (!favorites) {
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "application/json");
                    return res.json({ "exists": false, "favorites": favorites });
                }
                else {
                    if (favorites.dishes.indexOf(req.params.dishId) < 0) {
                        res.statusCode = 200;
                        res.setHeader("Content-Type", "application/json");
                        return res.json({ "exists": false, "favorites": favorites });
                    }
                    else {
                        res.statusCode = 200;
                        res.setHeader("Content-Type", "application/json");
                        return res.json({ "exists": true, "favorites": favorites });
                    }
                }
            }, (err) => next(err))
            .catch((err) => next(err))
    })
    .post(cors.corsWithOptions, authenticate.verifyUser,
        (req, res, next) => {
            Favorites.find({})
                .populate('user')
                .populate('dishes')
                .then((favorites) => {
                    var user;
                    if (favorites)
                        user = favorites.filter(fav => fav.user._id.toString() === req.user._id.toString())[0];
                    if (!user)
                        user = new Favorites({ user: req.user._id });
                    if (!user.dishes.find((d_id) => {
                        if (d_id._id)
                            return d_id._id.toString() === req.params.dishId.toString();
                    }))
                        user.dishes.push(req.params.dishId);

                    user.save()
                        .then((favorite) => {
                            Favorites.findById(favorite._id)
                                .populate('user')
                                .populate('dishes')
                                .then((favorite) => {
                                    res.statusCode = 200;
                                    res.setHeader('Content-Type', 'application/json');
                                    res.json(favorite);
                                })
                        })
                        .catch((err) => next(err));

                })
                .catch((err) => next(err));
        })

    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation is not supported on /favorites/:dishId');
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorites.find({})
            .populate('user')
            .populate('dishes')
            .then((favorites) => {
                var user;
                if (favorites)
                    user = favorites.filter(fav => fav.user._id.toString() === req.user._id.toString())[0];
                if (user) {
                    user.dishes = user.dishes.filter((dishid) => dishid._id.toString() !== req.params.dishId);
                    user.save()
                        //
                        .then((result) => {
                            res.statusCode = 200;
                            res.setHeader("Content-Type", "application/json");
                            res.json(result);
                        }, (err) => next(err))

                } else {
                    var err = new Error('you do not have any favorites');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    });

// exporting favoriteRouter
module.exports = favoriteRouter




/*
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authenticate = require('../authenticate');
const cors = require('./cors');

const Favorites = require('../models/favorite');
const user = require('../models/user');

const favoriteRouter = express.Router();

favoriteRouter.use(bodyParser.json());

favoriteRouter.route('/')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(authenticate.verifyUser, cors.cors, (req,res,next) => {
    Favorites.find({})
    .populate('user')
    .populate('dishes_id')
    .then((favorites) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(favorites);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.find({})
    .populate('user')
    .populate('dishes_id')
    .then((favorites) => {
        var userFav;
        if (favorites != null) 
            userFav = favorites.filter(fav => fav.user._id.toString() === req.user.id.toString())[0];
        console.log(userFav);
        if(!userFav) 
            userFav = Favorites.create({user: req.user.id})
            .then((fav) => {console.log(fav);});
        console.log(req.body)
        for(let i of req.body) {
            // if(userFav.dishes.indexOf(i._id) != -1) {
            //     userFav.dishes.push(i._id)
            // }
            if(userFav.dishes.find((dish) => {
                if(dish._id){
                    return dish._id.toString() === i._id.toString();
                }
            }))
                continue;
            userFav.dishes.push(i._id);
        }
        userFav.save()
        .then((favs) => {
            console.log("Favourites Created");
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(favs);
        }, (err) => next(err))
        .catch((err) => next(err));
    })
    .catch((err) => next(err));
})     
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end("PUT operation not supported on /favorites");
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.find({})
    .populate('user')
    .populate('dishes_id')
    .then((favorites) => {
        var userFav;
        if(favorites) {
            userFav = favorites.filter(fav => fav.user._id.toString() === req.user.id.toString())[0];
        }
        if (userFav) {
            userFav.remove()
            .then((favs) => {
                console.log("All favourites removed");
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favs);
            });
        }
        else {
            var err = new Error('No favourites to delete');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
});


favoriteRouter.route('/:dishId')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.find({})
    .populate('user')
    .populate('dishes_id')
    .then((favorites) => {
        if(favorites) {
            var favs = favorites.filter(fav => fav.user._id.toString() === req.user.id.toString())[0];
            var dish = favs.dishes.filter(dish => dish._id === req.params.dishId)[0];
            if(dish) {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(dish);
            }
            else {
                var err = new Error('Favourite ' + req.params.dishId + " does not exist");
                err.status = 404;
                return next(err);
            }
        }
    } , (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.find({})
    .populate('user')
    .populate('dishes_id')
    .then((favorites) => {
        var userFav;
        if(favorites)
            userFav = favorites.filter(fav => fav.user._id.toString() === req.user.id.toString())[0];
        if(!userFav)
            userFav = new Favorites({user: req.user.id})
        if(!userFav.dishes.find((dish) => {
            if(dish._id)
                return dish._id.toString() === req.params.dishId.toString();
        })) 
            userFav.dishes.push(req.params.dishId);
        userFav.save()
        .then((favs) => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(favs);
            console.log("Added to favorites");
        }, (err) => next(err))
        .catch((err) => next(err));
    })
    .catch((err) => next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end("PUT operation not supported on /favorites");
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.find({})
    .populate('user')
    .populate('dishes_id')
    .then((favorites) => {
        var userFav;
        if(favorites) {
            userFav = favorites.filter(fav => fav.user._id.toString() === req.user.id.toString())[0];
        }
        if (userFav) {
            // userFav.dishes.remove(dish => dish._id.toString() === req.params.dishId);
            userFav.dishes = userFav.dishes.filter(dish => dish._id.toString() !== req.params.dishId)
            userFav.save()
            .then((favs) => {
                console.log("Favourite " + req.params.dishId + " removed");
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favs);
            }, (err) => next(err));
        }
        else {
            var err = new Error('No favourites to delete');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})


module.exports = favoriteRouter;
*/