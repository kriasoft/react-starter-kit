import{H as e,ht as t,it as n,nt as r,tt as i,yt as a}from"./chunks/framework.qcK96eCy.js";var o=JSON.parse(`{"title":"Architecture Overview","description":"","frontmatter":{},"headers":[],"relativePath":"architecture/index.md","filePath":"architecture/index.md","lastUpdated":1786751537000}`),s={name:`architecture/index.md`};function c(e,o,s,c,l,u){let d=a(`Mermaid`);return t(),i(`div`,null,[o[0]||=r("",4),n(d,{code:`sequenceDiagram
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

    Browser->>Web: POST /api/trpc/billing.subscription
    Web->>API: service binding
    API->>DB: Hyperdrive
    DB-->>API: query result
    API-->>Web: JSON response
    Web-->>Browser: JSON response`}),o[1]||=r("",37)])}var l=e(s,[[`render`,c]]);export{o as __pageData,l as default};