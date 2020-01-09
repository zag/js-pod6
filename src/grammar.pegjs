
{
  // the following names: MyBlock, myBlock are use for extending pod6
  function isNamedBlock(name) {
    return (
        name !== name.toLowerCase() 
            && 
        name !== name.toUpperCase() 
      )
  }
}

Document = nodes:Element*  { return  nodes }

Element =  delimitedBlockRaw  
         / delimitedBlock
         / paragraphBlockRaw 
         / paragraphBlock 
         / abbreviatedBlock 
         / textBlock 
         / blankline

/**
U+0020 SPACE
U+00A0 NO-BREAK SPACE
U+0009 CHARACTER TABULATION
U+2001 EM QUAD
U+2008 PUNCTUATION SPACE
*/


hs = [ \u00a0\u2001\t\u000C\u2008]
_ = [ \t\u000C]*
Endline = $(hs* [\n\r])

LineOfText = text:$(char+) EOL
   { return text }

// char =  [a-z =0-9.<>]
char = [^\n\r]
newline = '\n' / '\r' '\n'?
EOL = newline / !.
emptyline = $(hs* [\n\r])
blankline = $( hs* [\n\r]) { return { type:'blankline'}}
markerBegin = '=begin '
markerEnd = '=end '
markerFor = '=for '
markerAbbreviatedBlock = '=' name:identifier  { return name }
markers = markerBegin / markerEnd / markerFor 
Text "text" = $(c:char+)
text_content =  !( _ ( markers / markerAbbreviatedBlock ) / blankline ) $(Text)+ EOL {return text()}
/** TODO:
boolean:          C«:key(1)»   C«key => 1»
Hash              C«:key{a=>1, b=>2}»,  C«key => {a=>1, b=>2}»
*/
attributes =  _ ':' isFalse:[!]? key:identifier value:(
  
  '[' _ array:array_comma _ ']'  { return { value:array, type:"array"}}
  /
  '<' _ array:array_sp _ '>'  { return { value:array, type:"array"}}
  / 
  '(' _ text:item _')' { return { value:text, type:"value"}}
  / _ 
  {return { value:!isFalse, type:"boolean"}}
)  _  {return { name:key, ...value}}

attributes_block = 
  first:attributes* newline 
  cont:("=" _ rest:attributes+ _ newline { return rest })*  {return [...first, ...cont]}

// :test :!test 
// :key[1,2,3]
string = text:$([^'"]+){ return text}
digits = $([0-9]+)

item =  // quoted strings
        ["] text:$([^"]+) ["] { return text} /
        ['] text:$([^']+) ['] { return text} /
        // number
        number:digits { return parseInt(number,10) } 

array_comma = first:item _ rest:(","_ i:(item)* {return i[0] } )+ {return [first, ...(rest.filter( (i)=> i !== null))] }/ res:item {return  [res]} / _ {return []}

array_sp = all:( _ i:item _ {return i})* { return all }/ res:item {return  [res]} / _ {return []}
delimitedBlockRaw = 
    vmargin:$(_) 
    markerBegin name:identifier _ attr:attributes_block 
    &{  
     return ( 
       (name.match(/code|comment/))
        || 
       (
        name !== name.toLowerCase() 
            && 
        name !== name.toUpperCase() 
       )
      )
     }
  
content:$( 
         !markers t:Text Endline? 
          / empty:emptyline + { return {text: text(), type: "ambient"}} 
          / !markerEnd $(.)
          )+ 
vmargin2:$(_) res:( 
                    markerEnd ename:identifier &{ return name === ename } Endline? 
                    { 
                      const type = isNamedBlock(name) ? 'namedBlock' : 'block'
                      return {
                              type:type,
                              content:[{text:content}],
                              name 
                             }
                    } 
              ) &{return  true || vmargin === vmargin2} { return { ...res, text:text() , attr }}

delimitedBlock = 
  vmargin:$(_) markerBegin name:identifier  _ attr:attributes_block
  content:( nodes:(
          blankline
          / delimitedBlockRaw
          / delimitedBlock
          / paragraphBlockRaw 
          / paragraphBlock 
          / abbreviatedBlock 
          ) & { return true || name == name.toUpperCase() } { return nodes} 
  / tvmargin:$( hs* ) 
    text:$(text_content+)
    {
      const type = name.match(/pod|nested|item|code|defn/) 
                  && 
                  (tvmargin.length - vmargin.length) > 0 ? 'code' : 'para'
      return {
              text, 
              margin:tvmargin,
              type,
              content: [
                        {
                          type: type === 'code' ? 'verbatim' : 'text',
                          value:text
                        }
                       ],
              }
    }
  )* 
  vmargin2:$(_) res:( 
          markerEnd ename:identifier &{ return name === ename } Endline? 
          { 
            return { 
                    type:'block',
                    content,
                    name,
                    margin:vmargin
                  }
          } 
          ) 
          // TODO: fix this 
          &{return  true || vmargin === vmargin2} 
          { 
            return { 
                    ...res,
                    text:text(),
                    attr 
                    }
          }

textBlock = ( text_content )+ { return { text: text(), type: "text"}}
ambientBlock = line:(emptyline { return  {empty:1}}/ [\s]+ / text_content )+ { return { text: text(), type: "ambient1"}}

abbreviatedBlock = 
  vmargin:$(_) !markers 
  name:markerAbbreviatedBlock _ emptyline* 
  content:$(!emptyline text:text_content )*
  { 
    return {
            margin:vmargin,
            type:'block',
            content: content === "" ? [] 
                                    : [
                                        {
                                          type:'para',
                                          text:content,
                                          margin: '',
                                          content:[ 
                                                    {
                                                      type:'text',
                                                      value:content
                                                    }
                                                  ],
                                        }
                                      ],
            name
          }
  } 
paragraphBlockRaw = 
  vmargin:$(_) 
  marker:markerFor  name:identifier _ attr:attributes_block
      &{  
     return ( 
       name !== name.toLowerCase() 
        && 
        name !== name.toUpperCase() )
     }
  content:$(!emptyline text_content)*
  { 
      return { 
              type:'blockNamed',
              content: content === "" ? [] : [{text:content}],
              name,
              margin:vmargin,
              attr
            }
  } 

paragraphBlock = 
  vmargin:$(_) 
  marker:markerFor  name:identifier _ attr:attributes_block
  content:$(!emptyline text_content)*
  { 
      return { 
              type:'block',
              content: content === "" ? [] 
                                    : [
                                        {
                                          type:'para',
                                          content:[ 
                                                    {
                                                      type:'text',
                                                      value:content
                                                    }
                                                  ],
                                          margin:vmargin,
                                          text:content
                                        }
                                      ],
              name,
              margin:vmargin,
              attr
            }
  } 

identifier = $([a-zA-Z][a-zA-Z0-9_-]+)

___ "whitespace"
  = [\r\n \t\u000C]*

__ "space characters"
  = [\r\n \t\u000C]*



