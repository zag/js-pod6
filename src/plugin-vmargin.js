'use strict'
module.exports = () =>( tree )=>{
    const visit_node = ( node, context = {} ) => {

        if( (node.type || "").match(/(code|text)/) ) {
            if ( node.margin && context.margin && context.margin.length > 0 && context.margin.length == node.margin.length ) {
                node.type='para'
            }
            if ( node.type === 'code') {
            // remove parent margin
               var regex = new RegExp(`^[ \t]{0,${node.margin.length}}`,'gm');
               node.text = node.text.replace(regex, '')
            }
        }
       if (node.type === 'block') {
               context.margin = typeof node.margin !== 'string' ? '' : node.margin
               let newctx = {...context}
               newctx.nest = (newctx.nest || 0) + 1
               node.content.map(( n )=>{ 
                   visit_node(n, context )
                })
       }
    }
    var ctx = {}
    tree.forEach( (n) => visit_node(n, ctx) )
    return tree
}
