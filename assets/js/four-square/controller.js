import {projectProofs, labShelves, problemPaths} from "./content.js";

/**
 * Four-Square interaction controller
 *
 * The outer 2×2 grid is the Context & Muse identity. Each panel has
 * independent interactions, while routes and prices come from config.
 *
 * This prototype never submits an actual booking or captures email.
 */
const byId=id=>document.getElementById(id);
const grid=byId("fs-grid");
const squares=["work","build","lab","start"];
const safeId=(candidate,allowed,fallback)=>allowed.includes(candidate)?candidate:fallback;
const reduceMotion=window.matchMedia("(prefers-reduced-motion: reduce)");
const state={active:null,project:"lonewolf",step:0,buildMode:"websites",tier:null,lab:"products",need:null};
let siteConfig=null;
let offersConfig=null;
let offersStatus="loading";
let isRestoring=false;

const encodeText=(value)=>String(value??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
const price=(num)=>Number.isFinite(Number(num))?"$"+Number(num).toLocaleString("en-US"):"Request scope";

function syncURL(push=true){
  if(isRestoring)return;
  const next=new URL(window.location.href);
  for(const key of ["square","project","step","mode","tier","shelf","problem"])next.searchParams.delete(key);
  if(state.active){
    next.searchParams.set("square",state.active);
    if(state.active==="work"){next.searchParams.set("project",state.project);next.searchParams.set("step",String(state.step+1))}
    if(state.active==="build"){next.searchParams.set("mode",state.buildMode);if(state.tier)next.searchParams.set("tier",state.tier)}
    if(state.active==="lab")next.searchParams.set("shelf",state.lab);
    if(state.active==="start"&&state.need)next.searchParams.set("problem",state.need);
  }
  if(next.pathname+next.search!==location.pathname+location.search){
    history[push?"pushState":"replaceState"]({fourSquare:true},"",next.pathname+next.search+next.hash);
  }
}
function setActive(id,{push=true,focus=false,scroll=false}={}){
  id=id===null?null:safeId(id,squares,null);
  state.active=id;
  grid.classList.toggle("is-expanded",!!id);
  grid.dataset.active=id||"none";
  let rail=0;
  for(const key of squares){
    const article=byId("square-"+key),trigger=article.querySelector(".fs-quad-trigger"),detail=byId("fs-detail-"+key);
    const selected=key===id;
    article.classList.toggle("is-active",selected);
    trigger.setAttribute("aria-expanded",selected?"true":"false");
    detail.hidden=!selected;
    if(id&&!selected){rail++;article.style.gridRow=String(rail)}else{article.style.removeProperty("grid-row")}
    if(!id)article.style.removeProperty("grid-column");
  }
  const status=id?"0"+(squares.indexOf(id)+1)+" / "+id.toUpperCase()+" OPEN":"01—04 / ALL OPEN";
  byId("fs-stage-state").textContent=status;
  if(push)syncURL(true);
  if(focus){
    const target=id?byId("fs-detail-"+id).querySelector(".fs-collapse"):byId("square-"+(setActive.lastActive||"work")).querySelector(".fs-quad-trigger");
    if(target)target.focus({preventScroll:true});
  }
  if(id)setActive.lastActive=id;
  if(scroll&&window.innerWidth<701){
    const target=id?byId("square-"+id):grid;
    target.scrollIntoView({behavior:reduceMotion.matches?"auto":"smooth",block:"start"});
  }
}
function button(label,className,click){
  const b=document.createElement("button");
  b.type="button";b.className=className;b.textContent=label;b.addEventListener("click",click);
  return b;
}

function renderWork(){
  const selected=projectProofs.find(x=>x.id===state.project)||projectProofs[0];
  state.project=selected.id;
  const container=byId("fs-project-buttons");
  container.replaceChildren();
  projectProofs.forEach((project,i)=>{
    const b=button(project.short,"fs-project-button",()=>{
      state.project=project.id;state.step=0;renderWork();syncURL(true);
    });
    b.setAttribute("aria-pressed",String(state.project===project.id));
    const n=document.createElement("span");n.textContent=String(i+1).padStart(2,"0");
    const t=document.createElement("span");t.textContent=project.short;
    b.replaceChildren(n,t);
    container.append(b);
  });
  const image=byId("fs-project-image");image.src=selected.image;image.alt=selected.imageAlt;
  byId("fs-project-image-label").textContent="REAL PROJECT / DOCUMENTED INTERFACE";
  byId("fs-project-eyebrow").textContent=selected.eyebrow;
  byId("fs-project-heading").textContent=selected.name;
  byId("fs-project-summary").textContent=selected.description;
  const tags=byId("fs-project-tags");tags.replaceChildren();
  for(const tag of selected.tags){const el=document.createElement("span");el.textContent=tag;tags.append(el)}
  const link=byId("fs-work-link");link.href=selected.href;link.setAttribute("aria-label","See the "+selected.name+" full case study");
  state.step=Math.max(0,Math.min(selected.walkthrough.length-1,state.step));
  const steps=byId("fs-step-buttons");steps.replaceChildren();
  selected.walkthrough.forEach((step,index)=>{
    const b=button(String(index+1).padStart(2,"0")+" / "+step.tag,"",()=>{
      state.step=index;renderWork();syncURL(true);
    });
    b.setAttribute("aria-pressed",String(state.step===index));
    steps.append(b);
  });
  const current=selected.walkthrough[state.step];
  byId("fs-step-title").textContent=current.title;
  byId("fs-step-description").textContent=current.description;
  byId("fs-step-count").textContent=String(state.step+1).padStart(2,"0")+" / "+String(selected.walkthrough.length).padStart(2,"0");
}

function getBuildPlans(){
  if(!offersConfig)return[];
  if(state.buildMode==="websites"){
    return (offersConfig.website_packages||[]).map(x=>({
      ...x,headline:x.subtitle||x.label,summary:x.description,
      bullets:x.features||[],exclusions:x.limits||[],displayPrice:price(x.price),
      href:x.href||"/contact/",linkText:x.cta||"Discuss website"
    }));
  }
  if(state.buildMode==="care"){
    return (offersConfig.care_packages||[]).map(x=>({
      ...x,headline:x.subtitle||x.label,summary:x.description,
      bullets:x.features||[],exclusions:x.exclusions||[],displayPrice:price(x.price)+"/mo",
      href:x.href||"/contact/",linkText:"Discuss "+x.label
    }));
  }
  const offers=offersConfig.offers||[];
  return [
    {id:"quote-lead",label:"Lead + Quote",headline:"Qualification, calculations, and useful inquiries.",
     summary:"Scoped lead generation and quote systems. A 48-market engine like Lone Wolf is not included in a standard small website.",
     bullets:["Customer qualification and intake","Rules-based calculations or territory logic","Integrations and SEO architecture quoted separately"],
     exclusions:["No full multi-market network in the base starting scope","Database, payment and complex integrations quoted separately"],
     displayPrice:"From "+price(offers.find(x=>x.id==="quote-lead")?.price?.amount),href:"/services/quote-lead-systems/",linkText:"Explore quote engines"},
    {id:"operations",label:"Operations",headline:"Software that actually runs the workflow.",
     summary:"Booking, stock availability, field estimation, dashboards and internal tools scoped to how the business works.",
     bullets:["Business logic and persistence as required","Client or staff workflow interfaces","Testing and reliable handoff"],
     exclusions:["External integrations, ongoing support and migration separately scoped","No blanket guarantee of features at the starting price"],
     displayPrice:"From "+price(offers.find(x=>x.id==="operations-build")?.price?.amount),href:"/systems/",linkText:"See operations systems"},
    {id:"creative-scope",label:"Creative",headline:"A distinct creative or editorial system.",
     summary:"Brand systems, business documents, social content frameworks and narrative worlds have their own agreed deliverables.",
     bullets:["A defined outcome and deliverable list","Visual direction and production milestones","Editable assets where included in scope"],
     exclusions:["Unlimited content production and community management not included","Licensing, software subscriptions and future edits quoted"],
     displayPrice:"Custom quote",href:"/creative/",linkText:"See creative work"}
  ];
}

function renderBuild(){
  for(const b of document.querySelectorAll("[data-build-mode]")){
    b.setAttribute("aria-pressed",String(b.dataset.buildMode===state.buildMode));
  }
  if(!offersConfig){
    byId("fs-plan-list").replaceChildren();
    const area=byId("fs-plan-detail");
    if(offersStatus==="loading")area.innerHTML='<div class="fs-micro">SERVICE CATALOG</div><h3>Reading the current scope.</h3><p>Loading offers from the shared configuration.</p>';
    else area.innerHTML='<div class="fs-micro">PRICING UNAVAILABLE</div><h3>Open the Services page.</h3><p>Unable to load the authoritative offer configuration. No package prices are shown until the source is available.</p><a class="fs-plan-cta" href="/services/">Services &amp; pricing ↗</a>';
    return;
  }
  const plans=getBuildPlans();
  if(!plans.some(p=>p.id===state.tier))state.tier=state.buildMode==="websites"?"business":state.buildMode==="care"?"essential":"operations";
  if(!plans.some(p=>p.id===state.tier))state.tier=plans[0]?.id||null;
  const list=byId("fs-plan-list");list.replaceChildren();
  plans.forEach(p=>{
    const b=button(p.label,"fs-plan-option",()=>{
      state.tier=p.id;renderBuild();syncURL(true);
    });
    b.setAttribute("aria-pressed",String(p.id===state.tier));
    const n=document.createElement("span");n.textContent=p.label;
    const v=document.createElement("strong");v.textContent=p.displayPrice;
    b.replaceChildren(n,v);list.append(b);
  });
  const selected=plans.find(x=>x.id===state.tier);
  if(!selected)return;
  const area=byId("fs-plan-detail");
  area.replaceChildren();
  const head=document.createElement("div");head.className="fs-plan-head";
  const k=document.createElement("span");k.className="fs-micro";k.textContent=(state.buildMode==="care"?"MONTHLY SITE CARE":state.buildMode==="custom"?"CUSTOM SYSTEM SCOPE":"ONE-TIME WEBSITE PACKAGE");
  head.append(k);area.append(head);
  const title=document.createElement("h3");title.textContent=selected.headline;area.append(title);
  const desc=document.createElement("p");desc.textContent=selected.summary||"";area.append(desc);
  const columns=document.createElement("div");columns.className="fs-plan-columns";
  for(const group of [{title:"IN SCOPE",items:selected.bullets},{title:"OUT OF SCOPE",items:selected.exclusions}]){
    const holder=document.createElement("div");const label=document.createElement("span");label.className="fs-micro";label.textContent=group.title;
    const ul=document.createElement("ul");for(const item of group.items){const li=document.createElement("li");li.textContent=item;ul.append(li)}
    holder.append(label,ul);columns.append(holder);
  }
  area.append(columns);
  const link=document.createElement("a");link.className="fs-plan-cta";link.href=selected.href;link.textContent=selected.linkText+" ↗";area.append(link);
}

function setBuildMode(mode,push=true){
  state.buildMode=safeId(mode,["websites","care","custom"],"websites");
  state.tier=null;renderBuild();if(push)syncURL(true);
}

function renderLab(){
  const shelf=labShelves.find(x=>x.id===state.lab)||labShelves[0];state.lab=shelf.id;
  const buttons=byId("fs-lab-modes");buttons.replaceChildren();
  for(const s of labShelves){
    const b=button(s.label,"",()=>{state.lab=s.id;renderLab();syncURL(true)});
    b.setAttribute("aria-pressed",String(state.lab===s.id));buttons.append(b);
  }
  byId("fs-lab-type").textContent=shelf.number+" / "+shelf.label.toUpperCase();
  byId("fs-lab-title").textContent=shelf.headline;
  byId("fs-lab-description").textContent=shelf.description;
  const list=byId("fs-lab-items");list.replaceChildren();
  shelf.items.forEach(item=>{
    const a=document.createElement("a");a.className="fs-lab-card";a.href=item.href;
    const img=document.createElement("img");img.src=item.image;img.alt=item.title+" project visual";img.loading="lazy";
    const body=document.createElement("span");body.className="fs-lab-card-body";
    const type=document.createElement("span");type.className="fs-micro";type.textContent=item.type;
    const title=document.createElement("strong");title.textContent=item.title;
    const description=document.createElement("span");description.textContent=item.body;
    body.append(type,title,description);a.append(img,body);list.append(a);
  });
}

function renderStart(){
  const list=byId("fs-need-options");list.replaceChildren();
  for(let i=0;i<problemPaths.length;i++){
    const need=problemPaths[i],b=button(need.label,"fs-need-option",()=>{
      state.need=need.id;renderStart();syncURL(true);
    });
    b.setAttribute("aria-pressed",String(need.id===state.need));
    const num=document.createElement("span");num.className="fs-need-num";num.textContent=String(i+1).padStart(2,"0");
    const title=document.createElement("strong");title.textContent=need.label;
    b.replaceChildren(num,title);list.append(b);
  }
  const output=byId("fs-need-result"),selected=problemPaths.find(x=>x.id===state.need);
  if(!selected){
    output.innerHTML='<div class="fs-result-empty"><span class="fs-micro">YOUR NEXT MOVE</span><div class="fs-result-symbol" aria-hidden="true">↗</div><h3>One problem.<br>One useful place to start.</h3><p>Choose an option at left. We will show a matching example and a next step, without collecting personal information.</p></div>';
    return;
  }
  output.replaceChildren();
  const label=document.createElement("span");label.className="fs-micro";label.textContent="YOUR RECOMMENDED FIRST STEP";
  const title=document.createElement("h3");title.textContent=selected.resultTitle;
  const desc=document.createElement("p");desc.textContent=selected.result;
  const why=document.createElement("p");const strong=document.createElement("strong");strong.textContent="WHY THIS PATH: ";why.append(strong,document.createTextNode(selected.reason));
  const links=document.createElement("div");links.className="fs-result-links";
  for(const entry of [selected.primary,selected.proof]){
    const a=document.createElement("a");a.href=entry.href;a.textContent=entry.label+" ↗";links.append(a);
  }
  output.append(label,title,desc,why,links);
}

function renderQuadrants(){
  if(!siteConfig)return;
  const configs=siteConfig.homepage_quadrants||[];
  for(const item of configs){
    const article=byId("square-"+item.id);if(!article)continue;
    const label=article.querySelector(".fs-quad-top>span:first-child");
    const rail=article.querySelector(".fs-rail-label");
    if(label)label.textContent=String(item.id==="work"?"01":item.id==="build"?"02":item.id==="lab"?"03":"04")+" / "+item.label.toUpperCase();
    if(rail)rail.innerHTML=encodeText(item.label.toUpperCase())+' <span aria-hidden="true">↗</span>';
  }
}

async function getConfig(url){
  const result=await fetch(url,{cache:"no-cache"});
  if(!result.ok)throw new Error("Config read failed "+result.status+" "+url);
  return result.json();
}
async function loadConfigurations(){
  const [site,offers]=await Promise.allSettled([
    getConfig("/config/site.json"),getConfig("/config/offers.json")
  ]);
  if(site.status==="fulfilled"){siteConfig=site.value;renderQuadrants()}
  else console.warn("Four-square site configuration was unavailable. Static labels remain in place.",site.reason);
  if(offers.status==="fulfilled"){offersConfig=offers.value;offersStatus="ready"}
  else{offersStatus="error";console.warn("Four-square offers configuration was unavailable. See the Services page.",offers.reason)}
  renderBuild();
}
function restore(){
  isRestoring=true;
  const url=new URL(location.href);
  state.project=safeId(url.searchParams.get("project"),projectProofs.map(x=>x.id),"lonewolf");
  const project=projectProofs.find(x=>x.id===state.project)||projectProofs[0];
  const step=Number(url.searchParams.get("step")||"1");
  state.step=Number.isInteger(step)?Math.max(0,Math.min(project.walkthrough.length-1,step-1)):0;
  state.buildMode=safeId(url.searchParams.get("mode"),["websites","care","custom"],"websites");
  state.tier=url.searchParams.get("tier");
  state.lab=safeId(url.searchParams.get("shelf"),labShelves.map(x=>x.id),"products");
  state.need=safeId(url.searchParams.get("problem"),problemPaths.map(x=>x.id),null);
  renderWork();renderBuild();renderLab();renderStart();
  setActive(safeId(url.searchParams.get("square"),squares,null),{push:false});
  isRestoring=false;
}

function attachEvents(){
  const triggers=Array.from(document.querySelectorAll(".fs-quad-trigger"));
  triggers.forEach((trigger,index)=>{
    trigger.addEventListener("click",()=>setActive(trigger.dataset.open,{focus:true,scroll:true}));
    trigger.addEventListener("keydown",e=>{
      const key=e.key;
      const mapping={ArrowRight:1,ArrowDown:2,ArrowLeft:-1,ArrowUp:-2,Home:0,End:3};
      if(!(key in mapping))return;
      e.preventDefault();
      const next=(key==="Home"||key==="End")?mapping[key]:(index+mapping[key]+triggers.length)%triggers.length;
      triggers[next].focus();
    });
  });
  for(const b of document.querySelectorAll("[data-close]")){
    b.addEventListener("click",()=>setActive(null,{focus:true,scroll:true}));
  }
  for(const b of document.querySelectorAll("[data-build-mode]")){
    b.addEventListener("click",()=>setBuildMode(b.dataset.buildMode));
  }
  document.addEventListener("keydown",e=>{
    if(e.key==="Escape"&&state.active){e.preventDefault();setActive(null,{focus:true,scroll:true})}
  });
  window.addEventListener("popstate",restore);
}

attachEvents();
restore();
loadConfigurations();
