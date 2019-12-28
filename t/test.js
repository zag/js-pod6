var parse = require('../src/').parse
const allFixtures  = require('./load-fextures').allFixures

describe("run parser tests", () => {
    allFixtures.map(i => test(i.file, ()=>expect(i.tree).toEqual(parse(i.text) )))
})