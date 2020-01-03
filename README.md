# pod6

Pod6 is an easy-to-use markup language.

## Usage

```
 var parse = require('pod6').parse
 parse(`=begin pod
 This is an ordinary paragraph

    While this is not
    This is a code block

    =head1 Mumble mumble

    Suprisingly, this is not a code block
        (with fancy indentation too)

But this is just a text. Again

=end pod`)
```

## Links 

To see specification of pod6 visit here: https://github.com/perl6/specs/blob/master/S26-documentation.pod