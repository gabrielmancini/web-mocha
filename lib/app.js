'use strict';

// Dependencies
var express = require('express');
var fs = require('fs');
var glob = require('glob');
var path = require('path');
var Mocha = require('mocha');

var mocha = new Mocha({ timeout: 15000});

// Create an application
exports.create = function (opts) {
    var app = express();
    bindRoutes(app, opts);
    return app;
};

// Bind application routes
function bindRoutes (app, opts) {

    // Main test page
    app.get('/', function (req, res) {
        renderTmpl(__dirname + '/../view/index.html', opts, function (err, content) {
            res.send(content);
        });
    });

    // Mocha files
    app.get(/^\/mocha\.(js|css)$/, function (req, res) {
        var path = __dirname + '/../node_modules/mocha/mocha.' + req.params[0];
        fs.readFile(path, 'utf8', function (err, file) {
            res.type(req.params[0]);
            res.send(file);
        });
    });

    // list files
    app.get('/list_test.js', function (req, res) {
        var ret_files = [];

        mocha.reporter('spec').ui('bdd');

        glob(path.resolve(opts.path, '**/*.js'), function (err, files) {
            if (err) { throw err; }
            files.forEach(function (file) {
                mocha.addFile(file);
            });

            res.type('js');
            var runner = mocha.run(function(data){
//              res.write(data);
              res.write('finished');
              res.end();
            });

            runner.on('pass', function(test){
              res.write(test.title);
            });

            runner.on('fail', function(test){
              res.write(test.title);
            });

        });


    });



}

// Poor-man's mustache
function renderTmpl (path, vars, callback) {
    fs.readFile(path, 'utf8', function (err, file) {
        if (err) {
            return callback(err);
        }
        var out = file.replace(/\{\{([a-z]+)\}\}/ig, function (all, name) {
            return vars[name];
        });
        callback(null, out);
    });
}