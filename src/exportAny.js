'use strict'
const Events = require('events')
const parse = require('.').parse
const { makeRule, makePlug } = require('./helpers/makeQuery')
const makeInterator = require('./helpers/makeInterator')
const Writer = require('./writer')

const toAny = ( options = {}, plugins = [] ) => {
    let fns = plugins
    // setup pod6 processor
    const processor = options.processor || parse
    const _writer  = options.writer 
    chain.use = use
    chain.run = run
    chain.getPlugins = () => fns
    return chain
    function chain (root) {

    }
    
    function use( key, fn ) {
      if ( key instanceof Array ) {
         return toAny( options, [...fns, ...fn] )
      }
    
      if ( key instanceof Object ) {
        for ( var prop in key ) {
             if ( key.hasOwnProperty(prop) ) {
                use( prop, key[prop] )
            }
        }
        return chain
      }
      fns.push( makeRule( makePlug(key), fn ) )
      return chain
    }

    function run(src, opt_writer) {

        let res = ''
        const _tmp_writer = opt_writer || _writer || new Writer((s)=>{ res = res + s})
        const writer = ('function' === typeof _tmp_writer ) ? new _tmp_writer((s)=>{ res = res + s}) : _tmp_writer

        // make new instance of HTML with initialized plugins
        // reverse init
        let newFns = fns.slice()
        newFns.reverse()
        const interator = makeInterator(
            newFns.map(
                rule=>makeRule( rule.rule, rule.fn( writer, processor ) ) 
            ).reverse()
        )
        const tree = processor(src)
        const context = {}
        writer.startWrite()
        interator( tree, context )
        writer.endWrite()
        return {
           errors : writer.errors,
           toString: () => res,
           valueOf: () => res,
           indexingTerms: writer.INDEXTERMS,
           annotations: writer.FOOTNOTES,
        }
    }
}

module.exports = toAny