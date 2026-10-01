const fs = require('fs');

const schemas = [
  {
    file: 'proof-of-work/index.html',
    data: {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": "Proof of Work · Three Systems Capabilities & Implementations",
      "url": "https://www.contextmuse.com/proof-of-work/",
      "provider": {
        "@type": "Organization",
        "name": "Context & Muse",
        "url": "https://www.contextmuse.com/"
      },
      "description": "A structured showcase of Digital Product Systems, Business Workflow Systems, and Web Experience & Conversion builds by Context & Muse."
    }
  },
  {
    file: 'partners/index.html',
    data: {
      "@context": "https://schema.org",
      "@type": "ProfessionalService",
      "name": "White-Label Production & Agency Technical Partnerships",
      "url": "https://www.contextmuse.com/partners/",
      "provider": {
        "@type": "Organization",
        "name": "Context & Muse",
        "url": "https://www.contextmuse.com/"
      },
      "serviceType": "White-Label Web Development, Quoting Engines & Systems Engineering",
      "description": "Confidential technical build partnerships for creative agencies and studios when internal engineering bandwidth is constrained."
    }
  },
  {
    file: 'restaurant-systems/index.html',
    data: {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": "Hospitality & Restaurant Operational Systems",
      "url": "https://www.contextmuse.com/restaurant-systems/",
      "provider": {
        "@type": "Organization",
        "name": "Context & Muse",
        "url": "https://www.contextmuse.com/"
      },
      "serviceType": "Restaurant POS Architecture, Order Flow Optimization & Margin Diagnostics",
      "description": "Operational systems, workflow design, and decision support for independent restaurants, bars, and hospitality operators."
    }
  },
  {
    file: 'restaurant-builds/index.html',
    data: {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": "Hospitality UX & Conversion Studies",
      "url": "https://www.contextmuse.com/restaurant-builds/",
      "provider": {
        "@type": "Organization",
        "name": "Context & Muse",
        "url": "https://www.contextmuse.com/"
      },
      "description": "Independent hospitality interface studies, menu architecture, and conversion teardowns exploring direct ordering and venue workflows."
    }
  },
  {
    file: 'restaurant-builds/comedy-venue/index.html',
    data: {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "Rudyard's Comedy Venue · Hospitality & Event Ticketing Architecture",
      "url": "https://www.contextmuse.com/restaurant-builds/comedy-venue/",
      "author": {
        "@type": "Person",
        "name": "Jayme Volstad",
        "url": "https://www.contextmuse.com/about/"
      },
      "publisher": {
        "@type": "Organization",
        "name": "Context & Muse",
        "url": "https://www.contextmuse.com/"
      },
      "description": "Architectural study of high-velocity event scheduling, calendar intake, and ticket conversion for an iconic multi-room Houston venue."
    }
  },
  {
    file: 'restaurant-builds/detroit-pizza/index.html',
    data: {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "Detroit-Style Pizzeria · Direct Ordering & Modifier Architecture",
      "url": "https://www.contextmuse.com/restaurant-builds/detroit-pizza/",
      "author": {
        "@type": "Person",
        "name": "Jayme Volstad",
        "url": "https://www.contextmuse.com/about/"
      },
      "publisher": {
        "@type": "Organization",
        "name": "Context & Muse",
        "url": "https://www.contextmuse.com/"
      },
      "description": "Hospitality interface analysis and menu flow engineering for direct pizza ordering and crust/topping modifier selection."
    }
  },
  {
    file: 'restaurant-builds/events-venue/index.html',
    data: {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "Sixes & Sevens Multi-Concept Space · Dining & Private Booking Engine",
      "url": "https://www.contextmuse.com/restaurant-builds/events-venue/",
      "author": {
        "@type": "Person",
        "name": "Jayme Volstad",
        "url": "https://www.contextmuse.com/about/"
      },
      "publisher": {
        "@type": "Organization",
        "name": "Context & Muse",
        "url": "https://www.contextmuse.com/"
      },
      "description": "Hospitality architecture study resolving multi-concept space reservations, private dining inquiries, and public menu discovery."
    }
  },
  {
    file: 'restaurant-theory/index.html',
    data: {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "Restaurant Theory: The Menu Is an Interface",
      "url": "https://www.contextmuse.com/restaurant-theory/",
      "author": {
        "@type": "Person",
        "name": "Jayme Volstad",
        "url": "https://www.contextmuse.com/about/"
      },
      "publisher": {
        "@type": "Organization",
        "name": "Context & Muse",
        "url": "https://www.contextmuse.com/"
      },
      "description": "An information-design study exploring menu architecture, price anchoring, visual weight bias, modifier friction, and decision load."
    }
  },
  {
    file: 'signal/intake/index.html',
    data: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Signal Diagnostic Intake",
      "url": "https://www.contextmuse.com/signal/intake/",
      "provider": {
        "@type": "Organization",
        "name": "Context & Muse",
        "url": "https://www.contextmuse.com/"
      },
      "description": "Diagnostic assessment intake for restaurant operators and business owners initiating a Signal margin and workflow evaluation."
    }
  },
  {
    file: 'signal/sample-reports/index.html',
    data: {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": "Signal Benchmark & Sample Reports",
      "url": "https://www.contextmuse.com/signal/sample-reports/",
      "provider": {
        "@type": "Organization",
        "name": "Context & Muse",
        "url": "https://www.contextmuse.com/"
      },
      "description": "Example diagnostic reports and decision models demonstrating unit-economics leakage detection and priority rankings."
    }
  },
  {
    file: 'signal_restaurant_intelligence/index.html',
    data: {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": "Restaurant Profit Priority Scan",
      "url": "https://www.contextmuse.com/signal_restaurant_intelligence/",
      "provider": {
        "@type": "Organization",
        "name": "Context & Muse",
        "url": "https://www.contextmuse.com/"
      },
      "serviceType": "Hospitality Profit Diagnostics & Margin Leakage Analysis",
      "description": "Evidence-based operational diagnostic analyzing sales, labor, menu mix, and purchasing data to rank decisions by financial impact."
    }
  },
  {
    file: 'systems/client-builds/index.html',
    data: {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": "Client Builds · Production Case Studies & Systems",
      "url": "https://www.contextmuse.com/systems/client-builds/",
      "provider": {
        "@type": "Organization",
        "name": "Context & Muse",
        "url": "https://www.contextmuse.com/"
      },
      "description": "Production client builds directory: Lone Wolf Dumpsters 48-market lead engine, INNcontrol Coils HVAC estimation system, and EDR Party Rentals inventory engine."
    }
  },
  {
    file: 'systems/resource-guide/index.html',
    data: {
      "@context": "https://schema.org",
      "@type": "TechArticle",
      "headline": "Systems & Technical Reference Guide",
      "url": "https://www.contextmuse.com/systems/resource-guide/",
      "author": {
        "@type": "Person",
        "name": "Jayme Volstad",
        "url": "https://www.contextmuse.com/about/"
      },
      "publisher": {
        "@type": "Organization",
        "name": "Context & Muse",
        "url": "https://www.contextmuse.com/"
      },
      "description": "Engineering standards, architecture principles, and operational runbooks for commercial web applications and data systems."
    }
  },
  {
    file: 'systems/signal/index.html',
    data: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "Signal Restaurant Operational Intelligence",
      "url": "https://www.contextmuse.com/systems/signal/",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "Web",
      "provider": {
        "@type": "Organization",
        "name": "Context & Muse",
        "url": "https://www.contextmuse.com/"
      },
      "description": "Signal turns restaurant POS exports and operating records into prioritized findings that identify margin leakage and workflow friction."
    }
  },
  {
    file: 'cartography/index.html',
    data: {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": "Computational Cartography & Geographic Systems",
      "url": "https://www.contextmuse.com/cartography/",
      "creator": {
        "@type": "Person",
        "name": "Jayme Volstad",
        "url": "https://www.contextmuse.com/about/"
      },
      "publisher": {
        "@type": "Organization",
        "name": "Context & Muse",
        "url": "https://www.contextmuse.com/"
      },
      "description": "Algorithmic mapping, geographic coordinate visualization, and spatial representation systems."
    }
  },
  {
    file: 'creative/index.html',
    data: {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": "Creative Works & Computational Literature",
      "url": "https://www.contextmuse.com/creative/",
      "creator": {
        "@type": "Person",
        "name": "Jayme Volstad",
        "url": "https://www.contextmuse.com/about/"
      },
      "publisher": {
        "@type": "Organization",
        "name": "Context & Muse",
        "url": "https://www.contextmuse.com/"
      },
      "description": "Explorations at the intersection of language, computational systems, narrative cartography, and structural form."
    }
  },
  {
    file: 'creative/how-to-explain-yourself-to-wolves/index.html',
    data: {
      "@context": "https://schema.org",
      "@type": "Book",
      "name": "How to Explain Yourself to Wolves",
      "url": "https://www.contextmuse.com/creative/how-to-explain-yourself-to-wolves/",
      "author": {
        "@type": "Person",
        "name": "Jayme Volstad",
        "url": "https://www.contextmuse.com/about/"
      },
      "publisher": {
        "@type": "Organization",
        "name": "Context & Muse",
        "url": "https://www.contextmuse.com/"
      },
      "description": "A collection of literary prose and narrative sequences exploring distance, instinct, and communication."
    }
  },
  {
    file: 'creative/self-cartography/index.html',
    data: {
      "@context": "https://schema.org",
      "@type": "CreativeWork",
      "name": "Self-Cartography",
      "url": "https://www.contextmuse.com/creative/self-cartography/",
      "author": {
        "@type": "Person",
        "name": "Jayme Volstad",
        "url": "https://www.contextmuse.com/about/"
      },
      "publisher": {
        "@type": "Organization",
        "name": "Context & Muse",
        "url": "https://www.contextmuse.com/"
      },
      "description": "Visual and textual explorations of identity, internal geography, and personal indexing."
    }
  },
  {
    file: 'privacy/index.html',
    data: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Privacy Policy",
      "url": "https://www.contextmuse.com/privacy/",
      "publisher": {
        "@type": "Organization",
        "name": "Context & Muse",
        "url": "https://www.contextmuse.com/"
      },
      "description": "Privacy policy and data governance practices for Context & Muse."
    }
  },
  {
    file: 'terms/index.html',
    data: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Terms of Service",
      "url": "https://www.contextmuse.com/terms/",
      "publisher": {
        "@type": "Organization",
        "name": "Context & Muse",
        "url": "https://www.contextmuse.com/"
      },
      "description": "Terms of service and commercial engagement conditions for Context & Muse applied systems."
    }
  }
];

for (const item of schemas) {
  if (!fs.existsSync(item.file)) {
    console.warn('File not found:', item.file);
    continue;
  }
  let content = fs.readFileSync(item.file, 'utf8');
  if (content.includes('application/ld+json')) {
    console.log(item.file, 'already has ld+json schema');
    continue;
  }
  const scriptTag = `\n    <!-- Structured Data (JSON-LD) -->\n    <script type="application/ld+json">\n${JSON.stringify(item.data, null, 2)}\n    </script>\n`;
  if (content.includes('</head>')) {
    content = content.replace('</head>', scriptTag + '</head>');
    fs.writeFileSync(item.file, content, 'utf8');
    console.log('Injected JSON-LD into:', item.file);
  } else {
    console.warn('No </head> found in:', item.file);
  }
}
