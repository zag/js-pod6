
function thisFunc ( rules )  {

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
            // try to find next rule
            const nextRuleSet = reversed.slice(ruleIndex+1)
            const nextRuleIndex = nextRuleSet.findIndex( rule => rule.isFor(node) )
            const defaultFn = ( n = node, ctx = context, localInterator = interator ) => {
                if (nextRuleIndex !== -1 ){
                    nextRuleSet[nextRuleIndex].fn( n, ctx, localInterator, ()=>{/* empty default action */})
                } else {
                    return
                }
            }
            reversed[ruleIndex].fn( node, context, interator, defaultFn)
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
export default  thisFunc