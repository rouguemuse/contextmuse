/**
 * Independent prototype content.
 * These cards describe documented capabilities, not live backend simulations.
 * Source-of-truth pricing comes from /config/offers.json at runtime.
 * Homepage destination names come from /config/site.json.
 */
export const projectProofs = [
  {
    id:"lonewolf",
    name:"Lone Wolf Dumpsters",
    short:"Lone Wolf",
    eyebrow:"LOCAL SEARCH / QUALIFICATION",
    image:"/assets/images/lonewolf-commercial-spread.webp",
    imageAlt:"Lone Wolf Dumpsters website interface and localized commercial layout",
    headline:"A website that knows where the customer is.",
    description:"A localized commercial platform built around territory, dumpster sizing, and differentiated inquiries.",
    proof:"48 municipal landing pages, sizing guidance, and homeowner/contractor intake routes",
    href:"/work/lone-wolf-dumpsters/",
    tags:["48 local pages","Territory logic","Lead intake"],
    walkthrough:[
      {tag:"DISCOVER",title:"Find the right entry point",description:"Search-oriented municipal pages meet customers where they need service. This is a walkthrough of the documented architecture, not a live ZIP validation service."},
      {tag:"QUALIFY",title:"Bring sizing into the conversation",description:"The site clarifies dumpster dimensions and tonnage considerations before a customer sends a request."},
      {tag:"ROUTE",title:"Send a useful inquiry",description:"Different inquiry paths distinguish homeowners and commercial contractors, reducing manual triage."}
    ]
  },
  {
    id:"edr",
    name:"EDR Party Rentals",
    short:"EDR Rentals",
    eyebrow:"RESERVATIONS / INVENTORY",
    image:"/assets/images/edrpartyrentals-screenshot.webp",
    imageAlt:"EDR Party Rentals catalog and reservation-oriented interface",
    headline:"Make booking feel easier before anyone calls.",
    description:"The customer experience anticipates inventory limits, event dates, delivery areas, and bilingual inquiries.",
    proof:"Date and delivery qualification, product-package clarity, bilingual structured handoff",
    href:"/case-studies/edr-party-rentals/",
    tags:["Date logic","Inventory-aware","Bilingual"],
    walkthrough:[
      {tag:"PLAN",title:"Start with the event",description:"The journey asks for the event's date and location early, rather than burying them at the end of a generic form."},
      {tag:"CHOOSE",title:"Understand the packages",description:"Customers can compare clearly structured rental inventory and package combinations."},
      {tag:"HANDOFF",title:"Send complete event details",description:"Structured requests carry the relevant availability and delivery context into the next conversation. This preview does not make a real booking."}
    ]
  },
  {
    id:"inncontrol",
    name:"INNcontrol Coils",
    short:"INNcontrol",
    eyebrow:"B2B / PRIVATE FIELD TOOLS",
    image:"/assets/images/inncontrol-commercial-platform.webp",
    imageAlt:"INNcontrol Coils commercial website and project imagery",
    headline:"The public website is only the front door.",
    description:"Commercial presentation paired with a specialized field-scoping and estimation workflow.",
    proof:"Industrial web presence, survey workflow, estimation and field-ledger structure",
    href:"/systems/client-builds/#inncontrol",
    tags:["B2B website","Field scoping","Estimating"],
    walkthrough:[
      {tag:"PRESENT",title:"Explain the service",description:"A credible commercial website introduces the work and helps buyers understand the offering."},
      {tag:"CAPTURE",title:"Structure the field assessment",description:"The private workflow records on-site observations in a consistent format, unlike fragmented notes."},
      {tag:"ESTIMATE",title:"Turn observations into scoping",description:"An estimation ledger supports complex property surveys. Client-restricted tools are not publicly embedded in this prototype."}
    ]
  },
  {
    id:"signal",
    name:"Signal",
    short:"Signal",
    eyebrow:"RESTAURANT DECISION INTELLIGENCE",
    image:"/assets/images/signal-priority-view.webp",
    imageAlt:"Signal dashboard with prioritized restaurant analysis",
    headline:"Your reports are talking. What are they saying?",
    description:"Existing restaurant reports become ranked findings and actionable operational questions.",
    proof:"Sales, labor, comps, voids and timing analyzed across related reports",
    href:"/signal/",
    tags:["Existing reports","Prioritized findings","Action plans"],
    walkthrough:[
      {tag:"COLLECT",title:"Begin with existing exports",description:"Operators supply the POS and operational reports they already have, rather than buying another dashboard first."},
      {tag:"COMPARE",title:"Look across the numbers",description:"Cross-report analysis explores how sales, timing, labor, discounts and voids interact."},
      {tag:"PRIORITIZE",title:"Identify the next decision",description:"Findings are ranked by evidence and potential significance. Any sample metrics on the linked demo are synthetic unless explicitly verified."}
    ]
  },
  {
    id:"audit",
    name:"Website Audit System",
    short:"Website Audit",
    eyebrow:"VISUAL / TECHNICAL EVIDENCE",
    image:"/assets/images/website-audit-evidence-spread.webp",
    imageAlt:"Website audit visual evidence and issue documentation interface",
    headline:"Don't just say the site is broken. Show where.",
    description:"A visual diagnostics pipeline that turns UX and technical friction into inspectable evidence.",
    proof:"Multi-viewport screenshots, DOM-linked evidence, concrete repair priorities",
    href:"/work/website-audit-system/",
    tags:["Visual evidence","UX repair","Traceable issues"],
    walkthrough:[
      {tag:"CAPTURE",title:"Inspect the actual pages",description:"A multi-viewport capture reveals layout and usability issues across screen sizes."},
      {tag:"EVIDENCE",title:"Point to the problem",description:"Evidence annotations relate visible defects to technical context where available."},
      {tag:"FIX",title:"Make the repair actionable",description:"The output separates verified observations, uncertain inferences and implementation-ready recommendations."}
    ]
  }
];

export const labShelves = [
  {
    id:"products",label:"Products",number:"01",
    headline:"Tools with a job to do.",
    description:"Purpose-built products and diagnostic experiences. They are not generic custom-build price lists.",
    items:[
      {title:"Signal",type:"RESTAURANT INTELLIGENCE",body:"Prioritized decisions from existing restaurant reports.",href:"/signal/",image:"/assets/images/signal-priority-view.webp"},
      {title:"GenSort",type:"VISUAL ASSET TOOL",body:"Explore and organize creative image collections.",href:"/gensort/",image:"/assets/images/gensort-hero-library.webp"}
    ]
  },
  {
    id:"templates",label:"Templates + Calculators",number:"02",
    headline:"Useful enough to take home.",
    description:"A space for packaged spreadsheets, branded business documents, and calculators. Products launch only after their files, licenses and checkout are ready.",
    items:[
      {title:"Templates collection",type:"CATALOG IN DEVELOPMENT",body:"Reusable business documents, recipe and cost calculators, and creative packs. Browse the Lab for currently published items.",href:"/lab/#templates",image:"/assets/images/blueprint_draft.jpg"}
    ]
  },
  {
    id:"experiments",label:"Experiments",number:"03",
    headline:"Some ideas need to be experienced.",
    description:"Interfaces and narratives you can explore without pretending they are finished client campaigns.",
    items:[
      {title:"The Human Continuum",type:"INTERACTIVE MOTION STUDY",body:"A four-phase, viewer-controlled motion experiment.",href:"/creative/interaction-lab/",image:"/assets/images/contextmuse_hero_architectural.png"},
      {title:"Self-Cartography",type:"INTERACTIVE REFLECTION",body:"A living atlas for observing patterns and exploring personal decisions.",href:"/creative/self-cartography/",image:"/assets/images/self_cartography_mockup.jpg"}
    ]
  },
  {
    id:"notes",label:"Field Notes",number:"04",
    headline:"AI tips you can actually use.",
    description:"Practical observations about AI, design, operations and systems. Read without subscribing; opt-in email is separate from sales intake.",
    items:[
      {title:"Field Notes + AI Tips",type:"READ THE ARCHIVE",body:"Short, practical workflows and evidence-first lessons, with a browsable archive.",href:"/field-notes/",image:"/assets/images/hero_context_muse_blueprint.jpg"},
      {title:"The Menu Is an Interface",type:"OPERATIONS / UX",body:"How pricing, menu structure and decision load change the guest experience.",href:"/restaurant-theory/",image:"/assets/images/restaurant-data-partner-share.png"}
    ]
  }
];

export const problemPaths = [
  {id:"website",label:"I need a professional website.",hint:"A site that's clear, credible and easy to contact.",resultTitle:"Start with a defined website scope.",result:"Compare the standard website packages first. If you need calendars, inventory, pricing logic or custom workflows, those belong in a scoped build.",primary:{label:"Compare website packages",href:"/services/#websites"},proof:{label:"See standard vs custom",href:"/services/#operations"},reason:"A straightforward site shouldn't require paying for custom software."},
  {id:"leads",label:"My website doesn't bring enough inquiries.",hint:"Visitors arrive, but don't become useful leads.",resultTitle:"Find where the customer journey leaks.",result:"Start with the free Website + System Check. If the issue is qualification, compare the Lone Wolf lead-engine case study.",primary:{label:"Run the free site check",href:"/website-system-check/"},proof:{label:"See Lone Wolf",href:"/work/lone-wolf-dumpsters/"},reason:"Inspect the customer flow before buying a new website."},
  {id:"booking",label:"Booking and availability are chaos.",hint:"Scheduling, inventory or delivery rules collide.",resultTitle:"Design around actual booking rules.",result:"Explore how EDR Party Rentals moves event dates, delivery qualification and packages earlier into the booking process.",primary:{label:"See the reservation case study",href:"/case-studies/edr-party-rentals/"},proof:{label:"Ask about a custom build",href:"/contact/?service=custom-system"},reason:"Real availability requires backend rules, not a decorative calendar."},
  {id:"reports",label:"I've got data. I need decisions.",hint:"Reports exist, but priorities don't.",resultTitle:"Read your data before rebuilding a dashboard.",result:"Look at Signal's cross-report restaurant analysis. For other industries, request a scoped Reports to Decisions readout.",primary:{label:"See Signal",href:"/signal/"},proof:{label:"Discuss an analysis",href:"/contact/?service=diagnostic"},reason:"The best next step might be a recommendation, not more software."},
  {id:"creative",label:"I need a brand or creative experience.",hint:"A visual idea, presentation, book or story world.",resultTitle:"Give the idea the right form.",result:"Explore the Creative Practice and Interaction Lab to see how narratives, content systems and interactive ideas are developed.",primary:{label:"Explore creative work",href:"/creative/"},proof:{label:"Discuss the concept",href:"/contact/"},reason:"Not every creative project should be quoted like a business website."}
];
