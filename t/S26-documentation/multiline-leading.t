use v6;
use Test;

plan 4;

#| More
#| Than
#| One
#| Line
class App {
    #| Does
    #| Stuff
    method do-stuff(
        #| Param
        #| One
        Str $param1,

        #| Param
        #| Two
        Str $param2
    ) {}
}

my $method = App.^find_method('do-stuff');
is ~App.WHY, "More Than One Line", "multiline-leading App.WHY";
is ~$method.WHY, "Does Stuff", "multiline-leading method.WHY";

my ( $, $p1, $p2 ) = $method.signature.params;

is ~$p1.WHY, 'Param One', "method.signature WHY param one";
is ~$p2.WHY, 'Param Two', "method.signature WHY param two";
