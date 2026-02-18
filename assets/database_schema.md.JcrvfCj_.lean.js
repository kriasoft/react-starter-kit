import{_ as t,I as e,o as n,c as h,a6 as i,J as l}from"./chunks/framework.BvqLMprX.js";const y=JSON.parse('{"title":"Schema","description":"","frontmatter":{"outline":[2,3]},"headers":[],"relativePath":"database/schema.md","filePath":"database/schema.md","lastUpdated":1771437477000}'),p={name:"database/schema.md"};function d(k,s,r,o,E,c){const a=e("Mermaid");return n(),h("div",null,[s[0]||(s[0]=i("",11)),l(a,{code:`erDiagram
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
        text image
        boolean is_anonymous
        text stripe_customer_id
    }

    session {
        text id PK "ses_..."
        timestamp expires_at
        text token UK
        text ip_address
        text user_agent
        text user_id FK
        text active_organization_id
    }

    identity {
        text id PK "idn_..."
        text account_id
        text provider_id
        text user_id FK
        text access_token
        text refresh_token
        text id_token
        timestamp access_token_expires_at
        timestamp refresh_token_expires_at
        text scope
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
        text name
        text public_key
        text credential_id UK
        text user_id FK
        integer counter
        text device_type
        boolean backed_up
        text transports
        text aaguid
        timestamp last_used_at
        text device_name
        text platform
    }

    organization {
        text id PK "org_..."
        text name
        text slug UK
        text logo
        text metadata
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
        timestamp expires_at
        timestamp accepted_at
        timestamp rejected_at
    }

    subscription {
        text id PK "sub_..."
        text plan
        text reference_id
        text stripe_customer_id
        text stripe_subscription_id UK
        text status
        timestamp period_start
        timestamp period_end
        timestamp trial_start
        timestamp trial_end
        boolean cancel_at_period_end
        integer seats
        text billing_interval
    }`}),s[1]||(s[1]=i("",31))])}const u=t(p,[["render",d]]);export{y as __pageData,u as default};
