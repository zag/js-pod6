var fcparser = require("./grammarfc");
import makeTransformer from './helpers/makeTransformer'
import { isNamedBlock } from './helpers/makeTransformer'
import makeAttrs from './helpers/config'
import { Plugin, Node, nPara , AST, nText, nVerbatim } from './'


/**
 *  Main transforms
 */
interface MakeTransformerParams {
  [name: string] : ( n:Node, ctx: any, visiter?: any) => any
}

const middle:Plugin = () =>( tree )=>{
  
  const transformerBlocks = makeTransformer({
  ':para' : (n, ctx, visiter) => {
      return makeTransformer({
        ':text' : ( n:nText, ctx ) => { return fcparser.parse( n.value ) },
        ':verbatim': ( n:nVerbatim, ctx ) => { return fcparser.parse( n.value ) },
      })(n,{ ...ctx })
      return n
    },
  ':block' : (n, ctx, visiter) => {
     // only =pod may have childs blocks
      if ( "name" in n &&  n.name === 'pod' ) return {
            ...n,
            content:visiter(n.content, ctx, visiter)
        }
      const conf = makeAttrs(n, ctx)
      const isCodeBlock = "name" in n && n.name === 'code'
      const isDataBlock = "name" in n && n.name === 'data'
      const allowValues = conf.getAllValues('allow')
      // for code block not parse content by default
      if ((isCodeBlock || isDataBlock ) && allowValues.length == 0) return n
      const allowed = allowValues.sort()
      
      // this prevent from parsing content of named blocks
      if ( isNamedBlock(n.name) ) {
        return n
      }
      
      return makeTransformer({
        ':verbatim' : ( n:nVerbatim, ctx ) => { return fcparser.parse( n.value, { allowed } ) },
        ':text' : ( n:nText, ctx ) => { return fcparser.parse( n.value, { allowed } ) },
      })(n,{ ...ctx })
    },
  })
  return transformerBlocks(tree,{})
}
export default middle

