'use strict';

// Dependencies
var path = require('path');

// Default server options
function defaultOpts (opts) {
    opts = opts || {};
    opts.title = opts.title || 'Test Suite';
    opts.ui = (opts.ui && opts.ui.toLowerCase() === 'tdd' ? 'tdd' : 'bdd');
    opts.path = path.resolve(opts.path || '.');
    opts.host = opts.host || 'localhost';
    opts.port = opts.port || 3000;
    return opts;
}

// Server
exports.Server = (function () {

    function Server (opts) {
        this.opts = defaultOpts(opts);
        this.host = this.opts.host;
        this.port = this.opts.port;
        this._app = require('./app').create(this.opts);
    }

    Server.prototype.start = function (callback) {
        this._app.listen(this.port, callback);
    };

    Server.prototype.stop = function () {
        this._app.close();
    };

    return Server;

} ());