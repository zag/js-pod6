# test S<>
#---
=pod
S< sd sd sd 
sd sd>
#---

# test Z<>
#---
=pod
test Z<is it make sence?> text
#---
#---
=pod
S<sd>
test C<S<...>>text
#---

#---
=para
        Name: B<R<your surname>>
          ID: B<R<your employee number>>
        Pass: B<R<your 36-letter password>>
#---

#---
=pod
V<C<>>
#---

# N<> Footnote
#---
=para
Use a C<for> loop instead.N<The Perl 6 C<for> loop is far more
powerful than its Perl 5 predecessor.> Preferably with an explicit
iterator variable.
=para
Text.N<> TExt2.N<Yep>
#---

# X<> indexing terms
#---
=para
A X<hash|hashes, definition of; associative arrays>
is an unordered X<collection> of X<scalar|scalars> values indexed by their
associated string X<|puns, deliberate> key. X<> empty
#---

# U<> formatting code
#---
=para
The C<U<>> formatting code specifies that the contained text is
U<unusual> or distinctive;
#---

# T<>  and K<> formatting codes
#---
=para
Such content would typically be rendered in a K<fixed-width font>
Such content would typically be rendered in a T<fixed-width font>
#---