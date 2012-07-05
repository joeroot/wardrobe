# Design

## Everything is an object

Our language wants to define almost evrything as an Object. For example, `true` and `false` should be objects of class `TrueBool` and `FalseBool`, perhaps both extending a `Bool` class. Similarly, `"this is a string"` should be of class `String`, `7` and `1.2` should be of class `Number` and an array `[1,2,3]` should be of class `Array`. 

Clearly, not *everything* can  be an object, and as such we must define a syntactical set which allows us to introduce algorithmic concepts.

## Terms and defenitions

# Syntax

## Tokens

### Keywords
    
    DIGIT ::= [0-9]
    STRING ::= "[Any character]*"
    BOOLEAN ::= true | false
    KEYWORD ::= class | function | do | end | if | else | while | for | in | return
    IDENTIFIER ::= [a-z] [a-zA-Z0-9]*
    MATH :: = + | - | * | / | % 

# Notes

> In this chapter I discuss the implementation and the advantages of interpreters which work from a parse tree and a symbol table similar to those which are used by the translation phase of a compiler. Such an interpreter is very like a tree-walking translator but, instead of generating instructions which will have a particular effect when the program runs, an interpreter carries out actions which have that effect directly and immediately. If the program which is being interpreted is to be debugged, however, an interpreter will have to act rather differently from a recursive tree-walker: I discuss the differences between ‘imi- tative’ and ‘linearising’ interpreters below.

[1] R. Bornat, Understanding and writing compilers: a do-it-yourself guide. Macmillan Publishing Co., Inc., 1990.