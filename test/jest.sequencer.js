const Sequencer = require('@jest/test-sequencer').default;

const comparePathString = (a, b) => {
    return b.localeCompare(a)
}

class CustomSequencer extends Sequencer {
    sort(tests) {
        const copyTests = Array.from(tests)
        return copyTests.sort((testA, testB) => comparePathString(testA.path, testB.path));
    }
}

module.exports = CustomSequencer;

