'use strict'
var fcparser = require("../src/grammarfc");
module.exports = () =>( tree )=>{
    const visit = ( node )=>{
        if ( Array.isArray( node ) ) {
            node.forEach( i => { visit(i) } )
        } else {
          if ( node.type === 'block' ) {
            visit( node.content )
          } else if ( node.type === 'para' ) {
             // parse text filed for para blocks
              node.content = fcparser.parse( node.text )
          }
        }
      }
    visit(tree)
    return tree
}

