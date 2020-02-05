'use strict'

module.exports  = ( rules ) => {

    function interator (node, context)  {
        if (node instanceof Array) {
            return node.map( item => interator(item, context) )
        }
        if ( 'string' === typeof node ) {
            // convert string to lex node with type 
            return interator({type:'text', value:node}, context)
        }
        // get first rule for this node
        const reversed = rules.slice()
        reversed.reverse()
        const ruleIndex = reversed.findIndex( rule => rule.isFor(node) )
        if (ruleIndex !== -1 ){
            reversed[ruleIndex].fn( node, context, interator )
        } else {
            // not found rule
            const newNode = { ...node }
            if ( newNode.hasOwnProperty('content') ) {
                interator( newNode.content, context )
            }
        }
    }
    interator.rules = rules
    return interator
}