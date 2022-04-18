const Sequencer = require('@jest/test-sequencer').default;

class CustomSequencer extends Sequencer {
    sort(tests) {

        return tests.sort(() => Math.random() > 0.5);
    }
}

module.exports = CustomSequencer;