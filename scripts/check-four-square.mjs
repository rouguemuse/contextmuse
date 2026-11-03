/**
 * Offline integrity check for the hybrid four-square homepage prototype.
 * Does not alter files, send inquiries, or require network.
 */
import fs from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";
import {execFileSync} from "node:child_process";
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const read=p=>fs.readFileSync(path.join(root,p),"utf8");
const html=read("prototypes/four-square/index.html");
const css=read("assets/css/four-square.css");
const controller=read("assets/js/four-square/controller.js");
const content=read("assets/js/four-square/content.js");
const site=JSON.parse(read("config/site.json"));
const offers=JSON.parse(read("config/offers.json"));
const errors=[];
const verify=(condition,message)=>{if(!condition)errors.push(message)};
const count=(source,pattern)=>Array.from(source.matchAll(pattern)).length;
const ids=Array.from(html.matchAll(/\bid="([^"]+)"/g),m=>m[1]);
verify(ids.length===new Set(ids).size,"Duplicate HTML IDs in prototype");
verify(site.homepage_quadrants.map(q=>q.id).join(",")==="work,build,lab,start","Four-square architecture drift");
for(const id of ["work","build","lab","start"]){
  verify(html.includes('data-square="'+id+'"'),"Missing quadrant "+id);
  verify(html.includes('id="fs-detail-'+id+'"'),"Missing panel "+id);
  const detail=new RegExp('id="fs-detail-'+id+'"[^>]*hidden');
  verify(detail.test(html),"Panel "+id+" must start hidden");
}
verify(count(html,/class="fs-quad fs-/g)===4,"Exactly four quadrants required");
verify(html.includes("CXM:SHARED_NAV_START") && html.includes("CXM:SHARED_FOOTER_END"),"Shared site shell not included");
verify(html.includes('src="/assets/js/four-square/controller.js"'),"Prototype controller not linked");
verify(html.includes('href="/assets/css/four-square.css"'),"Prototype stylesheet not linked");
verify(html.includes('name="robots" content="noindex,nofollow"'),"Prototype must not be indexed");
verify(offers.website_packages.length===3 && offers.care_packages.length===3,"Expected three website and care packages");
verify(!controller.includes('fetch("/api/lead')&&!controller.includes('fetch("/api/lead/'),"Prototype must not submit customer inquiries");
verify(controller.includes("popstate")&&controller.includes("prefers-reduced-motion"),"Missing browser history or reduced-motion functionality");
for(const script of ["assets/js/four-square/controller.js","assets/js/four-square/content.js"]){
  try{execFileSync(process.execPath,["--check",path.join(root,script)],{stdio:"pipe"})}
  catch(e){errors.push("Invalid JS syntax: "+script+" "+(e.stderr||"").toString().slice(0,220))}
}
for(const value of [html,content]){
  const matches=[...value.matchAll(/(?:href|src|image|href):?\s*[=:]\s*["'](\/assets\/[^"']+)["']/g)].map(m=>m[1]);
  for(const src of matches){
    verify(fs.existsSync(path.join(root,src.replace(/^\//,""))),"Missing asset "+src);
  }
}
verify(css.includes("@media(max-width:700px)")&&css.includes("prefers-reduced-motion"),"Missing responsive / reduced-motion CSS");
if(errors.length){
  for(const message of errors)console.error("FAIL "+message);
  process.exitCode=1;
}else console.log("PASS: Four squares, shared shell, existing assets, configuration, JavaScript syntax, keyboard/history wiring and mobile/reduced-motion declarations");
