const clean_plugin = require('./../src/plugin-clean-location')
var toTree = require('../src/').toTree
 const cleanTree = toTree().use(clean_plugin)
const allFixtures  = require('./load-fextures').allFixures

describe("run parser tests", () => {
    allFixtures.map(i => test(i.file, ()=>expect(cleanTree.parse(i.text)).toEqual( i.tree)))
})