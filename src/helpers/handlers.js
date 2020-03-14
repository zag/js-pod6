'use strict'
const { makeRule, makeRulesArray } = require('./makeQuery')
const makeInterator = require('./makeInterator')

/**
 * wrap content by open and closed tags
 */
exports.wrapContent = 
    ( pre, post ) => 
        ( writer, processor ) => 
            ( node, ctx, interator )=>
                {
                    writer.writeRaw(pre) 
                    if (node.content) interator( node.content, ctx )
                    writer.writeRaw(post) 
                }
/**
 * emptyContent - skip any child node
 */
exports.emptyContent = () => () => ()=>{}
/**
 * content - process childs as regular content 
 */
exports.content = ( writer, processor )=>( node,ctx, interator )=>{ node.content && interator(node.content, ctx) }

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

/**
 * Make subset of rules for processing
 * 
 * @param {*} rules 
 * @param {*} processNode 
 */
exports.subUse = ( rules, processNode ) => {
    const newFns = makeRulesArray(rules).reverse()
    return ( writer, processor ) => {
        // init new rules
        const inited = newFns.map(
                                    item=>makeRule( item.rule, item.fn( writer, processor ) ) 
                                ).reverse()
        const processNodeInited = processNode( writer, processor )
        let subInterator ;
        return ( node, ctx, interator ) => {
            if ( !subInterator ) subInterator = makeInterator([ ...interator.rules, ...inited ])
            processNodeInited( node, ctx, subInterator )
        }
     }
}