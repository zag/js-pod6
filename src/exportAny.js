'use strict'
const Events = require('events')
const parse = require('.').parse
const { makeRule, makePlug } = require('./helpers/makeQuery')
const makeInterator = require('./helpers/makeInterator')

const toAny = ( options = {}, plugins = [] ) => {
    let fns = plugins
    // setup pod6 processor
    const processor = options.processor || parse
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
    
   
    function makeMixin (o) {
        return Object.assign({out:'', errors: [], name:'test'},  Events.prototype, o)
    }

    function run(src) {
        const Writer = {
            write(str) {
                this.out += str
            },
            getStr() {
                // let str = this.out
                // str.error = this.errors
                // return str
                return {
                    errors : this.errors,
                //    out : this.out,
                   toString: () => this.out,
                   valueOf: () => this.out
                }
            },
            startWrite(){
                // setup events
                 (this.ons || [] ).map( a=>Events.prototype.on.call( this, ...a ) )
                this.emit('start')
                this.addListener('errors', (err)=>{ this.errors.push(err); console.log({err1:err})})
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
        return writer.getStr()
    }
}

module.exports = toAny