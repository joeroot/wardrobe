/* Jison generated parser */
var parser = (function(){
var parser = {trace: function trace() { },
yy: {},
symbols_: {"error":2,"root":3,"EOF":4,"program":5,"t":6,"NEWLINE":7,"line":8,"statement":9,"expression":10,"RETURN":11,"primary":12,"block":13,"if":14,"while":15,"for":16,"assign":17,"operation":18,"call":19,"LPAREN":20,"RPAREN":21,"IF":22,"THEN":23,"END":24,"ELSE":25,"WHILE":26,"DO":27,"FOR":28,"ident":29,"IN":30,"identifier":31,"ASSIGN":32,"COMP":33,"MATH":34,"literal":35,"IDENT":36,"NUMBER":37,"STRING":38,"$accept":0,"$end":1},
terminals_: {2:"error",4:"EOF",7:"NEWLINE",11:"RETURN",20:"LPAREN",21:"RPAREN",22:"IF",23:"THEN",24:"END",25:"ELSE",26:"WHILE",27:"DO",28:"FOR",29:"ident",30:"IN",32:"ASSIGN",33:"COMP",34:"MATH",36:"IDENT",37:"NUMBER",38:"STRING"},
productions_: [0,[3,1],[3,2],[6,1],[5,1],[5,3],[5,2],[8,1],[8,1],[9,2],[13,3],[10,1],[10,1],[10,1],[10,1],[10,1],[10,1],[10,1],[10,3],[14,5],[14,7],[15,5],[16,7],[17,3],[18,3],[18,3],[19,4],[12,1],[12,1],[31,1],[35,1],[35,1]],
performAction: function anonymous(yytext,yyleng,yylineno,yy,yystate,$$,_$) {

var $0 = $$.length - 1;
switch (yystate) {
case 1:return [];
break;
case 2:return $$[$0-1];
break;
case 3:this.$ = $$[$0]
break;
case 4:this.$ = [$$[$0]]
break;
case 5:this.$ = $$[$0-2]; $$[$0-2].push($$[$0])
break;
case 6:this.$ = $$[$0-1]
break;
case 7:this.$ = $$[$0]
break;
case 8:this.$ = $$[$0]
break;
case 9:this.$ = ['Return', $$[$0]]
break;
case 10:this.$ = ['Block', $$[$0-1]]
break;
case 11:this.$ = $$[$0];
break;
case 12:this.$ = $$[$0];
break;
case 13:this.$ = $$[$0];
break;
case 14:this.$ = $$[$0]
break;
case 15:this.$ = $$[$0]
break;
case 16:this.$ = $$[$0]
break;
case 17:this.$ = $$[$0]
break;
case 18:this.$ = $$[$0-1]
break;
case 19:this.$ = ['If', $$[$0-3], $$[$0-1]]
break;
case 20:this.$ = ['If', $$[$0-5], $$[$0-3], $$[$0-1]]
break;
case 21:this.$ = ['While', $$[$0-3], $$[$0-1]]
break;
case 22:['For', $$[$0-5], $$[$0-3], $$[$0-1]]
break;
case 23:this.$ = ['Assign', $$[$0-2], $$[$0]]
break;
case 24:this.$ = ['Comp', $$[$0-1], $$[$0-2], $$[$0]]
break;
case 25:this.$ = ['Math', $$[$0-1], $$[$0-2], $$[$0]]
break;
case 26:this.$ = ['Call', $$[$0-3], $$[$0-1]]
break;
case 27:this.$ = $$[$0]
break;
case 28:this.$ = $$[$0]
break;
case 29:this.$ = ['Identifier', $$[$0]]
break;
case 30:this.$ = ['Number', $$[$0]]
break;
case 31:this.$ = ['String', $$[$0]]
break;
}
},
table: [{3:1,4:[1,2],5:3,8:4,9:5,10:6,11:[1,7],12:14,14:8,15:9,16:10,17:11,18:12,19:13,20:[1,15],22:[1,16],26:[1,17],28:[1,18],31:19,35:20,36:[1,21],37:[1,22],38:[1,23]},{1:[3]},{1:[2,1]},{4:[1,24],6:25,7:[1,26]},{4:[2,4],7:[2,4]},{4:[2,7],7:[2,7]},{4:[2,8],7:[2,8],34:[1,27]},{12:28,31:29,35:20,36:[1,21],37:[1,22],38:[1,23]},{4:[2,11],7:[2,11],21:[2,11],23:[2,11],27:[2,11],34:[2,11]},{4:[2,12],7:[2,12],21:[2,12],23:[2,12],27:[2,12],34:[2,12]},{4:[2,13],7:[2,13],21:[2,13],23:[2,13],27:[2,13],34:[2,13]},{4:[2,14],7:[2,14],21:[2,14],23:[2,14],27:[2,14],34:[2,14]},{4:[2,15],7:[2,15],21:[2,15],23:[2,15],27:[2,15],34:[2,15]},{4:[2,16],7:[2,16],21:[2,16],23:[2,16],27:[2,16],34:[2,16]},{4:[2,17],7:[2,17],21:[2,17],23:[2,17],27:[2,17],33:[1,30],34:[2,17]},{10:31,12:14,14:8,15:9,16:10,17:11,18:12,19:13,20:[1,15],22:[1,16],26:[1,17],28:[1,18],31:19,35:20,36:[1,21],37:[1,22],38:[1,23]},{10:32,12:14,14:8,15:9,16:10,17:11,18:12,19:13,20:[1,15],22:[1,16],26:[1,17],28:[1,18],31:19,35:20,36:[1,21],37:[1,22],38:[1,23]},{10:33,12:14,14:8,15:9,16:10,17:11,18:12,19:13,20:[1,15],22:[1,16],26:[1,17],28:[1,18],31:19,35:20,36:[1,21],37:[1,22],38:[1,23]},{29:[1,34]},{4:[2,27],7:[2,27],20:[1,36],21:[2,27],23:[2,27],27:[2,27],32:[1,35],33:[2,27],34:[2,27]},{4:[2,28],7:[2,28],21:[2,28],23:[2,28],27:[2,28],33:[2,28],34:[2,28]},{4:[2,29],7:[2,29],20:[2,29],21:[2,29],23:[2,29],27:[2,29],32:[2,29],33:[2,29],34:[2,29]},{4:[2,30],7:[2,30],21:[2,30],23:[2,30],27:[2,30],33:[2,30],34:[2,30]},{4:[2,31],7:[2,31],21:[2,31],23:[2,31],27:[2,31],33:[2,31],34:[2,31]},{1:[2,2]},{4:[2,6],7:[2,6],8:37,9:5,10:6,11:[1,7],12:14,14:8,15:9,16:10,17:11,18:12,19:13,20:[1,15],22:[1,16],26:[1,17],28:[1,18],31:19,35:20,36:[1,21],37:[1,22],38:[1,23]},{4:[2,3],7:[2,3],11:[2,3],20:[2,3],22:[2,3],24:[2,3],25:[2,3],26:[2,3],28:[2,3],36:[2,3],37:[2,3],38:[2,3]},{10:38,12:14,14:8,15:9,16:10,17:11,18:12,19:13,20:[1,15],22:[1,16],26:[1,17],28:[1,18],31:19,35:20,36:[1,21],37:[1,22],38:[1,23]},{4:[2,9],7:[2,9]},{4:[2,27],7:[2,27],21:[2,27],23:[2,27],27:[2,27],34:[2,27]},{12:39,31:29,35:20,36:[1,21],37:[1,22],38:[1,23]},{21:[1,40],34:[1,27]},{23:[1,41],34:[1,27]},{27:[1,42],34:[1,27]},{30:[1,43]},{10:44,12:14,14:8,15:9,16:10,17:11,18:12,19:13,20:[1,15],22:[1,16],26:[1,17],28:[1,18],31:19,35:20,36:[1,21],37:[1,22],38:[1,23]},{12:45,31:29,35:20,36:[1,21],37:[1,22],38:[1,23]},{4:[2,5],7:[2,5]},{4:[2,25],7:[2,25],21:[2,25],23:[2,25],27:[2,25],34:[1,27]},{4:[2,24],7:[2,24],21:[2,24],23:[2,24],27:[2,24],34:[2,24]},{4:[2,18],7:[2,18],21:[2,18],23:[2,18],27:[2,18],34:[2,18]},{6:47,7:[1,26],13:46},{6:47,7:[1,26],13:48},{10:49,12:14,14:8,15:9,16:10,17:11,18:12,19:13,20:[1,15],22:[1,16],26:[1,17],28:[1,18],31:19,35:20,36:[1,21],37:[1,22],38:[1,23]},{4:[2,23],7:[2,23],21:[2,23],23:[2,23],27:[2,23],34:[1,27]},{21:[1,50]},{24:[1,51],25:[1,52]},{5:53,8:4,9:5,10:6,11:[1,7],12:14,14:8,15:9,16:10,17:11,18:12,19:13,20:[1,15],22:[1,16],26:[1,17],28:[1,18],31:19,35:20,36:[1,21],37:[1,22],38:[1,23]},{24:[1,54]},{27:[1,55],34:[1,27]},{4:[2,26],7:[2,26],21:[2,26],23:[2,26],27:[2,26],34:[2,26]},{4:[2,19],7:[2,19],21:[2,19],23:[2,19],27:[2,19],34:[2,19]},{6:47,7:[1,26],13:56},{6:57,7:[1,26]},{4:[2,21],7:[2,21],21:[2,21],23:[2,21],27:[2,21],34:[2,21]},{6:47,7:[1,26],13:58},{24:[1,59]},{7:[2,6],8:37,9:5,10:6,11:[1,7],12:14,14:8,15:9,16:10,17:11,18:12,19:13,20:[1,15],22:[1,16],24:[2,10],25:[2,10],26:[1,17],28:[1,18],31:19,35:20,36:[1,21],37:[1,22],38:[1,23]},{24:[1,60]},{4:[2,20],7:[2,20],21:[2,20],23:[2,20],27:[2,20],34:[2,20]},{4:[2,22],7:[2,22],21:[2,22],23:[2,22],27:[2,22],34:[2,22]}],
defaultActions: {2:[2,1],24:[2,2]},
parseError: function parseError(str, hash) {
    throw new Error(str);
},
parse: function parse(input) {
    var self = this, stack = [0], vstack = [null], lstack = [], table = this.table, yytext = "", yylineno = 0, yyleng = 0, recovering = 0, TERROR = 2, EOF = 1;
    this.lexer.setInput(input);
    this.lexer.yy = this.yy;
    this.yy.lexer = this.lexer;
    if (typeof this.lexer.yylloc == "undefined")
        this.lexer.yylloc = {};
    var yyloc = this.lexer.yylloc;
    lstack.push(yyloc);
    if (typeof this.yy.parseError === "function")
        this.parseError = this.yy.parseError;
    function popStack(n) {
        stack.length = stack.length - 2 * n;
        vstack.length = vstack.length - n;
        lstack.length = lstack.length - n;
    }
    function lex() {
        var token;
        token = self.lexer.lex() || 1;
        if (typeof token !== "number") {
            token = self.symbols_[token] || token;
        }
        return token;
    }
    var symbol, preErrorSymbol, state, action, a, r, yyval = {}, p, len, newState, expected;
    while (true) {
        state = stack[stack.length - 1];
        if (this.defaultActions[state]) {
            action = this.defaultActions[state];
        } else {
            if (symbol == null)
                symbol = lex();
            action = table[state] && table[state][symbol];
        }
        if (typeof action === "undefined" || !action.length || !action[0]) {
            if (!recovering) {
                expected = [];
                for (p in table[state])
                    if (this.terminals_[p] && p > 2) {
                        expected.push("'" + this.terminals_[p] + "'");
                    }
                var errStr = "";
                if (this.lexer.showPosition) {
                    errStr = "Parse error on line " + (yylineno + 1) + ":\n" + this.lexer.showPosition() + "\nExpecting " + expected.join(", ") + ", got '" + this.terminals_[symbol] + "'";
                } else {
                    errStr = "Parse error on line " + (yylineno + 1) + ": Unexpected " + (symbol == 1?"end of input":"'" + (this.terminals_[symbol] || symbol) + "'");
                }
                this.parseError(errStr, {text: this.lexer.match, token: this.terminals_[symbol] || symbol, line: this.lexer.yylineno, loc: yyloc, expected: expected});
            }
        }
        if (action[0] instanceof Array && action.length > 1) {
            throw new Error("Parse Error: multiple actions possible at state: " + state + ", token: " + symbol);
        }
        switch (action[0]) {
        case 1:
            stack.push(symbol);
            vstack.push(this.lexer.yytext);
            lstack.push(this.lexer.yylloc);
            stack.push(action[1]);
            symbol = null;
            if (!preErrorSymbol) {
                yyleng = this.lexer.yyleng;
                yytext = this.lexer.yytext;
                yylineno = this.lexer.yylineno;
                yyloc = this.lexer.yylloc;
                if (recovering > 0)
                    recovering--;
            } else {
                symbol = preErrorSymbol;
                preErrorSymbol = null;
            }
            break;
        case 2:
            len = this.productions_[action[1]][1];
            yyval.$ = vstack[vstack.length - len];
            yyval._$ = {first_line: lstack[lstack.length - (len || 1)].first_line, last_line: lstack[lstack.length - 1].last_line, first_column: lstack[lstack.length - (len || 1)].first_column, last_column: lstack[lstack.length - 1].last_column};
            r = this.performAction.call(yyval, yytext, yyleng, yylineno, this.yy, action[1], vstack, lstack);
            if (typeof r !== "undefined") {
                return r;
            }
            if (len) {
                stack = stack.slice(0, -1 * len * 2);
                vstack = vstack.slice(0, -1 * len);
                lstack = lstack.slice(0, -1 * len);
            }
            stack.push(this.productions_[action[1]][0]);
            vstack.push(yyval.$);
            lstack.push(yyval._$);
            newState = table[stack[stack.length - 2]][stack[stack.length - 1]];
            stack.push(newState);
            break;
        case 3:
            return true;
        }
    }
    return true;
}
};
undefined
return parser;
})();
if (typeof require !== 'undefined' && typeof exports !== 'undefined') {
exports.parser = parser;
exports.parse = function () { return parser.parse.apply(parser, arguments); }
exports.main = function commonjsMain(args) {
    if (!args[1])
        throw new Error('Usage: '+args[0]+' FILE');
    if (typeof process !== 'undefined') {
        var source = require('fs').readFileSync(require('path').join(process.cwd(), args[1]), "utf8");
    } else {
        var cwd = require("file").path(require("file").cwd());
        var source = cwd.join(args[1]).read({charset: "utf-8"});
    }
    return exports.parser.parse(source);
}
if (typeof module !== 'undefined' && require.main === module) {
  exports.main(typeof process !== 'undefined' ? process.argv.slice(1) : require("system").args);
}
}