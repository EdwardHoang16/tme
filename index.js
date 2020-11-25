#! node

/*
The purpose of this program is to build a testing framework from scratch that 
is a node-based command line framework, is able to test browser-based JS
apps, requires very little setup, is able to test a whole application, 
contains a "watch mode" so we do not have to keep restarting app, and is able
to find and run all files in our project with a name of ".test.js"
*/

const Runner = require("./runner");
const runner = new Runner();

//Helper method to use async + await code since it cannot be done at top level
const run = async () => {
    await runner.collectFiles(process.cwd());
    runner.runTests();
};

run();