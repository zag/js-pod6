/**
 * Default writer 
 */

'use strict'
const util = require('util')
const Events = require('events')

function Writer( output ){
    Events.apply(this)
    // save X<> entries
    this.INDEXTERMS = []
    // save N<> annotates
    this.FOOTNOTES = []
    this.output = output
    // escape function for output
    this.escape = (p)=>p
    // write with escape special symbols
    this.write = (p) => { this.writeRaw(this.escape(p)) }
    // raw write as is
    this.writeRaw  = (str) => { 
        if ( 'function' === typeof this.output ) {
                    this.output(str)
        } else {
            console.log(str) 
        }
    }
    this.getStr = () => {
        return {
            errors : this.errors,
           toString: () => this.out,
           valueOf: () => this.out
        }
    }
    this.startWrite = () => {
        // setup events
         ( this.ons || [] ).map( a=>Events.prototype.on.call( this, ...a ) )
        this.emit('start')
        this.addListener('errors', (err)=>{ this.errors.push(err); console.log({err1:err})})
    },
    this.on = () => {
        // overload 'on' method for reverse setup handlers
        this.ons = this.ons || []
        this.ons.unshift( [ ...arguments ] )
    }
    this.endWrite = () => {
        this.emit('end')
    }
}
util.inherits(Writer, Events)

module.exports = Writer