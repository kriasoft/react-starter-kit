import{_ as t,I as e,c as n,o as h,a6 as i,J as l}from"./chunks/framework.C7CfgHXo.js";const y=JSON.parse('{"title":"Schema","description":"","frontmatter":{"outline":[2,3]},"headers":[],"relativePath":"database/schema.md","filePath":"database/schema.md","lastUpdated":0}'),p={name:"database/schema.md"};function k(d,s,r,o,E,g){const a=e("Mermaid");return h(),n("div",null,[s[0]||(s[0]=i("",10)),l(a,{code:`erDiagram
    user ||--o{ session : "has"
    user ||--o{ identity : "authenticates with"
    user ||--o{ passkey : "registers"
    user ||--o{ member : "belongs to"
    user ||--o{ invitation : "invited by"
    user ||--o{ subscription : "subscribes"
    organization ||--o{ member : "has members"
    organization ||--o{ invitation : "receives"
    organization ||--o{ subscription : "subscribes"

    user {
        text id PK "usr_..."
        text name
        text email UK
        boolean email_verified
        boolean is_anonymous
        text stripe_customer_id
    }

    session {
        text id PK "ses_..."
        timestamp expires_at
        text token UK
        text user_id FK
        text active_organization_id
    }

    identity {
        text id PK "idn_..."
        text account_id
        text provider_id
        text user_id FK
        text password
    }

    verification {
        text id PK "vfy_..."
        text identifier
        text value
        timestamp expires_at
    }

    passkey {
        text id PK "pky_..."
        text public_key
        text credential_id UK
        text user_id FK
        integer counter
    }

    organization {
        text id PK "org_..."
        text name
        text slug UK
        text stripe_customer_id
    }

    member {
        text id PK "mem_..."
        text user_id FK
        text organization_id FK
        text role
    }

    invitation {
        text id PK "inv_..."
        text email
        text inviter_id FK
        text organization_id FK
        text role
        text status
    }

    subscription {
        text id PK "sub_..."
        text plan
        text reference_id
        text stripe_subscription_id UK
        text status
    }`}),s[1]||(s[1]=i("",31))])}const u=t(p,[["render",k]]);export{y as __pageData,u as default};
