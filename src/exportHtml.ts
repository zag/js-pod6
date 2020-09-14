import toAny from './exportAny'
import { subUse, wrapContent, emptyContent, content, setFn, setContext } from './helpers/handlers'
import  makeAttrs  from './helpers/config'
import htmlWriter from './writerHtml'
import clean_plugin from './plugin-clean-location'

const rules = {
    ':text': ( writer, processor )=>( node, ctx, interator )=>{
        // handle text with content
        if (node.value) {
            writer.write( node.value )
        } else { interator( node.content, ctx ) }
    },
        
    // Formatting codes
    'A<>': ( writer, processor ) => ( node, ctx, interator ) => {
        //get replacement text
        if (! (ctx.alias && ctx.alias.hasOwnProperty(node.content)) ) {
            writer.write(`A<${node.content}>`)
        } else {
            const src = ctx.alias[ node.content ].join('\n')
            const tree_1 = processor( src )
            // now clean locations
            const tree = clean_plugin()(tree_1)
            if ( tree[0].type === 'para') {
                interator( tree[0].content, ctx )
            } else {
                interator( tree, ctx )
            }
        }
    },
    'C<>': wrapContent('<code>','</code>'),
    'B<>': wrapContent('<strong>','</strong>'),
    'I<>': wrapContent('<em>','</em>'),
    'R<>': wrapContent('<var>','</var>'),
    'K<>': wrapContent('<kbd>','</kbd>'),
    "L<>": setFn(( node, ctx ) => {
        let { meta } = node
        if ( meta === null) {
            meta = node.content
        }
        return  wrapContent( `<a href="${meta}">`, `</a>` )
    }),

    /**
     * CSS rules for footnotes
     
    .footnote a {
        text-decoration: none;
    }
    .footnotes {
    border-top-style: solid;
    border-top-width: 1px;
    border-top-color: #eee;
    }
     */
    'N<>' : ( writer, processor ) => {
        // console.log({writer})
        writer.addListener('end', ()=>{
            if ( !writer.hasOwnProperty('FOOTNOTES') ) { return }
            const footnotes = writer.FOOTNOTES
            if ( footnotes.length < 1 ) { return } // if empty footnotes
            writer.writeRaw(`<div class="footnotes">`)
            footnotes.map((footnote) =>{
               writer.writeRaw(`<p><sup id="${footnote.fnId}" class="footnote"><a href="#${footnote.fnRefId}">[${footnote.gid}]</a></sup> `)
               footnote.make()
               writer.writeRaw(`</p>`)
            })
           writer.writeRaw(`</div>`)
           
        })
        return ( node, ctx, interator ) => {
            // skip empty notes
            if ( node.content.length < 1 ) { return }
            if ( !writer.hasOwnProperty('gid') ) { writer.gid = 1}
            // get foot note id
            const gid = writer.gid++
            const fnRefId = `fnref:${gid}`
            const fnId = `fn:${gid}`
            writer.writeRaw(`<sup id="${fnRefId}" class="footnote"><a href="#${fnId}">[${gid}]</a></sup>`)
            if ( !writer.hasOwnProperty('FOOTNOTES') ) { writer.FOOTNOTES = []}
            writer.FOOTNOTES.push({
                gid,
                fnRefId,
                fnId,
                make: ( )=>{ interator(node.content, ctx) }
            })
        }
    },
    'S<>':( writer, processor ) => ( node, ctx, interator ) => {
        const content = node.content || ''
        const spaces = content.replace(/ /g, '&nbsp;')
        const newFeed = spaces.replace(/\n/g, '</br>')
        writer.writeRaw(newFeed)
    },
    'T<>': wrapContent('<samp>','</samp>'),
    'U<>': wrapContent('<u>','</u>'),
    'V<>': content,
    'X<>' : ( writer, processor ) => ( node, ctx, interator ) => {
        interator(node.content, ctx)
        let entry = { node }
        if ( entry === null && node.content.length > 0) {
            //@ts-ignore
             entry = [node.content[0]]
        } else { return }
        if ( !writer.hasOwnProperty('INDEXTERMS') ) { writer.INDEXTERMS = []}
         writer.INDEXTERMS.push({
            entry
         })
     },
    'Z<>': emptyContent,
    'pod': content,
    ':code': wrapContent('<pre><code>', '</code></pre>'),
    'code': wrapContent('<pre><code>', '</code></pre>'),
    ':verbatim': ( writer, processor ) => ( node, ctx, interator ) => { 
        if (node.error) {
            console.error('err')
            writer.emit("errors", node.location )
        }
        interator( node.value ) 
    },
    ':blankline': emptyContent,
    ':ambient': emptyContent,
    // Directives 
    ':config': setFn(( node, ctx ) => {
        // setup context
        if ( ! ctx.hasOwnProperty('config') ) ctx.config = {}
        //collect configs in context
        ctx.config[node.name] = node.config
        return emptyContent}),
    ':alias': setFn(( node, ctx ) => {
        // set alias
        if ( ! ctx.hasOwnProperty('alias') ) ctx.alias = {}
        //collect configs in context
        ctx.alias[node.name] = node.replacement
        return emptyContent}),
    
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
            console.error(node)
        }
        const [ firstPara, ...other ] = node.content
        writer.writeRaw('<li>')
        // TODO: get cases for handle first para in items
        // interator([...firstPara.content, ...other], ctx)
        interator(node.content, ctx)
        writer.writeRaw('</li>')
    },
    'comment:block': emptyContent,
    'defn':wrapContent('','</dd>'),
    'term:para': wrapContent('<dt>','</dt><dd>'),
    // TODO: handle levels of nesting
    'nested': wrapContent('<blockquote>', '</blockquote>'),
    'output': wrapContent('<blockquote><pre><samp>', '</samp></pre></blockquote>'),
    'input': wrapContent('<blockquote><pre><kbd>', '</kbd></pre></blockquote>'),
    // table section
    'table:block' : 
          subUse({
                    // TODO: rename table's 'head' to table-head
                    'head': subUse({
                                        'column': wrapContent('<th>','</th>')
                                    },
                                    wrapContent('<tr>','</tr>')
                                    )},
                     ( writer, processor ) => ( node, ctx, interator ) => {
                            const conf = makeAttrs(node, ctx)
                            writer.writeRaw('<table>')
                            if ( conf.exists('caption') ) {
                                writer.writeRaw('<caption>')
                                writer.write(conf.getFirstValue('caption'))
                                writer.writeRaw('</caption>')
                            }
                            interator(node.content, ctx)
                            writer.writeRaw('</table>')
                    }
                ),
    ':separator' : emptyContent,
     'row':wrapContent('<tr>','</tr>'),
     'column':wrapContent('<td>','</td>'),

    } 

    const toHtml = ( opt ) => toAny( { writer:htmlWriter, ...opt } ).use(
    '*', ( writer, processor ) => {  return  ( node, ctx, interator ) => {
            const nodeName = node.name || ''
            // skip warnings for semantic blocks
            const isSemanticBlock = ( node ) => { 
                const name = node.name || ''
                const isTypeBlock = ( node.type || '') === 'block'
                return isTypeBlock && name === name.toUpperCase()
            }

            if ( isSemanticBlock(node) ) { 
                const name  = node.name
                writer.writeRaw('<h1 class="')
                writer.write( name )
                writer.writeRaw('">')
                writer.write (name )
                writer.writeRaw('</h1>')
            } else {
                 console.warn("Unhandled node" + JSON.stringify( node, null, 2))
                }
            if ( node.hasOwnProperty('content')) {
                interator(node.content, ctx)
            }
        }
    }
    ).use(rules)

export default toHtml
//module.exports.default = toHtml