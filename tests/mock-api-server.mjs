/**
 * Mock API Server for Visual Regression Tests
 *
 * Provides a local HTTP server that mimics the Drupal and Footbalisto APIs
 * with deterministic mock data. This allows Next.js server-side rendering
 * to work during tests without relying on external services.
 *
 * Run with: node tests/mock-api-server.js
 */

import http from "node:http";

const PORT = 8888;

/**
 * Mock article data
 */
const mockArticles = {
  data: [
    {
      type: "node--article",
      id: "1",
      attributes: {
        title: "KCVV Elewijt wint belangrijke thuiswedstrijd",
        created: "2024-01-15T10:30:00Z",
        path: { alias: "/news/belangrijke-thuiswedstrijd" },
        body: {
          value: "<p>Een spannende wedstrijd met een goede afloop voor onze club.</p>",
          format: "full_html",
          processed:
            "<p>Een spannende wedstrijd met een goede afloop voor onze club.</p>",
        },
      },
      relationships: {
        field_media_article_image: {
          data: {
            uri: {
              url: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600'%3E%3Crect fill='%234CAF50' width='800' height='600'/%3E%3Ctext fill='%23fff' x='50%25' y='50%25' text-anchor='middle' dy='.3em' font-family='sans-serif' font-size='32'%3EArticle 1%3C/text%3E%3C/svg%3E",
            },
            alt: "Wedstrijd beeld",
            width: 800,
            height: 600,
          },
        },
        field_tags: {
          data: [
            {
              type: "taxonomy_term--category",
              id: "tag-1",
              attributes: { name: "Eerste ploeg" },
            },
          ],
        },
      },
    },
    {
      type: "node--article",
      id: "2",
      attributes: {
        title: "Jeugdopleidingen starten weer in september",
        created: "2024-01-14T14:00:00Z",
        path: { alias: "/news/jeugdopleidingen-september" },
        body: {
          value: "<p>Inschrijvingen zijn nu open voor het nieuwe seizoen.</p>",
          format: "full_html",
          processed:
            "<p>Inschrijvingen zijn nu open voor het nieuwe seizoen.</p>",
        },
      },
      relationships: {
        field_media_article_image: {
          data: {
            uri: {
              url: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600'%3E%3Crect fill='%232196F3' width='800' height='600'/%3E%3Ctext fill='%23fff' x='50%25' y='50%25' text-anchor='middle' dy='.3em' font-family='sans-serif' font-size='32'%3EArticle 2%3C/text%3E%3C/svg%3E",
            },
            alt: "Jeugdtraining",
            width: 800,
            height: 600,
          },
        },
        field_tags: {
          data: [
            {
              type: "taxonomy_term--category",
              id: "tag-2",
              attributes: { name: "Jeugd" },
            },
          ],
        },
      },
    },
    {
      type: "node--article",
      id: "3",
      attributes: {
        title: "Nieuw clubhuis officieel geopend",
        created: "2024-01-13T09:00:00Z",
        path: { alias: "/news/nieuw-clubhuis" },
        body: {
          value: "<p>Met een feestelijke opening werd het nieuwe clubhuis ingehuldigd.</p>",
          format: "full_html",
          processed:
            "<p>Met een feestelijke opening werd het nieuwe clubhuis ingehuldigd.</p>",
        },
      },
      relationships: {
        field_media_article_image: {
          data: {
            uri: {
              url: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600'%3E%3Crect fill='%23FF9800' width='800' height='600'/%3E%3Ctext fill='%23fff' x='50%25' y='50%25' text-anchor='middle' dy='.3em' font-family='sans-serif' font-size='32'%3EArticle 3%3C/text%3E%3C/svg%3E",
            },
            alt: "Clubhuis",
            width: 800,
            height: 600,
          },
        },
        field_tags: {
          data: [
            {
              type: "taxonomy_term--category",
              id: "tag-3",
              attributes: { name: "Clubnieuws" },
            },
          ],
        },
      },
    },
  ],
  links: {
    self: {
      href: "http://localhost:8888/jsonapi/node/article?page[limit]=9",
    },
  },
};

/**
 * Mock taxonomy terms (categories)
 */
const mockTags = {
  data: [
    {
      type: "taxonomy_term--category",
      id: "tag-1",
      attributes: {
        name: "Eerste ploeg",
        drupal_internal__tid: 1,
        path: { alias: "/category/eerste-ploeg" },
      },
    },
    {
      type: "taxonomy_term--category",
      id: "tag-2",
      attributes: {
        name: "Jeugd",
        drupal_internal__tid: 2,
        path: { alias: "/category/jeugd" },
      },
    },
    {
      type: "taxonomy_term--category",
      id: "tag-3",
      attributes: {
        name: "Clubnieuws",
        drupal_internal__tid: 3,
        path: { alias: "/category/clubnieuws" },
      },
    },
  ],
};

/**
 * Mock sponsors data
 */
const mockSponsors = {
  data: [
    {
      type: "node--sponsor",
      id: "sponsor-1",
      attributes: {
        title: "Sponsor A",
        created: "2024-01-01T10:00:00Z",
        path: { alias: "/sponsor/sponsor-a" },
        field_type: "crossing",
        field_website: { uri: "https://example.com" },
      },
      relationships: {
        field_media_image: {
          data: {
            uri: {
              url: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='200'%3E%3Crect fill='%234CAF50' width='300' height='200'/%3E%3Ctext fill='%23fff' x='50%25' y='50%25' text-anchor='middle' dy='.3em' font-family='sans-serif' font-size='20'%3ESponsor A%3C/text%3E%3C/svg%3E",
            },
            alt: "Sponsor A logo",
            width: 300,
            height: 200,
          },
        },
      },
    },
    {
      type: "node--sponsor",
      id: "sponsor-2",
      attributes: {
        title: "Sponsor B",
        created: "2024-01-02T10:00:00Z",
        path: { alias: "/sponsor/sponsor-b" },
        field_type: "green",
        field_website: { uri: "https://example.com" },
      },
      relationships: {
        field_media_image: {
          data: {
            uri: {
              url: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='200'%3E%3Crect fill='%232196F3' width='300' height='200'/%3E%3Ctext fill='%23fff' x='50%25' y='50%25' text-anchor='middle' dy='.3em' font-family='sans-serif' font-size='20'%3ESponsor B%3C/text%3E%3C/svg%3E",
            },
            alt: "Sponsor B logo",
            width: 300,
            height: 200,
          },
        },
      },
    },
    {
      type: "node--sponsor",
      id: "sponsor-3",
      attributes: {
        title: "Sponsor C",
        created: "2024-01-03T10:00:00Z",
        path: { alias: "/sponsor/sponsor-c" },
        field_type: "white",
        field_website: { uri: "https://example.com" },
      },
      relationships: {
        field_media_image: {
          data: {
            uri: {
              url: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='200'%3E%3Crect fill='%23FF9800' width='300' height='200'/%3E%3Ctext fill='%23fff' x='50%25' y='50%25' text-anchor='middle' dy='.3em' font-family='sans-serif' font-size='20'%3ESponsor C%3C/text%3E%3C/svg%3E",
            },
            alt: "Sponsor C logo",
            width: 300,
            height: 200,
          },
        },
      },
    },
  ],
};

/**
 * Mock Footbalisto matches data
 * Matches the FootbalistoMatch schema from src/lib/effect/schemas/match.schema.ts
 */
const mockMatches = [
  {
    id: 1,
    teamId: 1,
    teamName: "KCVV Elewijt A",
    timestamp: 1707577200,
    age: "Senioren",
    date: "2024-02-10 15:00",
    time: "1970-01-01 15:00",
    homeClub: {
      id: 100,
      name: "KCVV Elewijt",
      logo: null,
      abbreviation: "KCVV",
      logoSmall: null,
      version: 1,
    },
    awayClub: {
      id: 200,
      name: "KV Mechelen B",
      logo: null,
      abbreviation: "KVM B",
      logoSmall: null,
      version: 1,
    },
    goalsHomeTeam: null,
    goalsAwayTeam: null,
    homeTeamId: 100,
    awayTeamId: 200,
    status: 0,
    competitionType: "Provinciale",
    viewGameReport: false,
  },
  {
    id: 2,
    teamId: 1,
    teamName: "KCVV Elewijt A",
    timestamp: 1708182000,
    age: "Senioren",
    date: "2024-02-17 15:00",
    time: "1970-01-01 15:00",
    homeClub: {
      id: 300,
      name: "Racing Mechelen",
      logo: null,
      abbreviation: "RACM",
      logoSmall: null,
      version: 1,
    },
    awayClub: {
      id: 100,
      name: "KCVV Elewijt",
      logo: null,
      abbreviation: "KCVV",
      logoSmall: null,
      version: 1,
    },
    goalsHomeTeam: null,
    goalsAwayTeam: null,
    homeTeamId: 300,
    awayTeamId: 100,
    status: 0,
    competitionType: "Provinciale",
    viewGameReport: false,
  },
  {
    id: 3,
    teamId: 10,
    teamName: "KCVV Elewijt U15",
    timestamp: 1707649200,
    age: "U15",
    date: "2024-02-11 11:00",
    time: "1970-01-01 11:00",
    homeClub: {
      id: 100,
      name: "KCVV Elewijt",
      logo: null,
      abbreviation: "KCVV",
      logoSmall: null,
      version: 1,
    },
    awayClub: {
      id: 400,
      name: "SK Grimbergen",
      logo: null,
      abbreviation: "SKGR",
      logoSmall: null,
      version: 1,
    },
    goalsHomeTeam: null,
    goalsAwayTeam: null,
    homeTeamId: 100,
    awayTeamId: 400,
    status: 0,
    competitionType: "Jeugd",
    viewGameReport: false,
  },
];

/**
 * Request handler
 */
const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  const pathname = url.pathname;

  console.log(`[Mock API] ${req.method} ${pathname}`);

  // Set CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Accept");

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    res.writeHead(200);
    res.end();
    return;
  }

  // Route handlers
  if (pathname === "/" || pathname === "/health") {
    // Health check endpoint for Playwright
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ status: "ok", message: "Mock API Server is running" }));
  } else if (pathname.includes("/jsonapi/node/article")) {
    res.writeHead(200, { "Content-Type": "application/vnd.api+json" });
    res.end(JSON.stringify(mockArticles));
  } else if (pathname.includes("/jsonapi/taxonomy_term/")) {
    res.writeHead(200, { "Content-Type": "application/vnd.api+json" });
    res.end(JSON.stringify(mockTags));
  } else if (pathname.includes("/jsonapi/node/sponsor")) {
    res.writeHead(200, { "Content-Type": "application/vnd.api+json" });
    res.end(JSON.stringify(mockSponsors));
  } else if (pathname.includes("/footbalisto") || pathname.includes("/matches")) {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(mockMatches));
  } else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Not found" }));
  }
});

server.listen(PORT, () => {
  console.log(`[Mock API Server] Running on http://localhost:${PORT}`);
  console.log(`[Mock API Server] Ready to serve mock data for visual tests`);
});

// Handle graceful shutdown
process.on("SIGTERM", () => {
  console.log("[Mock API Server] Shutting down...");
  server.close(() => {
    console.log("[Mock API Server] Closed");
    process.exit(0);
  });
});
