'use strict'
/**
 * wrap content by open and closed tags
 */
exports.wrapContent = 
    ( pre, post ) => 
        ( writer, processor ) => 
            ( node, ctx, interator )=>
                {
                    writer.write(pre) 
                    interator( node.content, ctx )
                    writer.write(post) 
                }
/**
 * emptyContent - skip any child node
 */
exports.emptyContent = () => () => ()=>{}
/**
 * content - process childs as regular content 
 */
exports.content = (writer, processor)=>(node,ctx, interator)=>{interator(node.content, ctx)}

/** 

Set hander after call with node

':para':setFn((node,ctx) => (ctx.parents || [] ).includes('head') ? content : wrapContent('<p>','</p>'),

*/
exports.setFn = ( check ) => ( writer, processor ) => {
    return ( node, ctx, interator ) =>{
        check( node, ctx )( writer, processor )( node, ctx, interator )
    }
}

/** 

Set new context for handler 

        const parents = (ctx.parents || [])
        parents.push('head')
        const {level} = node
        return setContext( { ...ctx, parents }, wrapContent(`<h${level}>`,`</h${level}>`))

*/

exports.setContext = ( ctx, fn ) => ( writer, processor ) => {
    return ( node, _, interator ) => {
        return fn( writer, processor )( node, ctx, interator )
       }
}

/**
 * Select handler from already inited wrappers
 * 
 * @param {*} check 
 * @param  {...any} fns 
 */
const IfNode = ( check, ...fns ) => ( writer, processor ) => {
    return ( node, ctx, interator ) =>{
        check( node, ctx, ...fns.map( i => i( writer, processor ) ) )( node, ctx, interator )
    }
}