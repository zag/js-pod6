/**
 * HTML writer 
 */

'use strict'
const util = require('util')
const ParentWriter = require('./writer')
const escape = ( string ) => {
    const HTML_CHARS = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        '/': '&#x2F;',
        '`': '&#x60;'
    }
    return ( string + '' ).replace( /[&<>"'\/`]/g, ( match ) => HTML_CHARS[match] );
}

function WriterHTML(){
    ParentWriter.apply(this, arguments)
    // escape function for output
    this.escape = escape
}

util.inherits(WriterHTML, ParentWriter)

module.exports = WriterHTML