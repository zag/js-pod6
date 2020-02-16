'use strict'
const toAny = require('./exportAny')
const { subUse, wrapContent, emptyContent, content, setFn, setContext } = require('../src/helpers/handlers')

    
const toHtml = ( opt ) => toAny( opt ).use(
    '*', ( writer, processor ) => ( node, ctx, interator ) => {
            const nodeName = node.name || ''
            // skip warnings for semantic blocks
            const isSemanticBlock = ( node ) => { 
                const name = node.name || ''
                const isTypeBlock = ( node.type || '') === 'block'
                return isTypeBlock && name === name.toUpperCase()
            }

            if ( !isSemanticBlock(node) )  console.warn("Unhandled node" + JSON.stringify( node, null, 2))
            if ( node.hasOwnProperty('content')) {
                interator(node.content, ctx)
            }
        }
    ).use({
        ':text': ( writer, processor )=>( node, ctx, interator )=>{
            // handle text with content
            if (node.value) {
                writer.write( node.value )
            } else { interator( node.content, ctx ) }
        },
            
        // Formatting codes
        'C<>': wrapContent('<code>','</code>'),
        'B<>': wrapContent('<strong>','</strong>'),
        'I<>': wrapContent('<em>','</em>'),
        'R<>': wrapContent('<var>','</var>'),
        "L<>": setFn(( node, ctx ) => {
            let { meta } = node
            if ( meta === null) {
                meta = node.content
            }
            return  wrapContent( `<a href="${meta}">`, `</a>` )
        }),
        "S<>":( writer, processor ) => ( node, ctx, interator ) => {
            const content = node.content || ''
            const spaces = content.replace(/ /g, '&nbsp;')
            const newFeed = spaces.replace(/\n/g, '</br>')
            writer.write(newFeed)
        },
        'V<>': content,
        'Z<>': emptyContent,
        'pod': content,
        ':code': wrapContent('<code><pre>', '</pre></code>'),
        'code': wrapContent('<code><pre>', '</pre></code>'),
        ':verbatim': ( writer, processor ) => ( node, ctx, interator ) => { 
            if (node.error) {
                console.log('err')
                writer.emit("errors", node.location )
            }
            interator( node.value ) 
        },
        ':blankline': emptyContent,
        ':config': emptyContent,
        // block =para
        'para': content,
        ':para':wrapContent('<p>', '</p>'),
        //Named blocks for which no explicit class has been defined or loaded are
        //usually not rendered by the standard renderers.
        ':namedBlock':emptyContent,
        'head:block': subUse({
                           // inside head don't wrap into <p>
                                ':para' : content,
                            },
                            setFn(( node, ctx ) => {
                                const {level} = node
                                return wrapContent( `<h${level}>`, `</h${level}>` )
                            })
                        ),
        ':list': setFn(( node, ctx ) => 
                        node.list === 'ordered' ? wrapContent('<ol>', '</ol>') 
                                                : node.list ===  'variable' ? wrapContent('<dl>', '</dl>') 
                                                                            : wrapContent('<ul>', '</ul>')
                        ), 
        'item:block':  ( writer, processor ) => ( node, ctx, interator ) => {
            // make text from first para
            if (! (node.content instanceof Array)) {
                console.log(node)
            }
            const [ firstPara, ...other ] = node.content
            writer.write('<li>')
            // TODO: get cases for handle first para in items
            // interator([...firstPara.content, ...other], ctx)
            interator(node.content, ctx)
            writer.write('</li>')
        },
        'comment:block': emptyContent,
        'defn':wrapContent('','</dd>'),
        'term:para': wrapContent('<dt>','</dt><dd>'),
        // TODO: handle levels of nesting
        'nested':wrapContent('<blockquote>', '</blockquote>'),
        // table section
        'table:block' : 
              subUse({
                        // TODO: rename table's 'head' to table-head
                        'head': subUse({
                                            'column': wrapContent('<th>','</th>')
                                        },
                                        wrapContent('<tr>','</tr>')
                                        )},
                        wrapContent('<table>','</table>')
                    ),
        ':separator' : emptyContent,

         'row':wrapContent('<tr>','</tr>'),
         'column':wrapContent('<td>','</td>'),
 
        })

module.exports = toHtml