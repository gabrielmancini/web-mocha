'use strict';

// Dependencies
var path = require('path');
var http = require('http');
var socketio = require('socket.io');

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
        var server = this._app.listen(this.port, callback);
        this._app.io = socketio.listen(server);            
        this._app = require('./app').bindIos(this._app, this.opts);
    };

    Server.prototype.stop = function () {
        this._app.close();
    };

    return Server;

} ());