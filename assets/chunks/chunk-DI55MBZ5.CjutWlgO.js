import{g as te}from"./chunk-55IACEB6.detYE7sl.js";import{s as ee}from"./chunk-QN33PNHL.BlJKojJP.js";import{_ as u,l as b,c as w,r as se,u as ie,a as re,b as ae,g as ne,s as oe,q as le,t as ce,ab as he,k as U,z as ue}from"./mermaid.core.C--MEpda.js";var vt=(function(){var t=u(function(Y,o,c,n){for(c=c||{},n=Y.length;n--;c[Y[n]]=o);return c},"o"),e=[1,2],s=[1,3],a=[1,4],r=[2,4],h=[1,9],d=[1,11],S=[1,16],f=[1,17],T=[1,18],_=[1,19],m=[1,33],A=[1,20],v=[1,21],p=[1,22],k=[1,23],R=[1,24],L=[1,26],$=[1,27],I=[1,28],P=[1,29],st=[1,30],it=[1,31],rt=[1,32],at=[1,35],nt=[1,36],ot=[1,37],lt=[1,38],H=[1,34],y=[1,4,5,16,17,19,21,22,24,25,26,27,28,29,33,35,37,38,41,45,48,51,52,53,54,57],ct=[1,4,5,14,15,16,17,19,21,22,24,25,26,27,28,29,33,35,37,38,39,40,41,45,48,51,52,53,54,57],xt=[4,5,16,17,19,21,22,24,25,26,27,28,29,33,35,37,38,41,45,48,51,52,53,54,57],gt={trace:u(function(){},"trace"),yy:{},symbols_:{error:2,start:3,SPACE:4,NL:5,SD:6,document:7,line:8,statement:9,classDefStatement:10,styleStatement:11,cssClassStatement:12,idStatement:13,DESCR:14,"-->":15,HIDE_EMPTY:16,scale:17,WIDTH:18,COMPOSIT_STATE:19,STRUCT_START:20,STRUCT_STOP:21,STATE_DESCR:22,AS:23,ID:24,FORK:25,JOIN:26,CHOICE:27,CONCURRENT:28,note:29,notePosition:30,NOTE_TEXT:31,direction:32,acc_title:33,acc_title_value:34,acc_descr:35,acc_descr_value:36,acc_descr_multiline_value:37,CLICK:38,STRING:39,HREF:40,classDef:41,CLASSDEF_ID:42,CLASSDEF_STYLEOPTS:43,DEFAULT:44,style:45,STYLE_IDS:46,STYLEDEF_STYLEOPTS:47,class:48,CLASSENTITY_IDS:49,STYLECLASS:50,direction_tb:51,direction_bt:52,direction_rl:53,direction_lr:54,eol:55,";":56,EDGE_STATE:57,STYLE_SEPARATOR:58,left_of:59,right_of:60,$accept:0,$end:1},terminals_:{2:"error",4:"SPACE",5:"NL",6:"SD",14:"DESCR",15:"-->",16:"HIDE_EMPTY",17:"scale",18:"WIDTH",19:"COMPOSIT_STATE",20:"STRUCT_START",21:"STRUCT_STOP",22:"STATE_DESCR",23:"AS",24:"ID",25:"FORK",26:"JOIN",27:"CHOICE",28:"CONCURRENT",29:"note",31:"NOTE_TEXT",33:"acc_title",34:"acc_title_value",35:"acc_descr",36:"acc_descr_value",37:"acc_descr_multiline_value",38:"CLICK",39:"STRING",40:"HREF",41:"classDef",42:"CLASSDEF_ID",43:"CLASSDEF_STYLEOPTS",44:"DEFAULT",45:"style",46:"STYLE_IDS",47:"STYLEDEF_STYLEOPTS",48:"class",49:"CLASSENTITY_IDS",50:"STYLECLASS",51:"direction_tb",52:"direction_bt",53:"direction_rl",54:"direction_lr",56:";",57:"EDGE_STATE",58:"STYLE_SEPARATOR",59:"left_of",60:"right_of"},productions_:[0,[3,2],[3,2],[3,2],[7,0],[7,2],[8,2],[8,1],[8,1],[9,1],[9,1],[9,1],[9,1],[9,2],[9,3],[9,4],[9,1],[9,2],[9,1],[9,4],[9,3],[9,6],[9,1],[9,1],[9,1],[9,1],[9,4],[9,4],[9,1],[9,2],[9,2],[9,1],[9,5],[9,5],[10,3],[10,3],[11,3],[12,3],[32,1],[32,1],[32,1],[32,1],[55,1],[55,1],[13,1],[13,1],[13,3],[13,3],[30,1],[30,1]],performAction:u(function(o,c,n,g,E,i,J){var l=i.length-1;switch(E){case 3:return g.setRootDoc(i[l]),i[l];case 4:this.$=[];break;case 5:i[l]!="nl"&&(i[l-1].push(i[l]),this.$=i[l-1]);break;case 6:case 7:this.$=i[l];break;case 8:this.$="nl";break;case 12:this.$=i[l];break;case 13:const q=i[l-1];q.description=g.trimColon(i[l]),this.$=q;break;case 14:this.$={stmt:"relation",state1:i[l-2],state2:i[l]};break;case 15:const Tt=g.trimColon(i[l]);this.$={stmt:"relation",state1:i[l-3],state2:i[l-1],description:Tt};break;case 19:this.$={stmt:"state",id:i[l-3],type:"default",description:"",doc:i[l-1]};break;case 20:var B=i[l],z=i[l-2].trim();if(i[l].match(":")){var ut=i[l].split(":");B=ut[0],z=[z,ut[1]]}this.$={stmt:"state",id:B,type:"default",description:z};break;case 21:this.$={stmt:"state",id:i[l-3],type:"default",description:i[l-5],doc:i[l-1]};break;case 22:this.$={stmt:"state",id:i[l],type:"fork"};break;case 23:this.$={stmt:"state",id:i[l],type:"join"};break;case 24:this.$={stmt:"state",id:i[l],type:"choice"};break;case 25:this.$={stmt:"state",id:g.getDividerId(),type:"divider"};break;case 26:this.$={stmt:"state",id:i[l-1].trim(),note:{position:i[l-2].trim(),text:i[l].trim()}};break;case 29:this.$=i[l].trim(),g.setAccTitle(this.$);break;case 30:case 31:this.$=i[l].trim(),g.setAccDescription(this.$);break;case 32:this.$={stmt:"click",id:i[l-3],url:i[l-2],tooltip:i[l-1]};break;case 33:this.$={stmt:"click",id:i[l-3],url:i[l-1],tooltip:""};break;case 34:case 35:this.$={stmt:"classDef",id:i[l-1].trim(),classes:i[l].trim()};break;case 36:this.$={stmt:"style",id:i[l-1].trim(),styleClass:i[l].trim()};break;case 37:this.$={stmt:"applyClass",id:i[l-1].trim(),styleClass:i[l].trim()};break;case 38:g.setDirection("TB"),this.$={stmt:"dir",value:"TB"};break;case 39:g.setDirection("BT"),this.$={stmt:"dir",value:"BT"};break;case 40:g.setDirection("RL"),this.$={stmt:"dir",value:"RL"};break;case 41:g.setDirection("LR"),this.$={stmt:"dir",value:"LR"};break;case 44:case 45:this.$={stmt:"state",id:i[l].trim(),type:"default",description:""};break;case 46:this.$={stmt:"state",id:i[l-2].trim(),classes:[i[l].trim()],type:"default",description:""};break;case 47:this.$={stmt:"state",id:i[l-2].trim(),classes:[i[l].trim()],type:"default",description:""};break}},"anonymous"),table:[{3:1,4:e,5:s,6:a},{1:[3]},{3:5,4:e,5:s,6:a},{3:6,4:e,5:s,6:a},t([1,4,5,16,17,19,22,24,25,26,27,28,29,33,35,37,38,41,45,48,51,52,53,54,57],r,{7:7}),{1:[2,1]},{1:[2,2]},{1:[2,3],4:h,5:d,8:8,9:10,10:12,11:13,12:14,13:15,16:S,17:f,19:T,22:_,24:m,25:A,26:v,27:p,28:k,29:R,32:25,33:L,35:$,37:I,38:P,41:st,45:it,48:rt,51:at,52:nt,53:ot,54:lt,57:H},t(y,[2,5]),{9:39,10:12,11:13,12:14,13:15,16:S,17:f,19:T,22:_,24:m,25:A,26:v,27:p,28:k,29:R,32:25,33:L,35:$,37:I,38:P,41:st,45:it,48:rt,51:at,52:nt,53:ot,54:lt,57:H},t(y,[2,7]),t(y,[2,8]),t(y,[2,9]),t(y,[2,10]),t(y,[2,11]),t(y,[2,12],{14:[1,40],15:[1,41]}),t(y,[2,16]),{18:[1,42]},t(y,[2,18],{20:[1,43]}),{23:[1,44]},t(y,[2,22]),t(y,[2,23]),t(y,[2,24]),t(y,[2,25]),{30:45,31:[1,46],59:[1,47],60:[1,48]},t(y,[2,28]),{34:[1,49]},{36:[1,50]},t(y,[2,31]),{13:51,24:m,57:H},{42:[1,52],44:[1,53]},{46:[1,54]},{49:[1,55]},t(ct,[2,44],{58:[1,56]}),t(ct,[2,45],{58:[1,57]}),t(y,[2,38]),t(y,[2,39]),t(y,[2,40]),t(y,[2,41]),t(y,[2,6]),t(y,[2,13]),{13:58,24:m,57:H},t(y,[2,17]),t(xt,r,{7:59}),{24:[1,60]},{24:[1,61]},{23:[1,62]},{24:[2,48]},{24:[2,49]},t(y,[2,29]),t(y,[2,30]),{39:[1,63],40:[1,64]},{43:[1,65]},{43:[1,66]},{47:[1,67]},{50:[1,68]},{24:[1,69]},{24:[1,70]},t(y,[2,14],{14:[1,71]}),{4:h,5:d,8:8,9:10,10:12,11:13,12:14,13:15,16:S,17:f,19:T,21:[1,72],22:_,24:m,25:A,26:v,27:p,28:k,29:R,32:25,33:L,35:$,37:I,38:P,41:st,45:it,48:rt,51:at,52:nt,53:ot,54:lt,57:H},t(y,[2,20],{20:[1,73]}),{31:[1,74]},{24:[1,75]},{39:[1,76]},{39:[1,77]},t(y,[2,34]),t(y,[2,35]),t(y,[2,36]),t(y,[2,37]),t(ct,[2,46]),t(ct,[2,47]),t(y,[2,15]),t(y,[2,19]),t(xt,r,{7:78}),t(y,[2,26]),t(y,[2,27]),{5:[1,79]},{5:[1,80]},{4:h,5:d,8:8,9:10,10:12,11:13,12:14,13:15,16:S,17:f,19:T,21:[1,81],22:_,24:m,25:A,26:v,27:p,28:k,29:R,32:25,33:L,35:$,37:I,38:P,41:st,45:it,48:rt,51:at,52:nt,53:ot,54:lt,57:H},t(y,[2,32]),t(y,[2,33]),t(y,[2,21])],defaultActions:{5:[2,1],6:[2,2],47:[2,48],48:[2,49]},parseError:u(function(o,c){if(c.recoverable)this.trace(o);else{var n=new Error(o);throw n.hash=c,n}},"parseError"),parse:u(function(o){var c=this,n=[0],g=[],E=[null],i=[],J=this.table,l="",B=0,z=0,ut=2,q=1,Tt=i.slice.call(arguments,1),D=Object.create(this.lexer),V={yy:{}};for(var Et in this.yy)Object.prototype.hasOwnProperty.call(this.yy,Et)&&(V.yy[Et]=this.yy[Et]);D.setInput(o,V.yy),V.yy.lexer=D,V.yy.parser=this,typeof D.yylloc>"u"&&(D.yylloc={});var _t=D.yylloc;i.push(_t);var Qt=D.options&&D.options.ranges;typeof V.yy.parseError=="function"?this.parseError=V.yy.parseError:this.parseError=Object.getPrototypeOf(this).parseError;function Zt(O){n.length=n.length-2*O,E.length=E.length-O,i.length=i.length-O}u(Zt,"popStack");function Lt(){var O;return O=g.pop()||D.lex()||q,typeof O!="number"&&(O instanceof Array&&(g=O,O=g.pop()),O=c.symbols_[O]||O),O}u(Lt,"lex");for(var x,M,N,mt,W={},dt,F,It,ft;;){if(M=n[n.length-1],this.defaultActions[M]?N=this.defaultActions[M]:((x===null||typeof x>"u")&&(x=Lt()),N=J[M]&&J[M][x]),typeof N>"u"||!N.length||!N[0]){var bt="";ft=[];for(dt in J[M])this.terminals_[dt]&&dt>ut&&ft.push("'"+this.terminals_[dt]+"'");D.showPosition?bt="Parse error on line "+(B+1)+`:
`+D.showPosition()+`
Expecting `+ft.join(", ")+", got '"+(this.terminals_[x]||x)+"'":bt="Parse error on line "+(B+1)+": Unexpected "+(x==q?"end of input":"'"+(this.terminals_[x]||x)+"'"),this.parseError(bt,{text:D.match,token:this.terminals_[x]||x,line:D.yylineno,loc:_t,expected:ft})}if(N[0]instanceof Array&&N.length>1)throw new Error("Parse Error: multiple actions possible at state: "+M+", token: "+x);switch(N[0]){case 1:n.push(x),E.push(D.yytext),i.push(D.yylloc),n.push(N[1]),x=null,z=D.yyleng,l=D.yytext,B=D.yylineno,_t=D.yylloc;break;case 2:if(F=this.productions_[N[1]][1],W.$=E[E.length-F],W._$={first_line:i[i.length-(F||1)].first_line,last_line:i[i.length-1].last_line,first_column:i[i.length-(F||1)].first_column,last_column:i[i.length-1].last_column},Qt&&(W._$.range=[i[i.length-(F||1)].range[0],i[i.length-1].range[1]]),mt=this.performAction.apply(W,[l,z,B,V.yy,N[1],E,i].concat(Tt)),typeof mt<"u")return mt;F&&(n=n.slice(0,-1*F*2),E=E.slice(0,-1*F),i=i.slice(0,-1*F)),n.push(this.productions_[N[1]][0]),E.push(W.$),i.push(W._$),It=J[n[n.length-2]][n[n.length-1]],n.push(It);break;case 3:return!0}}return!0},"parse")},qt=(function(){var Y={EOF:1,parseError:u(function(c,n){if(this.yy.parser)this.yy.parser.parseError(c,n);else throw new Error(c)},"parseError"),setInput:u(function(o,c){return this.yy=c||this.yy||{},this._input=o,this._more=this._backtrack=this.done=!1,this.yylineno=this.yyleng=0,this.yytext=this.matched=this.match="",this.conditionStack=["INITIAL"],this.yylloc={first_line:1,first_column:0,last_line:1,last_column:0},this.options.ranges&&(this.yylloc.range=[0,0]),this.offset=0,this},"setInput"),input:u(function(){var o=this._input[0];this.yytext+=o,this.yyleng++,this.offset++,this.match+=o,this.matched+=o;var c=o.match(/(?:\r\n?|\n).*/g);return c?(this.yylineno++,this.yylloc.last_line++):this.yylloc.last_column++,this.options.ranges&&this.yylloc.range[1]++,this._input=this._input.slice(1),o},"input"),unput:u(function(o){var c=o.length,n=o.split(/(?:\r\n?|\n)/g);this._input=o+this._input,this.yytext=this.yytext.substr(0,this.yytext.length-c),this.offset-=c;var g=this.match.split(/(?:\r\n?|\n)/g);this.match=this.match.substr(0,this.match.length-1),this.matched=this.matched.substr(0,this.matched.length-1),n.length-1&&(this.yylineno-=n.length-1);var E=this.yylloc.range;return this.yylloc={first_line:this.yylloc.first_line,last_line:this.yylineno+1,first_column:this.yylloc.first_column,last_column:n?(n.length===g.length?this.yylloc.first_column:0)+g[g.length-n.length].length-n[0].length:this.yylloc.first_column-c},this.options.ranges&&(this.yylloc.range=[E[0],E[0]+this.yyleng-c]),this.yyleng=this.yytext.length,this},"unput"),more:u(function(){return this._more=!0,this},"more"),reject:u(function(){if(this.options.backtrack_lexer)this._backtrack=!0;else return this.parseError("Lexical error on line "+(this.yylineno+1)+`. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).
`+this.showPosition(),{text:"",token:null,line:this.yylineno});return this},"reject"),less:u(function(o){this.unput(this.match.slice(o))},"less"),pastInput:u(function(){var o=this.matched.substr(0,this.matched.length-this.match.length);return(o.length>20?"...":"")+o.substr(-20).replace(/\n/g,"")},"pastInput"),upcomingInput:u(function(){var o=this.match;return o.length<20&&(o+=this._input.substr(0,20-o.length)),(o.substr(0,20)+(o.length>20?"...":"")).replace(/\n/g,"")},"upcomingInput"),showPosition:u(function(){var o=this.pastInput(),c=new Array(o.length+1).join("-");return o+this.upcomingInput()+`
`+c+"^"},"showPosition"),test_match:u(function(o,c){var n,g,E;if(this.options.backtrack_lexer&&(E={yylineno:this.yylineno,yylloc:{first_line:this.yylloc.first_line,last_line:this.last_line,first_column:this.yylloc.first_column,last_column:this.yylloc.last_column},yytext:this.yytext,match:this.match,matches:this.matches,matched:this.matched,yyleng:this.yyleng,offset:this.offset,_more:this._more,_input:this._input,yy:this.yy,conditionStack:this.conditionStack.slice(0),done:this.done},this.options.ranges&&(E.yylloc.range=this.yylloc.range.slice(0))),g=o[0].match(/(?:\r\n?|\n).*/g),g&&(this.yylineno+=g.length),this.yylloc={first_line:this.yylloc.last_line,last_line:this.yylineno+1,first_column:this.yylloc.last_column,last_column:g?g[g.length-1].length-g[g.length-1].match(/\r?\n?/)[0].length:this.yylloc.last_column+o[0].length},this.yytext+=o[0],this.match+=o[0],this.matches=o,this.yyleng=this.yytext.length,this.options.ranges&&(this.yylloc.range=[this.offset,this.offset+=this.yyleng]),this._more=!1,this._backtrack=!1,this._input=this._input.slice(o[0].length),this.matched+=o[0],n=this.performAction.call(this,this.yy,this,c,this.conditionStack[this.conditionStack.length-1]),this.done&&this._input&&(this.done=!1),n)return n;if(this._backtrack){for(var i in E)this[i]=E[i];return!1}return!1},"test_match"),next:u(function(){if(this.done)return this.EOF;this._input||(this.done=!0);var o,c,n,g;this._more||(this.yytext="",this.match="");for(var E=this._currentRules(),i=0;i<E.length;i++)if(n=this._input.match(this.rules[E[i]]),n&&(!c||n[0].length>c[0].length)){if(c=n,g=i,this.options.backtrack_lexer){if(o=this.test_match(n,E[i]),o!==!1)return o;if(this._backtrack){c=!1;continue}else return!1}else if(!this.options.flex)break}return c?(o=this.test_match(c,E[g]),o!==!1?o:!1):this._input===""?this.EOF:this.parseError("Lexical error on line "+(this.yylineno+1)+`. Unrecognized text.
`+this.showPosition(),{text:"",token:null,line:this.yylineno})},"next"),lex:u(function(){var c=this.next();return c||this.lex()},"lex"),begin:u(function(c){this.conditionStack.push(c)},"begin"),popState:u(function(){var c=this.conditionStack.length-1;return c>0?this.conditionStack.pop():this.conditionStack[0]},"popState"),_currentRules:u(function(){return this.conditionStack.length&&this.conditionStack[this.conditionStack.length-1]?this.conditions[this.conditionStack[this.conditionStack.length-1]].rules:this.conditions.INITIAL.rules},"_currentRules"),topState:u(function(c){return c=this.conditionStack.length-1-Math.abs(c||0),c>=0?this.conditionStack[c]:"INITIAL"},"topState"),pushState:u(function(c){this.begin(c)},"pushState"),stateStackSize:u(function(){return this.conditionStack.length},"stateStackSize"),options:{"case-insensitive":!0},performAction:u(function(c,n,g,E){switch(g){case 0:return 38;case 1:return 40;case 2:return 39;case 3:return 44;case 4:return 51;case 5:return 52;case 6:return 53;case 7:return 54;case 8:break;case 9:break;case 10:return 5;case 11:break;case 12:break;case 13:break;case 14:break;case 15:return this.pushState("SCALE"),17;case 16:return 18;case 17:this.popState();break;case 18:return this.begin("acc_title"),33;case 19:return this.popState(),"acc_title_value";case 20:return this.begin("acc_descr"),35;case 21:return this.popState(),"acc_descr_value";case 22:this.begin("acc_descr_multiline");break;case 23:this.popState();break;case 24:return"acc_descr_multiline_value";case 25:return this.pushState("CLASSDEF"),41;case 26:return this.popState(),this.pushState("CLASSDEFID"),"DEFAULT_CLASSDEF_ID";case 27:return this.popState(),this.pushState("CLASSDEFID"),42;case 28:return this.popState(),43;case 29:return this.pushState("CLASS"),48;case 30:return this.popState(),this.pushState("CLASS_STYLE"),49;case 31:return this.popState(),50;case 32:return this.pushState("STYLE"),45;case 33:return this.popState(),this.pushState("STYLEDEF_STYLES"),46;case 34:return this.popState(),47;case 35:return this.pushState("SCALE"),17;case 36:return 18;case 37:this.popState();break;case 38:this.pushState("STATE");break;case 39:return this.popState(),n.yytext=n.yytext.slice(0,-8).trim(),25;case 40:return this.popState(),n.yytext=n.yytext.slice(0,-8).trim(),26;case 41:return this.popState(),n.yytext=n.yytext.slice(0,-10).trim(),27;case 42:return this.popState(),n.yytext=n.yytext.slice(0,-8).trim(),25;case 43:return this.popState(),n.yytext=n.yytext.slice(0,-8).trim(),26;case 44:return this.popState(),n.yytext=n.yytext.slice(0,-10).trim(),27;case 45:return 51;case 46:return 52;case 47:return 53;case 48:return 54;case 49:this.pushState("STATE_STRING");break;case 50:return this.pushState("STATE_ID"),"AS";case 51:return this.popState(),"ID";case 52:this.popState();break;case 53:return"STATE_DESCR";case 54:return 19;case 55:this.popState();break;case 56:return this.popState(),this.pushState("struct"),20;case 57:break;case 58:return this.popState(),21;case 59:break;case 60:return this.begin("NOTE"),29;case 61:return this.popState(),this.pushState("NOTE_ID"),59;case 62:return this.popState(),this.pushState("NOTE_ID"),60;case 63:this.popState(),this.pushState("FLOATING_NOTE");break;case 64:return this.popState(),this.pushState("FLOATING_NOTE_ID"),"AS";case 65:break;case 66:return"NOTE_TEXT";case 67:return this.popState(),"ID";case 68:return this.popState(),this.pushState("NOTE_TEXT"),24;case 69:return this.popState(),n.yytext=n.yytext.substr(2).trim(),31;case 70:return this.popState(),n.yytext=n.yytext.slice(0,-8).trim(),31;case 71:return 6;case 72:return 6;case 73:return 16;case 74:return 57;case 75:return 24;case 76:return n.yytext=n.yytext.trim(),14;case 77:return 15;case 78:return 28;case 79:return 58;case 80:return 5;case 81:return"INVALID"}},"anonymous"),rules:[/^(?:click\b)/i,/^(?:href\b)/i,/^(?:"[^"]*")/i,/^(?:default\b)/i,/^(?:.*direction\s+TB[^\n]*)/i,/^(?:.*direction\s+BT[^\n]*)/i,/^(?:.*direction\s+RL[^\n]*)/i,/^(?:.*direction\s+LR[^\n]*)/i,/^(?:%%(?!\{)[^\n]*)/i,/^(?:[^\}]%%[^\n]*)/i,/^(?:[\n]+)/i,/^(?:[\s]+)/i,/^(?:((?!\n)\s)+)/i,/^(?:#[^\n]*)/i,/^(?:%[^\n]*)/i,/^(?:scale\s+)/i,/^(?:\d+)/i,/^(?:\s+width\b)/i,/^(?:accTitle\s*:\s*)/i,/^(?:(?!\n||)*[^\n]*)/i,/^(?:accDescr\s*:\s*)/i,/^(?:(?!\n||)*[^\n]*)/i,/^(?:accDescr\s*\{\s*)/i,/^(?:[\}])/i,/^(?:[^\}]*)/i,/^(?:classDef\s+)/i,/^(?:DEFAULT\s+)/i,/^(?:\w+\s+)/i,/^(?:[^\n]*)/i,/^(?:class\s+)/i,/^(?:(\w+)+((,\s*\w+)*))/i,/^(?:[^\n]*)/i,/^(?:style\s+)/i,/^(?:[\w,]+\s+)/i,/^(?:[^\n]*)/i,/^(?:scale\s+)/i,/^(?:\d+)/i,/^(?:\s+width\b)/i,/^(?:state\s+)/i,/^(?:.*<<fork>>)/i,/^(?:.*<<join>>)/i,/^(?:.*<<choice>>)/i,/^(?:.*\[\[fork\]\])/i,/^(?:.*\[\[join\]\])/i,/^(?:.*\[\[choice\]\])/i,/^(?:.*direction\s+TB[^\n]*)/i,/^(?:.*direction\s+BT[^\n]*)/i,/^(?:.*direction\s+RL[^\n]*)/i,/^(?:.*direction\s+LR[^\n]*)/i,/^(?:["])/i,/^(?:\s*as\s+)/i,/^(?:[^\n\{]*)/i,/^(?:["])/i,/^(?:[^"]*)/i,/^(?:[^\n\s\{]+)/i,/^(?:\n)/i,/^(?:\{)/i,/^(?:%%(?!\{)[^\n]*)/i,/^(?:\})/i,/^(?:[\n])/i,/^(?:note\s+)/i,/^(?:left of\b)/i,/^(?:right of\b)/i,/^(?:")/i,/^(?:\s*as\s*)/i,/^(?:["])/i,/^(?:[^"]*)/i,/^(?:[^\n]*)/i,/^(?:\s*[^:\n\s\-]+)/i,/^(?:\s*:[^:\n;]+)/i,/^(?:[\s\S]*?end note\b)/i,/^(?:stateDiagram\s+)/i,/^(?:stateDiagram-v2\s+)/i,/^(?:hide empty description\b)/i,/^(?:\[\*\])/i,/^(?:[^:\n\s\-\{]+)/i,/^(?:\s*:[^:\n;]+)/i,/^(?:-->)/i,/^(?:--)/i,/^(?::::)/i,/^(?:$)/i,/^(?:.)/i],conditions:{LINE:{rules:[12,13],inclusive:!1},struct:{rules:[12,13,25,29,32,38,45,46,47,48,57,58,59,60,74,75,76,77,78],inclusive:!1},FLOATING_NOTE_ID:{rules:[67],inclusive:!1},FLOATING_NOTE:{rules:[64,65,66],inclusive:!1},NOTE_TEXT:{rules:[69,70],inclusive:!1},NOTE_ID:{rules:[68],inclusive:!1},NOTE:{rules:[61,62,63],inclusive:!1},STYLEDEF_STYLEOPTS:{rules:[],inclusive:!1},STYLEDEF_STYLES:{rules:[34],inclusive:!1},STYLE_IDS:{rules:[],inclusive:!1},STYLE:{rules:[33],inclusive:!1},CLASS_STYLE:{rules:[31],inclusive:!1},CLASS:{rules:[30],inclusive:!1},CLASSDEFID:{rules:[28],inclusive:!1},CLASSDEF:{rules:[26,27],inclusive:!1},acc_descr_multiline:{rules:[23,24],inclusive:!1},acc_descr:{rules:[21],inclusive:!1},acc_title:{rules:[19],inclusive:!1},SCALE:{rules:[16,17,36,37],inclusive:!1},ALIAS:{rules:[],inclusive:!1},STATE_ID:{rules:[51],inclusive:!1},STATE_STRING:{rules:[52,53],inclusive:!1},FORK_STATE:{rules:[],inclusive:!1},STATE:{rules:[12,13,39,40,41,42,43,44,49,50,54,55,56],inclusive:!1},ID:{rules:[12,13],inclusive:!1},INITIAL:{rules:[0,1,2,3,4,5,6,7,8,9,10,11,13,14,15,18,20,22,25,29,32,35,38,56,60,71,72,73,74,75,76,77,79,80,81],inclusive:!0}}};return Y})();gt.lexer=qt;function ht(){this.yy={}}return u(ht,"Parser"),ht.prototype=gt,gt.Parser=ht,new ht})();vt.parser=vt;var Be=vt,de="TB",Yt="TB",Ot="dir",X="state",K="root",Ct="relation",fe="classDef",pe="style",Se="applyClass",tt="default",Gt="divider",Bt="fill:none",Vt="fill: #333",Mt="c",Ut="text",jt="normal",Dt="rect",kt="rectWithTitle",ye="stateStart",ge="stateEnd",Rt="divider",Nt="roundedWithTitle",Te="note",Ee="noteGroup",et="statediagram",_e="state",me=`${et}-${_e}`,Ht="transition",be="note",De="note-edge",ke=`${Ht} ${De}`,ve=`${et}-${be}`,Ce="cluster",Ae=`${et}-${Ce}`,xe="cluster-alt",Le=`${et}-${xe}`,zt="parent",Wt="note",Ie="state",At="----",Oe=`${At}${Wt}`,wt=`${At}${zt}`,Kt=u((t,e=Yt)=>{if(!t.doc)return e;let s=e;for(const a of t.doc)a.stmt==="dir"&&(s=a.value);return s},"getDir"),Re=u(function(t,e){return e.db.getClasses()},"getClasses"),Ne=u(async function(t,e,s,a){b.info("REF0:"),b.info("Drawing state diagram (v2)",e);const{securityLevel:r,state:h,layout:d}=w();a.db.extract(a.db.getRootDocV2());const S=a.db.getData(),f=te(e,r);S.type=a.type,S.layoutAlgorithm=d,S.nodeSpacing=h?.nodeSpacing||50,S.rankSpacing=h?.rankSpacing||50,S.markers=["barb"],S.diagramId=e,await se(S,f);const T=8;try{(typeof a.db.getLinks=="function"?a.db.getLinks():new Map).forEach((m,A)=>{const v=typeof A=="string"?A:typeof A?.id=="string"?A.id:"";if(!v){b.warn("⚠️ Invalid or missing stateId from key:",JSON.stringify(A));return}const p=f.node()?.querySelectorAll("g");let k;if(p?.forEach(I=>{I.textContent?.trim()===v&&(k=I)}),!k){b.warn("⚠️ Could not find node matching text:",v);return}const R=k.parentNode;if(!R){b.warn("⚠️ Node has no parent, cannot wrap:",v);return}const L=document.createElementNS("http://www.w3.org/2000/svg","a"),$=m.url.replace(/^"+|"+$/g,"");if(L.setAttributeNS("http://www.w3.org/1999/xlink","xlink:href",$),L.setAttribute("target","_blank"),m.tooltip){const I=m.tooltip.replace(/^"+|"+$/g,"");L.setAttribute("title",I)}R.replaceChild(L,k),L.appendChild(k),b.info("🔗 Wrapped node in <a> tag for:",v,m.url)})}catch(_){b.error("❌ Error injecting clickable links:",_)}ie.insertTitle(f,"statediagramTitleText",h?.titleTopMargin??25,a.db.getDiagramTitle()),ee(f,T,et,h?.useMaxWidth??!0)},"draw"),Ve={getClasses:Re,draw:Ne,getDir:Kt},St=new Map,G=0;function yt(t="",e=0,s="",a=At){const r=s!==null&&s.length>0?`${a}${s}`:"";return`${Ie}-${t}${r}-${e}`}u(yt,"stateDomId");var we=u((t,e,s,a,r,h,d,S)=>{b.trace("items",e),e.forEach(f=>{switch(f.stmt){case X:Z(t,f,s,a,r,h,d,S);break;case tt:Z(t,f,s,a,r,h,d,S);break;case Ct:{Z(t,f.state1,s,a,r,h,d,S),Z(t,f.state2,s,a,r,h,d,S);const T={id:"edge"+G,start:f.state1.id,end:f.state2.id,arrowhead:"normal",arrowTypeEnd:"arrow_barb",style:Bt,labelStyle:"",label:U.sanitizeText(f.description??"",w()),arrowheadStyle:Vt,labelpos:Mt,labelType:Ut,thickness:jt,classes:Ht,look:d};r.push(T),G++}break}})},"setupDoc"),$t=u((t,e=Yt)=>{let s=e;if(t.doc)for(const a of t.doc)a.stmt==="dir"&&(s=a.value);return s},"getDir");function Q(t,e,s){if(!e.id||e.id==="</join></fork>"||e.id==="</choice>")return;e.cssClasses&&(Array.isArray(e.cssCompiledStyles)||(e.cssCompiledStyles=[]),e.cssClasses.split(" ").forEach(r=>{const h=s.get(r);h&&(e.cssCompiledStyles=[...e.cssCompiledStyles??[],...h.styles])}));const a=t.find(r=>r.id===e.id);a?Object.assign(a,e):t.push(e)}u(Q,"insertOrUpdateNode");function Xt(t){return t?.classes?.join(" ")??""}u(Xt,"getClassesFromDbInfo");function Jt(t){return t?.styles??[]}u(Jt,"getStylesFromDbInfo");var Z=u((t,e,s,a,r,h,d,S)=>{const f=e.id,T=s.get(f),_=Xt(T),m=Jt(T),A=w();if(b.info("dataFetcher parsedItem",e,T,m),f!=="root"){let v=Dt;e.start===!0?v=ye:e.start===!1&&(v=ge),e.type!==tt&&(v=e.type),St.get(f)||St.set(f,{id:f,shape:v,description:U.sanitizeText(f,A),cssClasses:`${_} ${me}`,cssStyles:m});const p=St.get(f);e.description&&(Array.isArray(p.description)?(p.shape=kt,p.description.push(e.description)):p.description?.length&&p.description.length>0?(p.shape=kt,p.description===f?p.description=[e.description]:p.description=[p.description,e.description]):(p.shape=Dt,p.description=e.description),p.description=U.sanitizeTextOrArray(p.description,A)),p.description?.length===1&&p.shape===kt&&(p.type==="group"?p.shape=Nt:p.shape=Dt),!p.type&&e.doc&&(b.info("Setting cluster for XCX",f,$t(e)),p.type="group",p.isGroup=!0,p.dir=$t(e),p.shape=e.type===Gt?Rt:Nt,p.cssClasses=`${p.cssClasses} ${Ae} ${h?Le:""}`);const k={labelStyle:"",shape:p.shape,label:p.description,cssClasses:p.cssClasses,cssCompiledStyles:[],cssStyles:p.cssStyles,id:f,dir:p.dir,domId:yt(f,G),type:p.type,isGroup:p.type==="group",padding:8,rx:10,ry:10,look:d};if(k.shape===Rt&&(k.label=""),t&&t.id!=="root"&&(b.trace("Setting node ",f," to be child of its parent ",t.id),k.parentId=t.id),k.centerLabel=!0,e.note){const R={labelStyle:"",shape:Te,label:e.note.text,cssClasses:ve,cssStyles:[],cssCompiledStyles:[],id:f+Oe+"-"+G,domId:yt(f,G,Wt),type:p.type,isGroup:p.type==="group",padding:A.flowchart?.padding,look:d,position:e.note.position},L=f+wt,$={labelStyle:"",shape:Ee,label:e.note.text,cssClasses:p.cssClasses,cssStyles:[],id:f+wt,domId:yt(f,G,zt),type:"group",isGroup:!0,padding:16,look:d,position:e.note.position};G++,$.id=L,R.parentId=L,Q(a,$,S),Q(a,R,S),Q(a,k,S);let I=f,P=R.id;e.note.position==="left of"&&(I=R.id,P=f),r.push({id:I+"-"+P,start:I,end:P,arrowhead:"none",arrowTypeEnd:"",style:Bt,labelStyle:"",classes:ke,arrowheadStyle:Vt,labelpos:Mt,labelType:Ut,thickness:jt,look:d})}else Q(a,k,S)}e.doc&&(b.trace("Adding nodes children "),we(e,e.doc,s,a,r,!h,d,S))},"dataFetcher"),$e=u(()=>{St.clear(),G=0},"reset"),C={START_NODE:"[*]",START_TYPE:"start",END_NODE:"[*]",END_TYPE:"end",COLOR_KEYWORD:"color",FILL_KEYWORD:"fill",BG_FILL:"bgFill",STYLECLASS_SEP:","},Pt=u(()=>new Map,"newClassesList"),Ft=u(()=>({relations:[],states:new Map,documents:{}}),"newDoc"),pt=u(t=>JSON.parse(JSON.stringify(t)),"clone"),j,Me=(j=class{constructor(e){this.version=e,this.nodes=[],this.edges=[],this.rootDoc=[],this.classes=Pt(),this.documents={root:Ft()},this.currentDocument=this.documents.root,this.startEndCount=0,this.dividerCnt=0,this.links=new Map,this.getAccTitle=re,this.setAccTitle=ae,this.getAccDescription=ne,this.setAccDescription=oe,this.setDiagramTitle=le,this.getDiagramTitle=ce,this.clear(),this.setRootDoc=this.setRootDoc.bind(this),this.getDividerId=this.getDividerId.bind(this),this.setDirection=this.setDirection.bind(this),this.trimColon=this.trimColon.bind(this)}extract(e){this.clear(!0);for(const r of Array.isArray(e)?e:e.doc)switch(r.stmt){case X:this.addState(r.id.trim(),r.type,r.doc,r.description,r.note);break;case Ct:this.addRelation(r.state1,r.state2,r.description);break;case fe:this.addStyleClass(r.id.trim(),r.classes);break;case pe:this.handleStyleDef(r);break;case Se:this.setCssClass(r.id.trim(),r.styleClass);break;case"click":this.addLink(r.id,r.url,r.tooltip);break}const s=this.getStates(),a=w();$e(),Z(void 0,this.getRootDocV2(),s,this.nodes,this.edges,!0,a.look,this.classes);for(const r of this.nodes)if(Array.isArray(r.label)){if(r.description=r.label.slice(1),r.isGroup&&r.description.length>0)throw new Error(`Group nodes can only have label. Remove the additional description for node [${r.id}]`);r.label=r.label[0]}}handleStyleDef(e){const s=e.id.trim().split(","),a=e.styleClass.split(",");for(const r of s){let h=this.getState(r);if(!h){const d=r.trim();this.addState(d),h=this.getState(d)}h&&(h.styles=a.map(d=>d.replace(/;/g,"")?.trim()))}}setRootDoc(e){b.info("Setting root doc",e),this.rootDoc=e,this.version===1?this.extract(e):this.extract(this.getRootDocV2())}docTranslator(e,s,a){if(s.stmt===Ct){this.docTranslator(e,s.state1,!0),this.docTranslator(e,s.state2,!1);return}if(s.stmt===X&&(s.id===C.START_NODE?(s.id=e.id+(a?"_start":"_end"),s.start=a):s.id=s.id.trim()),s.stmt!==K&&s.stmt!==X||!s.doc)return;const r=[];let h=[];for(const d of s.doc)if(d.type===Gt){const S=pt(d);S.doc=pt(h),r.push(S),h=[]}else h.push(d);if(r.length>0&&h.length>0){const d={stmt:X,id:he(),type:"divider",doc:pt(h)};r.push(pt(d)),s.doc=r}s.doc.forEach(d=>this.docTranslator(s,d,!0))}getRootDocV2(){return this.docTranslator({id:K,stmt:K},{id:K,stmt:K,doc:this.rootDoc},!0),{id:K,doc:this.rootDoc}}addState(e,s=tt,a=void 0,r=void 0,h=void 0,d=void 0,S=void 0,f=void 0){const T=e?.trim();if(!this.currentDocument.states.has(T))b.info("Adding state ",T,r),this.currentDocument.states.set(T,{stmt:X,id:T,descriptions:[],type:s,doc:a,note:h,classes:[],styles:[],textStyles:[]});else{const _=this.currentDocument.states.get(T);if(!_)throw new Error(`State not found: ${T}`);_.doc||(_.doc=a),_.type||(_.type=s)}if(r&&(b.info("Setting state description",T,r),(Array.isArray(r)?r:[r]).forEach(m=>this.addDescription(T,m.trim()))),h){const _=this.currentDocument.states.get(T);if(!_)throw new Error(`State not found: ${T}`);_.note=h,_.note.text=U.sanitizeText(_.note.text,w())}d&&(b.info("Setting state classes",T,d),(Array.isArray(d)?d:[d]).forEach(m=>this.setCssClass(T,m.trim()))),S&&(b.info("Setting state styles",T,S),(Array.isArray(S)?S:[S]).forEach(m=>this.setStyle(T,m.trim()))),f&&(b.info("Setting state styles",T,S),(Array.isArray(f)?f:[f]).forEach(m=>this.setTextStyle(T,m.trim())))}clear(e){this.nodes=[],this.edges=[],this.documents={root:Ft()},this.currentDocument=this.documents.root,this.startEndCount=0,this.classes=Pt(),e||(this.links=new Map,ue())}getState(e){return this.currentDocument.states.get(e)}getStates(){return this.currentDocument.states}logDocuments(){b.info("Documents = ",this.documents)}getRelations(){return this.currentDocument.relations}addLink(e,s,a){this.links.set(e,{url:s,tooltip:a}),b.warn("Adding link",e,s,a)}getLinks(){return this.links}startIdIfNeeded(e=""){return e===C.START_NODE?(this.startEndCount++,`${C.START_TYPE}${this.startEndCount}`):e}startTypeIfNeeded(e="",s=tt){return e===C.START_NODE?C.START_TYPE:s}endIdIfNeeded(e=""){return e===C.END_NODE?(this.startEndCount++,`${C.END_TYPE}${this.startEndCount}`):e}endTypeIfNeeded(e="",s=tt){return e===C.END_NODE?C.END_TYPE:s}addRelationObjs(e,s,a=""){const r=this.startIdIfNeeded(e.id.trim()),h=this.startTypeIfNeeded(e.id.trim(),e.type),d=this.startIdIfNeeded(s.id.trim()),S=this.startTypeIfNeeded(s.id.trim(),s.type);this.addState(r,h,e.doc,e.description,e.note,e.classes,e.styles,e.textStyles),this.addState(d,S,s.doc,s.description,s.note,s.classes,s.styles,s.textStyles),this.currentDocument.relations.push({id1:r,id2:d,relationTitle:U.sanitizeText(a,w())})}addRelation(e,s,a){if(typeof e=="object"&&typeof s=="object")this.addRelationObjs(e,s,a);else if(typeof e=="string"&&typeof s=="string"){const r=this.startIdIfNeeded(e.trim()),h=this.startTypeIfNeeded(e),d=this.endIdIfNeeded(s.trim()),S=this.endTypeIfNeeded(s);this.addState(r,h),this.addState(d,S),this.currentDocument.relations.push({id1:r,id2:d,relationTitle:a?U.sanitizeText(a,w()):void 0})}}addDescription(e,s){const a=this.currentDocument.states.get(e),r=s.startsWith(":")?s.replace(":","").trim():s;a?.descriptions?.push(U.sanitizeText(r,w()))}cleanupLabel(e){return e.startsWith(":")?e.slice(2).trim():e.trim()}getDividerId(){return this.dividerCnt++,`divider-id-${this.dividerCnt}`}addStyleClass(e,s=""){this.classes.has(e)||this.classes.set(e,{id:e,styles:[],textStyles:[]});const a=this.classes.get(e);s&&a&&s.split(C.STYLECLASS_SEP).forEach(r=>{const h=r.replace(/([^;]*);/,"$1").trim();if(RegExp(C.COLOR_KEYWORD).exec(r)){const S=h.replace(C.FILL_KEYWORD,C.BG_FILL).replace(C.COLOR_KEYWORD,C.FILL_KEYWORD);a.textStyles.push(S)}a.styles.push(h)})}getClasses(){return this.classes}setCssClass(e,s){e.split(",").forEach(a=>{let r=this.getState(a);if(!r){const h=a.trim();this.addState(h),r=this.getState(h)}r?.classes?.push(s)})}setStyle(e,s){this.getState(e)?.styles?.push(s)}setTextStyle(e,s){this.getState(e)?.textStyles?.push(s)}getDirectionStatement(){return this.rootDoc.find(e=>e.stmt===Ot)}getDirection(){return this.getDirectionStatement()?.value??de}setDirection(e){const s=this.getDirectionStatement();s?s.value=e:this.rootDoc.unshift({stmt:Ot,value:e})}trimColon(e){return e.startsWith(":")?e.slice(1).trim():e.trim()}getData(){const e=w();return{nodes:this.nodes,edges:this.edges,other:{},config:e,direction:Kt(this.getRootDocV2())}}getConfig(){return w().state}},u(j,"StateDB"),j.relationType={AGGREGATION:0,EXTENSION:1,COMPOSITION:2,DEPENDENCY:3},j),Pe=u(t=>`
defs #statediagram-barbEnd {
    fill: ${t.transitionColor};
    stroke: ${t.transitionColor};
  }
g.stateGroup text {
  fill: ${t.nodeBorder};
  stroke: none;
  font-size: 10px;
}
g.stateGroup text {
  fill: ${t.textColor};
  stroke: none;
  font-size: 10px;

}
g.stateGroup .state-title {
  font-weight: bolder;
  fill: ${t.stateLabelColor};
}

g.stateGroup rect {
  fill: ${t.mainBkg};
  stroke: ${t.nodeBorder};
}

g.stateGroup line {
  stroke: ${t.lineColor};
  stroke-width: 1;
}

.transition {
  stroke: ${t.transitionColor};
  stroke-width: 1;
  fill: none;
}

.stateGroup .composit {
  fill: ${t.background};
  border-bottom: 1px
}

.stateGroup .alt-composit {
  fill: #e0e0e0;
  border-bottom: 1px
}

.state-note {
  stroke: ${t.noteBorderColor};
  fill: ${t.noteBkgColor};

  text {
    fill: ${t.noteTextColor};
    stroke: none;
    font-size: 10px;
  }
}

.stateLabel .box {
  stroke: none;
  stroke-width: 0;
  fill: ${t.mainBkg};
  opacity: 0.5;
}

.edgeLabel .label rect {
  fill: ${t.labelBackgroundColor};
  opacity: 0.5;
}
.edgeLabel {
  background-color: ${t.edgeLabelBackground};
  p {
    background-color: ${t.edgeLabelBackground};
  }
  rect {
    opacity: 0.5;
    background-color: ${t.edgeLabelBackground};
    fill: ${t.edgeLabelBackground};
  }
  text-align: center;
}
.edgeLabel .label text {
  fill: ${t.transitionLabelColor||t.tertiaryTextColor};
}
.label div .edgeLabel {
  color: ${t.transitionLabelColor||t.tertiaryTextColor};
}

.stateLabel text {
  fill: ${t.stateLabelColor};
  font-size: 10px;
  font-weight: bold;
}

.node circle.state-start {
  fill: ${t.specialStateColor};
  stroke: ${t.specialStateColor};
}

.node .fork-join {
  fill: ${t.specialStateColor};
  stroke: ${t.specialStateColor};
}

.node circle.state-end {
  fill: ${t.innerEndBackground};
  stroke: ${t.background};
  stroke-width: 1.5
}
.end-state-inner {
  fill: ${t.compositeBackground||t.background};
  // stroke: ${t.background};
  stroke-width: 1.5
}

.node rect {
  fill: ${t.stateBkg||t.mainBkg};
  stroke: ${t.stateBorder||t.nodeBorder};
  stroke-width: 1px;
}
.node polygon {
  fill: ${t.mainBkg};
  stroke: ${t.stateBorder||t.nodeBorder};;
  stroke-width: 1px;
}
#statediagram-barbEnd {
  fill: ${t.lineColor};
}

.statediagram-cluster rect {
  fill: ${t.compositeTitleBackground};
  stroke: ${t.stateBorder||t.nodeBorder};
  stroke-width: 1px;
}

.cluster-label, .nodeLabel {
  color: ${t.stateLabelColor};
  // line-height: 1;
}

.statediagram-cluster rect.outer {
  rx: 5px;
  ry: 5px;
}
.statediagram-state .divider {
  stroke: ${t.stateBorder||t.nodeBorder};
}

.statediagram-state .title-state {
  rx: 5px;
  ry: 5px;
}
.statediagram-cluster.statediagram-cluster .inner {
  fill: ${t.compositeBackground||t.background};
}
.statediagram-cluster.statediagram-cluster-alt .inner {
  fill: ${t.altBackground?t.altBackground:"#efefef"};
}

.statediagram-cluster .inner {
  rx:0;
  ry:0;
}

.statediagram-state rect.basic {
  rx: 5px;
  ry: 5px;
}
.statediagram-state rect.divider {
  stroke-dasharray: 10,10;
  fill: ${t.altBackground?t.altBackground:"#efefef"};
}

.note-edge {
  stroke-dasharray: 5;
}

.statediagram-note rect {
  fill: ${t.noteBkgColor};
  stroke: ${t.noteBorderColor};
  stroke-width: 1px;
  rx: 0;
  ry: 0;
}
.statediagram-note rect {
  fill: ${t.noteBkgColor};
  stroke: ${t.noteBorderColor};
  stroke-width: 1px;
  rx: 0;
  ry: 0;
}

.statediagram-note text {
  fill: ${t.noteTextColor};
}

.statediagram-note .nodeLabel {
  color: ${t.noteTextColor};
}
.statediagram .edgeLabel {
  color: red; // ${t.noteTextColor};
}

#dependencyStart, #dependencyEnd {
  fill: ${t.lineColor};
  stroke: ${t.lineColor};
  stroke-width: 1;
}

.statediagramTitleText {
  text-anchor: middle;
  font-size: 18px;
  fill: ${t.textColor};
}
`,"getStyles"),Ue=Pe;export{Me as S,Be as a,Ve as b,Ue as s};
