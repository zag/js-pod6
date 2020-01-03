'use strict'
var fcparser = require("../src/grammarfc");
module.exports = () =>( tree )=>{
    const visit = (node)=>{
        if ( Array.isArray(node) ) {
            node.forEach( i => { visit(i)})
        } else {
          if (node.type === 'block') {
            visit(node.content)
          } else if (node.type === 'text') {
              node.content = fcparser.parse(node.text)
          }
        }
      }
    visit(tree)
    return tree
}

