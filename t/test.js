var toTree = require('../built/').toTree
const allFixtures  = require('./load-fextures').allFixures

describe("run parser tests", () => {
    allFixtures.map(i => test(i.file, ()=>expect(toTree().parse(i.text)).toEqual( i.tree)))
})