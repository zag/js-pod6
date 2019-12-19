
Document = nodes:Element*  { return  nodes }

Element =  delimitedBlockRaw / delimitedBlock / paragraphBlock / abbreviatedBlock / ambientBlock 


hs = [ \t\u000C]
_ = [ \t\u000C]*
Endline = $(hs* [\n\r])

LineOfText = text:$(char+) EOL
   { return text }

// char =  [a-z =0-9.<>]
char = [^\n\r]
newline = '\n' / '\r' '\n'?
EOL = newline / !.
emptyline = $(hs* [\n\r])
markerBegin = '=begin '
markerEnd = '=end '
markerFor = '=for '
markerAbbreviatedBlock = '=' name:identifier  { return name }
markers = markerBegin / markerEnd / markerFor 
text_content = !( _ ( markers / markerAbbreviatedBlock ) ) $(Text)+ EOL { return text()}
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
delimitedBlockRaw = vmagin:$(_) markerBegin name:identifier _ attr:attributes_block &{ return name !== name.toLowerCase() && name !== name.toUpperCase() } 
content:$(! markers Text Endline? 
          / empty:emptyline + { return {text: text(), type: "ambient"}} 
          )+
vmagin2:$(_) res:( 
              markerEnd ename:identifier &{ return name === ename } Endline? { return { type:'block', content, name}} 
              ) &{return  true || vmagin === vmagin2} { return { ...res, text:text() , attr }}

delimitedBlock = 
  vmagin:$(_) markerBegin name:identifier  _ attr:attributes_block
  content:( nodes:(
          empty:emptyline + { return {text: text(), type: "ambient"}} 
          /  delimitedBlock 
          / paragraphBlock 
          / abbreviatedBlock 
          ) & { return true || name == name.toUpperCase() } { return nodes} 
  / _ text:$(text_content+) {return {text}})* 
vmagin2:$(_) res:( 
          markerEnd ename:identifier &{ return name === ename } Endline? { return { type:'block', content, name}} 
          ) &{return  true || vmagin === vmagin2} { return { ...res, text:text() , attr }}

ambientBlock = (emptyline / [\s]+ /.+ )+ { return { text: text(), type: "ambient"}}

abbreviatedBlock = _ !markers name:markerAbbreviatedBlock _ emptyline* 
content:$(!emptyline text_content )*
{ return { type:'block', content: content === "" ? [] : [{text:content}], name}} 

paragraphBlock = _ marker:markerFor name:identifier _ attr:attributes_block
content:$(!emptyline text_content)*
{ return { type:'block', content: content === "" ? [] : [{text:content}], name, attr}} 

identifier = $([a-zA-Z][a-zA-Z0-9_-]+)
Text "text" = $(c:char+)

___ "whitespace"
  = [\r\n \t\u000C]*

__ "space characters"
  = [\r\n \t\u000C]*



