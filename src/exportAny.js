'use strict'
const Events = require('events')
const parse = require('.').parse
const { makeRule, makePlug } = require('./helpers/makeQuery')

const toAny = ( options = {}, plugins = [] ) => {
    let fns = plugins
    // setup pod6 processor
    const processor = options.processor || parse
    chain.use = use
    chain.run = run
    chain.interator = interator
    chain.getPlugins = () => fns
    return chain
    function chain (root) {
        return interator(root)
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
    
    function interator (node, context)  {
        if (node instanceof Array) {
            return node.map( item => interator(item, context) )
        }
        if ( 'string' === typeof node ) {
            // convert sunply text to para
            return interator({type:'text', value:node}, context)
        }
        // get first rule for this node
        const reversed = fns.slice()
        reversed.reverse()
        const ruleIndex = reversed.findIndex( rule => rule.isFor(node) )
        if (ruleIndex !== -1 ){
            reversed[ruleIndex].fn( node, context, interator )
        } else {
            // not found rule
            const newNode = { ...node }
            if ( newNode.hasOwnProperty('content') ) {
                interator( newNode.content, context )
            }
        }
    }

    function makeMixin (o) {
        return Object.assign({out:'', name:'test'},  Events.prototype, o)
    }

    function run(src) {
        const Writer = {
            write(str) {
                this.out += str
            },
            getStr() {
                return this.out
            },
            startWrite(){
                // setup events
                 (this.ons || [] ).map( a=>Events.prototype.on.call( this, ...a ) )
                this.emit('start')
            },
            on(){
                // overload 'on' method for reverse setup handlers
                this.ons = this.ons || []
                this.ons.unshift( [ ...arguments ] )
            },
            endWrite(){
                this.emit('end')
            },
        }
    
        const writer = makeMixin(Writer)
        // make new instance of HTML with initialized plugins
        // reverse init
        let newFns = fns.slice()
        newFns.reverse()
        const inited = toAny( 
                            options,
                            newFns.map(
                                    rule=>makeRule( rule.rule, rule.fn( writer, processor ) ) 
                                    ).reverse()
                            )
        const tree = processor(src)
        const context = {}
        writer.startWrite()
        inited.interator( tree, context )
        writer.endWrite()
        return writer.getStr()
    }
}

module.exports = toAny