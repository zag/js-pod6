/**
 * Delete location attribute 
 * use in test suite
 */
import makeTransformer from './helpers/makeTransformer'

export default () =>( tree )=>{
  const transformer = makeTransformer({'*' : (node, ctx, visiter) => {
    if ( node.content ) {
      node.content = visiter(node.content, ctx, visiter)
    }
    delete node.location
    return node
  }})
  return transformer(tree, {})
}

