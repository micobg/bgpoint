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

exports.create = function(db) {
    return function(req, res) {
        var object = req.body;
        db.collection('objects').insert(object, function(err, result) {
            res.send((err === null) ? { msg: '' } : { msg: err });
        });
    };
};

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