module.exports = {
    preset: "ts-jest",
    rootDir: "./",
    name: "directus",
    displayName: "directus",
    // setupFilesAfterEnv: ["<rootDir>/test/jest.setup.ts"],
    testTimeout: 100000,
    resetMocks: true,
    globalSetup: "<rootDir>/test/jest.setup.ts",
    globalTeardown: "<rootDir>/test/jest.teardown.ts",
    testSequencer: "<rootDir>/test/jest.sequencer.ts",

};