//This file is responsible for file collection, test environment setup, and test file execution

const fs = require("fs");
const path = require("path");

class Runner {
    constructor() {
        this.testFiles = [];
    }

    //Run the ".test.js" files
    async runTests() {
        for (let file of this.testFiles) {
            const beforeEaches = [];
            global.beforeEach = (fn) => {
                beforeEaches.push(fn);
            };
            global.it = (desc, fn) => {
                beforeEaches.forEach(func => func());
                fn();
            };

            require(file.name);
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
                this.testFiles.push({ name: filepath });
            } else if (stats.isDirectory()) {
                const childFiles = await fs.promises.readdir(filepath);
                files.push(...childFiles.map(f => path.join(file, f)));
            }
        }
    }
}

module.exports = Runner;