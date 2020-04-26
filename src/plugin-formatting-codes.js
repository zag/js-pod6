'use strict'
var fcparser = require("../src/grammarfc");
const makeTransformer = require('./helpers/makeTransformer')
const makeAttrs = require('./helpers/config').makeAttrs

/**
 *  Main transforms
 */

module.exports = () =>( tree )=>{
  
  const transformerBlocks = makeTransformer({
  ':para' : (n, ctx, visiter) => {
      return makeTransformer({
        ':text' : ( n, ctx ) => { return fcparser.parse( n.value ) },
        ':verbatim': ( n, ctx ) => { return fcparser.parse( n.value ) },
      })(n,{ ...ctx })
      return n
    },
  ':block' : (n, ctx, visiter) => {
     // only =pod may have childs blocks
      if ( n.name === 'pod' ) return {
            ...n,
            content:visiter(n.content, ctx, visiter)
        }
      const conf = makeAttrs(n, ctx)
      const isCodeBlock = n.name === 'code'
      const allowValues = conf.getAllValues('allow')
      // for code block not parse content by default
      if (isCodeBlock && allowValues.length == 0) return n
      const allowed = allowValues.sort()
      return makeTransformer({
        ':namedBlock': ( n, ctx ) => n, // this prevent from parsing content of named blocks
        ':verbatim' : ( n, ctx ) => { return fcparser.parse( n.value, { allowed } ) },
        ':text' : ( n, ctx ) => { return fcparser.parse( n.value, { allowed } ) },
      })(n,{ ...ctx })
    },
  })
  return transformerBlocks(tree,{})
}

