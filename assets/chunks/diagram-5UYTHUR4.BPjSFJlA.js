import{p as y}from"./chunk-353BL4L5.90YstFCN.js";import{_ as l,s as B,g as S,q as F,p as z,a as E,b as P,D as m,H as W,e as D,y as T,E as _,F as A,l as w}from"../app.BWMv7lGq.js";import{p as N}from"./treemap-75Q7IDZK.Cc79-AQK.js";import"./framework.D07zoyVj.js";import"./theme.BYPA23eO.js";import"./baseUniq.DZR4aQTg.js";import"./basePickBy.DSGA6H_v.js";import"./clone.vIH9vo7o.js";var x={packet:[]},v=structuredClone(x),L=A.packet,Y=l(()=>{const t=m({...L,..._().packet});return t.showBits&&(t.paddingY+=10),t},"getConfig"),H=l(()=>v.packet,"getPacket"),I=l(t=>{t.length>0&&v.packet.push(t)},"pushWord"),M=l(()=>{T(),v=structuredClone(x)},"clear"),u={pushWord:I,getPacket:H,getConfig:Y,clear:M,setAccTitle:P,getAccTitle:E,setDiagramTitle:z,getDiagramTitle:F,getAccDescription:S,setAccDescription:B},O=1e4,q=l(t=>{y(t,u);let e=-1,o=[],s=1;const{bitsPerRow:n}=u.getConfig();for(let{start:a,end:r,bits:c,label:f}of t.blocks){if(a!==void 0&&r!==void 0&&r<a)throw new Error(`Packet block ${a} - ${r} is invalid. End must be greater than start.`);if(a??(a=e+1),a!==e+1)throw new Error(`Packet block ${a} - ${r??a} is not contiguous. It should start from ${e+1}.`);if(c===0)throw new Error(`Packet block ${a} is invalid. Cannot have a zero bit field.`);for(r??(r=a+(c??1)-1),c??(c=r-a+1),e=r,w.debug(`Packet block ${a} - ${e} with label ${f}`);o.length<=n+1&&u.getPacket().length<O;){const[d,p]=G({start:a,end:r,bits:c,label:f},s,n);if(o.push(d),d.end+1===s*n&&(u.pushWord(o),o=[],s++),!p)break;({start:a,end:r,bits:c,label:f}=p)}}u.pushWord(o)},"populate"),G=l((t,e,o)=>{if(t.start===void 0)throw new Error("start should have been set during first phase");if(t.end===void 0)throw new Error("end should have been set during first phase");if(t.start>t.end)throw new Error(`Block start ${t.start} is greater than block end ${t.end}.`);if(t.end+1<=e*o)return[t,void 0];const s=e*o-1,n=e*o;return[{start:t.start,end:s,label:t.label,bits:s-t.start},{start:n,end:t.end,label:t.label,bits:t.end-n}]},"getNextFittingBlock"),K={parse:l(async t=>{const e=await N("packet",t);w.debug(e),q(e)},"parse")},R=l((t,e,o,s)=>{const n=s.db,a=n.getConfig(),{rowHeight:r,paddingY:c,bitWidth:f,bitsPerRow:d}=a,p=n.getPacket(),i=n.getDiagramTitle(),k=r+c,g=k*(p.length+1)-(i?0:r),b=f*d+2,h=W(e);h.attr("viewbox",`0 0 ${b} ${g}`),D(h,g,b,a.useMaxWidth);for(const[C,$]of p.entries())U(h,$,C,a);h.append("text").text(i).attr("x",b/2).attr("y",g-k/2).attr("dominant-baseline","middle").attr("text-anchor","middle").attr("class","packetTitle")},"draw"),U=l((t,e,o,{rowHeight:s,paddingX:n,paddingY:a,bitWidth:r,bitsPerRow:c,showBits:f})=>{const d=t.append("g"),p=o*(s+a)+a;for(const i of e){const k=i.start%c*r+1,g=(i.end-i.start+1)*r-n;if(d.append("rect").attr("x",k).attr("y",p).attr("width",g).attr("height",s).attr("class","packetBlock"),d.append("text").attr("x",k+g/2).attr("y",p+s/2).attr("class","packetLabel").attr("dominant-baseline","middle").attr("text-anchor","middle").text(i.label),!f)continue;const b=i.end===i.start,h=p-2;d.append("text").attr("x",k+(b?g/2:0)).attr("y",h).attr("class","packetByte start").attr("dominant-baseline","auto").attr("text-anchor",b?"middle":"start").text(i.start),b||d.append("text").attr("x",k+g).attr("y",h).attr("class","packetByte end").attr("dominant-baseline","auto").attr("text-anchor","end").text(i.end)}},"drawWord"),X={draw:R},j={byteFontSize:"10px",startByteColor:"black",endByteColor:"black",labelColor:"black",labelFontSize:"12px",titleColor:"black",titleFontSize:"14px",blockStrokeColor:"black",blockStrokeWidth:"1",blockFillColor:"#efefef"},J=l(({packet:t}={})=>{const e=m(j,t);return`
	.packetByte {
		font-size: ${e.byteFontSize};
	}
	.packetByte.start {
		fill: ${e.startByteColor};
	}
	.packetByte.end {
		fill: ${e.endByteColor};
	}
	.packetLabel {
		fill: ${e.labelColor};
		font-size: ${e.labelFontSize};
	}
	.packetTitle {
		fill: ${e.titleColor};
		font-size: ${e.titleFontSize};
	}
	.packetBlock {
		stroke: ${e.blockStrokeColor};
		stroke-width: ${e.blockStrokeWidth};
		fill: ${e.blockFillColor};
	}
	`},"styles"),st={parser:K,db:u,renderer:X,styles:J};export{st as diagram};
