exports.fetch = function(db) {
    return function(req, res) {
        var query = {},
            limit = parseInt(req.param('limit'));
        if (typeof req.param('type') !== 'undefined') {
            query.type = req.param('type');
        }

        var cursor = db.collection('objects').find(query, {});
        if (limit !== 0) {
            cursor = cursor.limit(limit + 1);
        } 
        cursor.toArray(function (err, items) {
            if (limit !== 0 && items.length === limit + 1) { // has next pages
                items.pop();

                res.send({
                    filter_by_type: (typeof req.param('type') !== 'undefined') ? req.param('type') : false,
                    objects: items,
                    next_page: true
                });
            } else {
                res.send({ 
                    filter_by_type: (typeof req.param('type') !== 'undefined') ? req.param('type') : false,
                    objects: items,
                    next_page: false
                });
            }
        });
    };
};

exports.closest = function(db, ObjectId) {
    return function(req, res) {
        var query = {
            '_id': new ObjectId(req.param('id'))
        };

        db.collection('objects').find({}, {}).toArray(function (err, items) {
            var coordinates,
                distances = [];

            items.forEach(function(object) {
                if (object._id.valueOf() == req.param('id')) {
                    coordinates = {
                        latitude: parseFloat(object.coordinates.latitude),
                        longitude: parseFloat(object.coordinates.longitude)
                    };
                }
            });

            // calculate distances to every object
            items.forEach(function(object) {
                if (object._id.valueOf() != req.param('id')) {
                    var dist = Math.sqrt(
                        Math.pow(Math.abs(coordinates.latitude - object.coordinates.latitude), 2) +
                        Math.pow(Math.abs(coordinates.longitude - object.coordinates.longitude), 2)
                    );
                    distances.push({
                        'object': object,
                        'dist': dist
                    });
                }
            });
            distances = distances.sort(function(a, b) { return a.dist - b.dist; });
            distances = distances.slice(0, 3);

            var returned_objects = [];
            distances.forEach(function(distance) {
                returned_objects.push(distance.object);
            });

            res.send({
                objects: returned_objects
            });
        });
    };
};

exports.create = function(db) {
    return function(req, res) {
        var object = req.body;
        db.collection('objects').insert(object, function(err, result) {
            res.send((err === null) ? { msg: '' } : { msg: err });
        });
    };
};

// exports.like = function(db, ObjectID) {
//     return function(req, res) {
//         var query = {
//             '_id': new ObjectID(req.param('id'))
//         };
//         db.collection('objects').update(query, { '$inc': { rating: 1 } }, function(err, result) {
//             res.send((err === null) ? { msg: '' } : { msg: err });
//         });
//     };
// };

exports.delete = function(db, ObjectID) {
    return function(req, res) {
        var query = {
            '_id': new ObjectID(req.params.id)
        };
        db.collection('objects').remove(query, true, function(err, result) {
            res.send((result === 1) ? { msg: '' } : { msg: err });
        });
    };
};