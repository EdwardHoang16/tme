//This file is responsible for file collection, test environment setup, and test file execution

const chalk = require("chalk");
const fs = require("fs");
const path = require("path");
const render = require("./render");

const forbiddenDirs = ["node_modules"];

class Runner {
    constructor() {
        this.testFiles = [];
    }

    //Run the ".test.js" files and display the output
    async runTests() {
        for (let file of this.testFiles) {
            console.log(chalk.gray(`----- ${file.shortName}`));
            const beforeEaches = [];
            global.render = render;
            global.beforeEach = (fn) => {
                beforeEaches.push(fn);
            };
            global.it = async (desc, fn) => {
                beforeEaches.forEach(func => func());
                try {
                    await fn();
                    console.log(chalk.green(`\tOK - ${desc}`));
                } catch (err) {
                    const message = err.message.replace(/\n/g, "\n\t\t");
                    console.log(chalk.red(`\tX - ${desc}`));
                    console.log(chalk.red("\t", message));
                }
            };

            try {
                require(file.name);
            } catch (err) {
                console.log(chalk.red(err));
            }
        }
    }

    //Walk through all available files and find files ending in ".test.js" and 
    //add them + their filenames to files array
    async collectFiles(targetPath) {
        const files = await fs.promises.readdir(targetPath);
        
        for (let file of files) {
            const filepath = path.join(targetPath, file);
            const stats = await fs.promises.lstat(filepath);

            if (stats.isFile() && file.includes(".test.js")) {
                this.testFiles.push({ name: filepath, shortName: file });
            } else if (stats.isDirectory() && !forbiddenDirs.includes(file)) {
                const childFiles = await fs.promises.readdir(filepath);
                files.push(...childFiles.map(f => path.join(file, f)));
            }
        }
    }
}

module.exports = Runner;