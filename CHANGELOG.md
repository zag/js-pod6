# Upcoming
# 0.0.46
- fix deps
# 0.0.45
- handle vmargin for delimited type of NamedBlock,
=code,=comment,=output,=input,=data
- tests: switch to jest snapshots
# 0.0.44
- fix npm build
# 0.0.43
- add image support while export to html
# 0.0.42
- add toc support
- filter null and undefined nodes in Ast interator
# 0.0.41
- improve api for preprocess AST tree
# 0.0.40
- correct markers list ( add =alias)
- fix interator ( clean tree from null and undefined nodes)

# 0.0.39
- add types defs into npm
- improve testing

# 0.0.38
- switch off strict identifier for =alias

# 0.0.37
- internal API changes ( subUse helper ) 

# 0.0.36
- use strict parsing ( only allowed block names are recognized )

# 0.0.35
- unify debug reporting
- optimize internal api

# 0.0.34
- remove 'text' from tree
- fix typing for default writer

# 0.0.33
- handle undefined node in queries

# 0.0.32
- implement formatting code D<> - definition
- generate d.ts files

# 0.0.31
- fix unhandled error

# 0.0.30
- add E<> support
- implement =data block
- add support for :nested() config param
- handle child's for any block while process formatting codes

# 0.0.29
- improve internal AST processing api

# 0.0.28
- fix gitflow

# 0.0.27
- fix bin/pod6html

# 0.0.26
- fix package.json

# 0.0.25
- fix delimited blocks inside code blocks interpreted as blocks rather than raw text #14
- moved to TypeScript
- removed namedBlock as type

# 0.0.24
- fix anchors in L<> #10,  
- fix formating codes inside =item #06
- improve ambient mode

# 0.0.23
- add ambient block support
- add location for para

# 0.0.22
- add positioning for source text

# 0.0.21
- spaces around identifier #8
- fix trailing spaces #9
- improve tables #11

# 0.0.20
- quick fix use A<> without predefined =alias

# 0.0.19
- implement terminal output: T<>
- implement keyboard input: K<>
- implement unusual or distinctive: U<>
- implement =input, =output blocks
- implement A<>, =alias directive

# 0.0.18
- fix flat() problem #7

# 0.0.17
- fix abbreviated block for verbatim content
- fix error reports
- fix generators for grammars

# 0.0.16
- fix https://github.com/zag/js-pod6/issues/3
- implement annotations: N<>
- implement indexing terms: X<>

# 0.0.15
- add :allow support
- add writers layer
- escape html entity

# 0.0.14
- add :caption support for =table
- add helpers for =config directive
- support =config table
- html: export Semantic blocks 

# 0.0.13
- add =table support
- add link to https://pod6.in - online pod6 editor 

# 0.0.12
- fix term in=defn
- refactor export interators and tree transformers
- V<>, R<>, =nested ( only 1 level )
- implement for overwrite rules for selector ( HOC subUse )

# 0.0.11

- hot fix for =defn lists

# 0.0.10

- add S<>, Z<>
- fix L<>
- =defn lists
- avoid critical parse errors 
- report locations of errors in source text
- add version to module.exports

# 0.0.9

- fix npm

# 0.0.8

- export html script: pod6html
- unify tree

# 0.0.7

- base export to html
- handle lists

# 0.0.6

- =config directive
- pod configuration: support numbers, arrays, pairs, strings and boolean types
- fix C<> and L<> parsing 

# 0.0.5

- add para/code container for paragraphs
- add heading plugin

# 0.0.4

- add comment block support
- add level for items (plugin)

# 0.0.3

- fix npm

# 0.0.2

- add new tests

# 0.0.1

- Initial release 