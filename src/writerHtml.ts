/**
 * HTML writer 
 */

import Writer from './writer'
class WriterHTML extends Writer {
    constructor (output?) {
        super(output)
    }
    escape( string ){
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
    
}
export default WriterHTML