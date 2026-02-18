import{_ as a,I as t,o as n,c as h,a6 as i,J as r}from"./chunks/framework.BvqLMprX.js";const y=JSON.parse('{"title":"Architecture Overview","description":"","frontmatter":{},"headers":[],"relativePath":"architecture/index.md","filePath":"architecture/index.md","lastUpdated":1771440753000}'),l={name:"architecture/index.md"};function k(p,s,d,o,c,E){const e=t("Mermaid");return n(),h("div",null,[s[0]||(s[0]=i("",4)),r(e,{code:`sequenceDiagram
    participant Browser
    participant Web as Web Worker
    participant App as App Worker
    participant API as API Worker
    participant DB as Neon PostgreSQL

    Browser->>Web: GET /
    alt auth-hint cookie present
        Web->>App: service binding
        App-->>Web: SPA (dashboard)
    else no cookie
        Web-->>Browser: marketing page
    end

    Browser->>Web: GET /settings
    Web->>App: service binding
    App-->>Web: SPA assets

    Browser->>Web: POST /api/trpc/user.me
    Web->>API: service binding
    API->>DB: Hyperdrive
    DB-->>API: query result
    API-->>Web: JSON response
    Web-->>Browser: JSON response`}),s[1]||(s[1]=i("",39))])}const u=a(l,[["render",k]]);export{y as __pageData,u as default};
