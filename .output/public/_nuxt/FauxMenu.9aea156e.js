import{f as c}from"./useFonts.08393901.js";import{L as d,m,o as t,F as r,M as u,N as i,Q as _,X as h}from"./entry.34beaa91.js";const g={props:{theme:String,themeBackground:String},setup(e){return{dotColor:m(()=>{if(e.theme!=="color")return c(e.themeBackground).darken(e.theme==="light"?1:-3).alpha(.5).hex()}),dots:[0,1,2],classes:["bg-red-500","bg-yellow-400","bg-green-400"]}}},f={class:"flex items-center gap-2"};function k(e,n,s,o,p,x){return t(),r("div",f,[(t(!0),r(u,null,i(o.dots,(a,l)=>(t(),r("div",{class:_(["w-3 h-3 rounded-full",s.theme==="color"?o.classes[a]:null]),key:l,style:h({backgroundColor:o.dotColor})},null,6))),128))])}const y=d(g,[["render",k]]);export{y as default};
