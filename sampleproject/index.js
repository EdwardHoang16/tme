//This file serves as a sample project that has some tests associated with it,
//so that the tme program can be tested by testing this sample project.

module.exports = {
    forEach(arr, fn) {
        for (let element of arr) {
            fn(element);
        }
    }
};