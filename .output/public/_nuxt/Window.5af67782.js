import F from"./FauxMenu.9aea156e.js";import M from"./Code.5ae399b1.js";import{a as z,l as g,f as _}from"./useFonts.08393901.js";import{L as H,x as u,m as l,w as B,o as s,F as a,X as c,c as N,W as C,Q as m,U as V,af as W,G as U,M as D,N as I,V as X,$ as j,b as E}from"./entry.34beaa91.js";import"./CodeLine.11de981f.js";const G={props:{blocks:{type:Array,default:()=>[]},preview:{type:Boolean,default:!1},settings:{type:Object,default:()=>{}}},setup(e,{emit:o}){const{fontFamilies:t}=z(),n=u(null),h=u(null),b=u(!1),d=u(e.settings.title||""),f=()=>{b.value=!0,E(()=>h.value.focus())},r=l(()=>{const i=t.value.find(A=>A.name===e.settings.fontFamily);return g.exports.get(i,"attributes",{class:"font-mono"})}),x=l(()=>g.exports.merge(g.exports.cloneDeep(r.value),{style:{paddingLeft:`${y("left")}px`,paddingRight:`${y("right")}px`}})),w=l(()=>_(e.settings.themeBackground).darken(e.settings.themeType==="light"?1:-3).alpha(.25).hex()),v=l(()=>_(e.settings.themeBackground).darken(e.settings.themeType==="light"?1:-3).alpha(.1).hex()),k=l(()=>{if(!e.settings.showShadow||!e.settings.shadowColor)return;const i=`${e.settings.shadowColor.red}, ${e.settings.shadowColor.green}, ${e.settings.shadowColor.blue}, ${e.settings.shadowColor.alpha}`;return`${e.settings.shadowX}px ${e.settings.shadowY}px ${e.settings.shadowBlur}px ${e.settings.shadowSpread}px rgba(${i})`}),T=l(()=>e.settings.borderRadiusLocked?`${e.settings.borderRadius}px`:`${e.settings.borderRadiusTopLeft}px ${e.settings.borderRadiusTopRight}px ${e.settings.borderRadiusBottomRight}px ${e.settings.borderRadiusBottomLeft}px`),R=l(()=>{if(!e.settings.showBorder||!e.settings.borderColor)return;const i=`${e.settings.borderColor.red}, ${e.settings.borderColor.green}, ${e.settings.borderColor.blue}, ${e.settings.borderColor.alpha}`;return`${e.settings.borderWidth}px solid rgba(${i})`}),L=()=>n.value.clientWidth,S=()=>n.value.clientHeight,y=i=>e.settings.paddingLocked?e.settings.padding:g.exports.get(e.settings,`padding${g.exports.capitalize(i)}`);return B(d,i=>o("update:title",i)),B(()=>e.settings.title,i=>d.value=i),{root:n,title:d,editTitle:f,editingTitle:b,titleInput:h,border:R,padding:y,boxShadow:k,borderColor:w,borderRadius:T,backgroundAccentColor:v,actualWidth:L,actualHeight:S,codeAttributes:x}}},O=["readonly"],P={key:1,class:"text-sm font-medium"};function Q(e,o,t,n,h,b){const d=F,f=M;return s(),a("div",{ref:"root",class:m(["overflow-hidden",[{"divide-y":t.blocks.length>1,"origin-center":t.settings.position==="center","origin-top":t.settings.position==="top","origin-bottom":t.settings.position==="bottom","origin-left":t.settings.position==="left","origin-right":t.settings.position==="right"}]]),style:c({border:n.border,boxShadow:n.boxShadow,borderRadius:n.borderRadius,fontSize:`${t.settings.fontSize}px`,transform:`scale(${t.settings.scale})`,lineHeight:`${t.settings.lineHeight}px`,marginTop:`${t.settings.marginTop}px`,marginBottom:`${t.settings.marginBottom}px`,marginLeft:`${t.settings.marginLeft}px`,marginRight:`${t.settings.marginRight}px`,backgroundColor:t.settings.themeBackground})},[t.settings.showHeader?(s(),a("div",{key:0,class:"relative flex items-center h-12 p-4 overflow-hidden",style:c({borderColor:n.borderColor,backgroundColor:n.backgroundAccentColor})},[t.settings.showMenu?(s(),N(d,{key:0,class:"absolute","theme-background":t.settings.themeBackground,theme:t.settings.showColorMenu?"color":t.settings.themeType},null,8,["theme-background","theme"])):C("",!0),t.settings.showTitle?(s(),a("div",{key:1,onClick:o[2]||(o[2]=r=>t.preview?null:n.editTitle()),class:m([{"mx-14":t.settings.showMenu},"w-full px-2 text-center text-gray-400 whitespace-nowrap"])},[n.editingTitle||n.title.length>0?V((s(),a("input",{key:0,type:"text",ref:"titleInput","onUpdate:modelValue":o[0]||(o[0]=r=>n.title=r),readonly:t.preview,onBlur:o[1]||(o[1]=r=>n.editingTitle=!1),style:c({width:`${n.title.length/1.75}em`}),class:m([{"cursor-pointer pointer-events-none":t.preview},"p-0 text-sm font-medium text-center bg-transparent border-0 shadow-none focus:ring-0"])},null,46,O)),[[W,n.title]]):(s(),a("span",P," Untitled-1 "))],2)):C("",!0)],4)):C("",!0),U("div",{class:m([{"flex divide-x":t.settings.landscape&&t.blocks.length>1,"flex flex-col divide-y":!t.settings.landscape&&t.blocks.length>1}]),style:c({borderColor:n.borderColor})},[(s(!0),a(D,null,I(t.blocks,({lines:r,added:x,removed:w,focused:v},k)=>(s(),a("div",{class:"flex items-center overflow-hidden",key:k,style:c({borderColor:n.borderColor,paddingTop:`${n.padding("top")}px`,paddingBottom:`${n.padding("bottom")}px`})},[X(f,j({class:"relative w-full"},n.codeAttributes,{lines:r,added:x,removed:w,focused:v,preview:t.preview,"theme-type":t.settings.themeType,"show-line-numbers":t.settings.showLineNumbers}),null,16,["lines","added","removed","focused","preview","theme-type","show-line-numbers"])],4))),128))],6)],6)}const $=H(G,[["render",Q]]);export{$ as default};
