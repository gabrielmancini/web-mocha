web-mocha
=========

web-mocha runs a simple HTTP server, serving up your [Mocha][mocha] tests. This allows you to run the same suite of tests on the command line (with Node.js) and in the browser.



Getting Started
---------------

web-mocha requires [Node.js][node] and npm. Once you have these dependencies, you can install mocha-srv with the following command:

```sh
$ npm install -g web-mocha
```


Usage
-----

Once installed, the `web-mocha` command should be available to you.

```

  Usage: web-mocha [options] <path>

  Options:

    -h, --help           output usage information
    -V, --version        output the version number
    -p, --port <port>    specify the port to run the server on. Default: 3000
    -t, --title <title>  specify the test suite title
    -u, --ui <ui>        specify the Mocha UI your tests use, one of: bdd (default), tdd

```

Example:

```sh
# Run web-mocha, serving unit tests in ./tests
$ web-mocha ./tests

# Run web-mocha on port 1337 and run tests in TDD style
$ web-mocha -p 1337 -u tdd ./tests

# Run using a env variables
NODE_ENV=test NODE_PATH=lib web-mocha test

```


License
-------

web-mocha is licensed under the [MIT][mit] license.



[mit]: http://opensource.org/licenses/mit-license.php
[mocha]: http://visionmedia.github.com/mocha/
[node]: http://nodejs.org/