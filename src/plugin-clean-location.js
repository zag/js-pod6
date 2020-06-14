/**
 * Delete location attribute 
 * use in test suite
 */
'use strict'
const makeTransformer = require('./helpers/makeTransformer')
module.exports = () =>( tree )=>{
  const transformer = makeTransformer({'*' : (node, ctx, visiter) => {
    if ( node.content ) {
      node.content = visiter(node.content, ctx, visiter)
    }
    delete node.location
    return node
  }})
  return transformer(tree)
}

