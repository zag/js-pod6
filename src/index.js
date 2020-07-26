'use strict'
var parser = require('./grammar')
var vmargin_plug = require( './plugin-vmargin' )
var formattingCodes_plug = require( './plugin-formatting-codes' )
var itemsNumbering_plug = require('./plugin-items')
var heading_plug = require('./plugin-heading')
var defnGroup_plug = require('./plugin-group-defn')
var itemsGroup_plug = require('./plugin-group-items')
var defnTerms_plug = require('./plugin-defn-fill-term')
var table_plug = require('./plugin-tables')
var version = require('../package.json').version

function makeTree () {
    var plugins = []
    chain.use = use
    chain.parse = parse
    chain.use( vmargin_plug )
    chain.use( itemsNumbering_plug )
    chain.use( heading_plug )
    chain.use( defnTerms_plug )
    chain.use(table_plug)
    chain.use( formattingCodes_plug )
    
    // save order for the next two plugins
    chain.use( itemsGroup_plug )
    chain.use( defnGroup_plug )
    return chain

    function chain() {
        return 
    }

    function use( plugin ) {
        plugins.push( plugin )
        return chain
    }
    
    function parse ( src , opt = {skipChain:0, podMode:1} ) {
        let tree = parser.parse( src ,{podMode:opt.podMode})
        if ( !opt.skipChain ) {
            for ( let i = 0 ; i < plugins.length; i++ ) {
                const plugin = plugins[i]
                // init
                const visitor = plugin( opt )
                // process tree
                tree = visitor( tree )
            }
        }
        return tree
    }
}

module.exports.toTree = makeTree
module.exports.parse = makeTree().parse
module.exports.toHtml = require('./exportHtml')
module.exports.version = version


