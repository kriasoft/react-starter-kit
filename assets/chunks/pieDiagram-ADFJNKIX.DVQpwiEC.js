import{a8 as S,a3 as F,aG as j,_ as p,g as q,s as H,a as Z,b as J,q as K,p as Q,l as z,c as X,D as Y,H as ee,N as te,e as ae,y as re,F as ne}from"../app.DOrFkpxr.js";import{p as ie}from"./chunk-4BX2VUAB.D1cOoNtn.js";import{p as se}from"./treemap-75Q7IDZK.Y10EHYZm.js";import{d as I}from"./arc.TwqTNIf0.js";import{o as le}from"./ordinal.BYWQX77i.js";import"./framework.DeR51Uty.js";import"./theme.Cc6wR1BA.js";import"./baseUniq.7PDH0tog.js";import"./basePickBy.BePwhbw-.js";import"./clone.CMcafZzi.js";import"./init.Gi6I4Gst.js";function oe(e,a){return a<e?-1:a>e?1:a>=e?0:NaN}function ce(e){return e}function ue(){var e=ce,a=oe,f=null,y=S(0),s=S(F),o=S(0);function l(t){var n,c=(t=j(t)).length,g,x,h=0,u=new Array(c),i=new Array(c),v=+y.apply(this,arguments),w=Math.min(F,Math.max(-F,s.apply(this,arguments)-v)),m,C=Math.min(Math.abs(w)/c,o.apply(this,arguments)),$=C*(w<0?-1:1),d;for(n=0;n<c;++n)(d=i[u[n]=n]=+e(t[n],n,t))>0&&(h+=d);for(a!=null?u.sort(function(A,D){return a(i[A],i[D])}):f!=null&&u.sort(function(A,D){return f(t[A],t[D])}),n=0,x=h?(w-c*$)/h:0;n<c;++n,v=m)g=u[n],d=i[g],m=v+(d>0?d*x:0)+$,i[g]={data:t[g],index:n,value:d,startAngle:v,endAngle:m,padAngle:C};return i}return l.value=function(t){return arguments.length?(e=typeof t=="function"?t:S(+t),l):e},l.sortValues=function(t){return arguments.length?(a=t,f=null,l):a},l.sort=function(t){return arguments.length?(f=t,a=null,l):f},l.startAngle=function(t){return arguments.length?(y=typeof t=="function"?t:S(+t),l):y},l.endAngle=function(t){return arguments.length?(s=typeof t=="function"?t:S(+t),l):s},l.padAngle=function(t){return arguments.length?(o=typeof t=="function"?t:S(+t),l):o},l}var pe=ne.pie,G={sections:new Map,showData:!1},T=G.sections,N=G.showData,ge=structuredClone(pe),de=p(()=>structuredClone(ge),"getConfig"),fe=p(()=>{T=new Map,N=G.showData,re()},"clear"),me=p(({label:e,value:a})=>{if(a<0)throw new Error(`"${e}" has invalid value: ${a}. Negative values are not allowed in pie charts. All slice values must be >= 0.`);T.has(e)||(T.set(e,a),z.debug(`added new section: ${e}, with value: ${a}`))},"addSection"),he=p(()=>T,"getSections"),ve=p(e=>{N=e},"setShowData"),Se=p(()=>N,"getShowData"),L={getConfig:de,clear:fe,setDiagramTitle:Q,getDiagramTitle:K,setAccTitle:J,getAccTitle:Z,setAccDescription:H,getAccDescription:q,addSection:me,getSections:he,setShowData:ve,getShowData:Se},ye=p((e,a)=>{ie(e,a),a.setShowData(e.showData),e.sections.map(a.addSection)},"populateDb"),xe={parse:p(async e=>{const a=await se("pie",e);z.debug(a),ye(a,L)},"parse")},we=p(e=>`
  .pieCircle{
    stroke: ${e.pieStrokeColor};
    stroke-width : ${e.pieStrokeWidth};
    opacity : ${e.pieOpacity};
  }
  .pieOuterCircle{
    stroke: ${e.pieOuterStrokeColor};
    stroke-width: ${e.pieOuterStrokeWidth};
    fill: none;
  }
  .pieTitleText {
    text-anchor: middle;
    font-size: ${e.pieTitleTextSize};
    fill: ${e.pieTitleTextColor};
    font-family: ${e.fontFamily};
  }
  .slice {
    font-family: ${e.fontFamily};
    fill: ${e.pieSectionTextColor};
    font-size:${e.pieSectionTextSize};
    // fill: white;
  }
  .legend text {
    fill: ${e.pieLegendTextColor};
    font-family: ${e.fontFamily};
    font-size: ${e.pieLegendTextSize};
  }
`,"getStyles"),Ae=we,De=p(e=>{const a=[...e.values()].reduce((s,o)=>s+o,0),f=[...e.entries()].map(([s,o])=>({label:s,value:o})).filter(s=>s.value/a*100>=1).sort((s,o)=>o.value-s.value);return ue().value(s=>s.value)(f)},"createPieArcs"),Ce=p((e,a,f,y)=>{z.debug(`rendering pie chart
`+e);const s=y.db,o=X(),l=Y(s.getConfig(),o.pie),t=40,n=18,c=4,g=450,x=g,h=ee(a),u=h.append("g");u.attr("transform","translate("+x/2+","+g/2+")");const{themeVariables:i}=o;let[v]=te(i.pieOuterStrokeWidth);v??(v=2);const w=l.textPosition,m=Math.min(x,g)/2-t,C=I().innerRadius(0).outerRadius(m),$=I().innerRadius(m*w).outerRadius(m*w);u.append("circle").attr("cx",0).attr("cy",0).attr("r",m+v/2).attr("class","pieOuterCircle");const d=s.getSections(),A=De(d),D=[i.pie1,i.pie2,i.pie3,i.pie4,i.pie5,i.pie6,i.pie7,i.pie8,i.pie9,i.pie10,i.pie11,i.pie12];let b=0;d.forEach(r=>{b+=r});const W=A.filter(r=>(r.data.value/b*100).toFixed(0)!=="0"),E=le(D);u.selectAll("mySlices").data(W).enter().append("path").attr("d",C).attr("fill",r=>E(r.data.label)).attr("class","pieCircle"),u.selectAll("mySlices").data(W).enter().append("text").text(r=>(r.data.value/b*100).toFixed(0)+"%").attr("transform",r=>"translate("+$.centroid(r)+")").style("text-anchor","middle").attr("class","slice"),u.append("text").text(s.getDiagramTitle()).attr("x",0).attr("y",-400/2).attr("class","pieTitleText");const O=[...d.entries()].map(([r,M])=>({label:r,value:M})),k=u.selectAll(".legend").data(O).enter().append("g").attr("class","legend").attr("transform",(r,M)=>{const R=n+c,B=R*O.length/2,V=12*n,U=M*R-B;return"translate("+V+","+U+")"});k.append("rect").attr("width",n).attr("height",n).style("fill",r=>E(r.label)).style("stroke",r=>E(r.label)),k.append("text").attr("x",n+c).attr("y",n-c).text(r=>s.getShowData()?`${r.label} [${r.value}]`:r.label);const _=Math.max(...k.selectAll("text").nodes().map(r=>(r==null?void 0:r.getBoundingClientRect().width)??0)),P=x+t+n+c+_;h.attr("viewBox",`0 0 ${P} ${g}`),ae(h,g,P,l.useMaxWidth)},"draw"),$e={draw:Ce},Pe={parser:xe,db:L,renderer:$e,styles:Ae};export{Pe as diagram};
