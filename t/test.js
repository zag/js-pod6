var parser = require('../src/pod6')
const allFixtures  = require('./load-fextures').allFixures

describe("run parser tests", () => {
    allFixtures.map(i => test(i.file, ()=>expect(i.tree).toEqual(parser.parse(i.text) )))
})