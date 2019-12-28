Expression
 = ( code / text)*
code_L = 
name:start_code &{return name === "L"} 
    t:( 
    text:$(!'|' .)+ 
    //&{return true && !text.match(/|/)} 
    '|' t:(!code .+) &{console.log({t});return true }{return {text,t}}
    ) 
end_code {return {name:'LS', type:'fcode',content:t}}
allowed_code = ( 'C' / 'L' / 'S')
start_code = name:$(allowed_code) '<' { return name }
end_code = '>'
code =  name:start_code content:(  
        code / text
        )+ end_code  
{ return {content, type:'fcode', name}} 
text = text:$(looks_like_code / not_code)+ {return text}
not_code = text:$(!end_code !start_code !looks_like_code .)+ {return text}
looks_like_code =(!allowed_code .) '<' not_code '>' {return text()}
