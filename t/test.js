
const clean_plugin = require('./../built/plugin-clean-location').default
var toTree = require('../built/').toTree
 const cleanTree = toTree().use(clean_plugin)
const allFixtures  = require('./load-fextures').allFixures

describe("run parser tests", () => {
    allFixtures.map(i => test(i.file, ()=>expect(cleanTree.parse(i.text)).toEqual( i.tree)))
})