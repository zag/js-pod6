'use strict'
var fcparser = require("../src/grammarfc");
const makeTransformer = require('./helpers/makeTransformer')
const makeAttrs = require('./helpers/config').makeAttrs
const fcmap = require('./fc-grammars')

/**
 *  Main transforms
 */

module.exports = () =>( tree )=>{
  
  const transformerBlocks = makeTransformer({
  ':para' : (n, ctx, visiter) => {
      return makeTransformer({
        ':text' : ( n, ctx ) => { return fcparser.parse(n.value) },
        ':verbatim': ( n, ctx ) => { return fcparser.parse(n.value) },
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
      // get parser
      const parser = ( allowValues.length == 0 ) 
                            ? fcparser 
                            : fcmap[ allowValues.sort().join('') ]
      return makeTransformer({
        ':verbatim' : ( n, ctx ) => {return parser.parse(n.value) },
        ':text' : ( n, ctx ) => {return parser.parse(n.value) },
      })(n,{ ...ctx })
    },
  })
  return transformerBlocks(tree,{})
}

