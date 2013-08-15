'use strict';

// Dependencies
var express = require('express');
var fs = require('fs');
var glob = require('glob');
var path = require('path');
var Mocha = require('mocha');
var Runner = Mocha.Runner;
var _ = require('underscore');

// Create an application
exports.create = function (opts) {
    var app = express();
    bindRoutes(app, opts);
    return app;
};

exports.bindIos = function (app, opts) {
    var suite_clone;
    app.io.sockets.on('connection', function (socket) {

        var mocha = new Mocha({ timeout: 15000 });
        mocha.reporter('spec').ui('bdd');

        // socket.on('list', function (data) {

        //     glob(path.resolve(opts.path, '**/*.js'), function (err, files) {
        //         if (err) { throw err; }
        //         files.forEach(function (file) {
        //             mocha.addFile(file);
        //         });

        //         var runner = mocha.run(function(data){
        //           socket.emit('list', data.toString());
        //         });

        //         runner.on('pass', function(test){
        //           socket.emit('list', test.title);
        //         });

        //         runner.on('fail', function(test){
        //           socket.emit('list', test.title);
        //         });

        //     });
        // });

        socket.on('source', function (data) {


            var fs = require('fs');
            fs.readFile(data, function (err, data) {
              if (err) {
                throw err;
              }
              socket.emit('source', data.toString());
            });

        });


        socket.on('getfiles', function (data) {

            mocha.suite.on('require', function(source, file, m) {

                if (!Object.keys(source).length) {
                    socket.emit('getfiles', file, opts.path);

                    mocha.suite.suites[mocha.suite.suites.length -1].eachTest(function (test) {
                        socket.emit('test', test.title);
                    })
                }
            });

            glob(path.resolve(opts.path, '**/*.js'), function (err, files) {
                if (err) { throw err; }
                files.forEach(function (file) {
                    mocha.addFile(file);
                });

                mocha.loadFiles(function() {
                });
            });


        });


        socket.on('run', function (data) {

            var runner = new Runner(mocha.suite);
            runner.ignoreLeaks = true;
            runner.grep(new RegExp(data,'ig'));

            runner.on('pass', function(test, info){
               socket.emit('spec', test.title, info, 'success');

            });

            runner.on('fail', function(test, err){
               socket.emit('spec', test.title, require('util').inspect(err), 'danger');
            });

            runner.on('error', function(err){
                socket.emit('spec', 'err:'+err);
            });

            runner.run(function(err){
//                socket.emit('spec', data, 'err:'+err);
            });

        });


    });



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
