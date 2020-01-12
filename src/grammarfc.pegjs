Expression
 = ( code_C / code_V / code_L / code / text / raw_text )*
raw_text= $(.) // { return {raw: text()}}
code_V = 
    name:start_code &{return name === "V"}
    content: $( code / text )+
    end_code
     {
         return  { 
                content,
                'type':"fcode",
                name,
                content,
             }
    }
code_C = 
    name:start_code &{return name === "C"}
    content: ( code / text )+
    end_code
     {
         return  { 
                content,
                'type':"fcode",
                name,
                content,
             }
    }

code_L = 
    name:start_code &{return name === "L"}
    content: (
                code / text 
             )
     meta:(
            ['|'] t:text 
                    { return t }
           )?
     end_code
     {
         return  { 
                content,
                'type':"fcode",
                name,
                content,
                meta
             }
    }
allowed_code = ( 'V' / 'R' / 'B' / 'I' / 'C' / 'L' / 'S')
start_code = name:$(allowed_code) '<' { return name }
end_code = '>'
code =  name:start_code content:(  
          code / text
        )+ end_code  
{ return {content, type:'fcode', name}} 
text = text:$( '<' text '>' / looks_like_code / not_code )+ {return text}
not_code = text:$(!end_code !start_code !looks_like_code .)+ {return text}
looks_like_code =(!allowed_code .) '<' not_code '>' {return text()}
