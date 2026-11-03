/**
 * Read-only validation for Context & Muse site/offer configuration.
 * npm run check:site-config
 *
 * This is intentionally independent of the protected lead backend.
 */
import fs from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const read=(p)=>fs.readFileSync(path.join(root,p),"utf8");
const site=JSON.parse(read("config/site.json"));
const offers=JSON.parse(read("config/offers.json"));
const service=read("services/index.html");
const contact=read("contact/index.html");
const problems=[];
const assert=(condition,message)=>{if(!condition)problems.push(message)};
const ids=site.homepage_quadrants.map(x=>x.id);
assert(ids.join(",")==="work,build,lab,start","Four-square architecture must stay work/build/lab/start");
assert(site.homepage_quadrants.find(x=>x.id==="build")?.href==="/services/","Build square must lead to /services/");
assert(site.homepage_quadrants.find(x=>x.id==="lab")?.href==="/lab/","Lab square must lead to /lab/");
assert(new Set(site.primary_navigation.map(x=>x.label)).size===site.primary_navigation.length,"Duplicate primary navigation labels");
assert(new Set(offers.website_packages.map(x=>x.id)).size===offers.website_packages.length,"Duplicate website tier IDs");
assert(new Set(offers.care_packages.map(x=>x.id)).size===offers.care_packages.length,"Duplicate care plan IDs");
assert(offers.website_packages.length===3 && offers.care_packages.length===3,"Expected three website and three care tiers");
assert(offers.website_packages.every(x=>Number.isInteger(x.price)&&x.price>0),"Build tiers must have positive integer prices");
assert(offers.care_packages.every(x=>Number.isInteger(x.price)&&x.price>0&&x.interval==="month"),"Care tiers must have monthly positive prices");
assert(offers.website_packages.every(x=>x.features.length>0&&x.limits.length>0),"Website offers must define inclusions and exclusions");
assert(offers.care_packages.every(x=>x.features.length>0&&x.exclusions.length>0),"Care offers must define inclusions and exclusions");
assert(service.includes("<!-- CXM:GENERATED_SERVICES_START -->"),"Services markup must remain generated");
assert(service.includes('id="care-plans"'),"Hosting/care anchor missing");
assert(service.includes("CXM:SHARED_NAV_START")&&service.includes("CXM:SHARED_FOOTER_START"),"Services page missing canonical shell");
assert(contact.includes('id="requested-offer"'),"Contact page is missing the requested offer attribution");
assert(contact.includes('action="/api/lead"'),"Existing lead form endpoint changed");
const allLinks=[];
function addLinks(v){if(Array.isArray(v)){v.forEach(addLinks);return}if(v&&typeof v==="object"){if(typeof v.href==="string")allLinks.push(v.href);Object.values(v).forEach(addLinks)}}
addLinks(site.homepage_quadrants);addLinks(site.primary_navigation);addLinks(site.footer_columns);addLinks(site.primary_cta);
for(const url of allLinks){
 if(!url.startsWith("/"))continue;
 const [p,hash]=url.split("#");
 const clean=(p.split("?")[0]||"/").replace(/^\/+/,"");
 const filename=path.join(root,clean,clean.endsWith(".html")?"":"index.html");
 assert(fs.existsSync(filename),"Navigation route does not exist: "+url);
 if(hash&&fs.existsSync(filename)){
  const source=fs.readFileSync(filename,"utf8");
  assert(source.includes('id="'+hash+'"')||source.includes("id='"+hash+"'"),"Navigation anchor does not exist: "+url);
 }
}
const expected=['/contact/?service=website-launch','/contact/?service=website-business','/contact/?service=website-growth','/contact/?service=hosting','/contact/?service=care-essential','/contact/?service=care-growth'];
for(const href of expected)assert(contact.includes("'"+href.split("service=")[1]+"'"),"Contact route has no offer mapping: "+href);
if(problems.length){for(const err of problems)console.error("FAIL:",err);process.exitCode=1}
else console.log("PASS: four-square navigation, offer boundaries, pricing source, service page and inquiry mapping");
