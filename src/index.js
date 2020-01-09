'use strict'
var parser = require('./grammar')
var vmargin_plug = require( './plugin-vmargin' )
var formattingCodes_plug = require( './plugin-formatting-codes' )
var items_plug = require('./plugin-items')
var heading_plug = require('./plugin-heading')


function makeTree () {
    var plugins = []
    chain.use = use
    chain.parse = parse
    chain.use(vmargin_plug)
    chain.use(items_plug)
    chain.use(heading_plug)
    chain.use(formattingCodes_plug)
    return chain
    function chain() {
        return 
    }
    function use(plugin) {
        plugins.push(plugin)
        return chain
    }
    function parse ( src , opt ={skipChain:0} ) {
        let tree = parser.parse( src )
        if (!opt.skipChain) {
            for (let i = 0 ; i < plugins.length; i++ ) {
                const plugin = plugins[i]
                // init
                const visitor = plugin( opt )
                // process tree
                tree = visitor(tree)
            }
        }
        return tree
    }
}

module.exports = makeTree()
