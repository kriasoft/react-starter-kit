import{_ as t,I as e,c as n,o as l,a5 as i,J as h}from"./chunks/framework.CUWTb1PO.js";const y=JSON.parse('{"title":"Database Schema","description":"","frontmatter":{},"headers":[],"relativePath":"database-schema.md","filePath":"database-schema.md","lastUpdated":1754258266000}'),p={name:"database-schema.md"};function k(d,s,r,o,E,g){const a=e("Mermaid");return l(),n("div",null,[s[0]||(s[0]=i("",22)),h(a,{code:`erDiagram
    %% Core Authentication Tables
    user {
        text id PK "UUIDv7 primary key"
        text name "Full name"
        text email UK "Email address"
        boolean email_verified "Email verification status"
        text image "Profile image URL"
        boolean is_anonymous "Anonymous user flag"
        timestamp created_at "Account creation timestamp"
        timestamp updated_at "Last update timestamp"
    }

    session {
        text id PK "UUIDv7 session ID"
        timestamp expires_at "Session expiration"
        text token UK "Session token"
        timestamp created_at "Creation timestamp"
        timestamp updated_at "Last update timestamp"
        text ip_address "Client IP address"
        text user_agent "Client user agent"
        text user_id FK "User reference"
        text active_organization_id "Current organization context"
        text active_team_id "Current team context"
    }

    identity {
        text id PK "UUIDv7 identity ID"
        text account_id "Provider account ID"
        text provider_id "OAuth provider name"
        text user_id FK "User reference"
        text access_token "OAuth access token"
        text refresh_token "OAuth refresh token"
        text id_token "OAuth ID token"
        timestamp access_token_expires_at "Access token expiry"
        timestamp refresh_token_expires_at "Refresh token expiry"
        text scope "OAuth scopes"
        text password "Hashed password for email auth"
        timestamp created_at "Creation timestamp"
        timestamp updated_at "Last update timestamp"
    }

    verification {
        text id PK "UUIDv7 verification ID"
        text identifier "Email or other identifier"
        text value "Verification code/token"
        timestamp expires_at "Expiration timestamp"
        timestamp created_at "Creation timestamp"
        timestamp updated_at "Last update timestamp"
    }

    %% Multi-tenancy Tables
    organization {
        text id PK "UUIDv7 organization ID"
        text name "Organization name"
        text slug UK "URL-friendly identifier"
        text logo "Logo URL"
        text metadata "JSON metadata"
        timestamp created_at "Creation timestamp"
    }

    member {
        text id PK "UUIDv7 membership ID"
        text user_id FK "User reference"
        text organization_id FK "Organization reference"
        text role "Member role (owner, admin, member)"
        timestamp created_at "Join timestamp"
    }

    team {
        text id PK "UUIDv7 team ID"
        text name "Team name"
        text organization_id FK "Parent organization"
        timestamp created_at "Creation timestamp"
        timestamp updated_at "Last update timestamp"
    }

    team_member {
        text id PK "UUIDv7 team membership ID"
        text team_id FK "Team reference"
        text user_id FK "User reference"
        timestamp created_at "Join timestamp"
    }

    invitation {
        text id PK "UUIDv7 invitation ID"
        text email "Invitee email"
        text inviter_id FK "Inviting user"
        text organization_id FK "Target organization"
        text role "Invited role"
        text status "Invitation status"
        text team_id FK "Target team (optional)"
        timestamp expires_at "Expiration timestamp"
        timestamp created_at "Creation timestamp"
    }

    %% Relationships
    user ||--o{ session : "has"
    user ||--o{ identity : "authenticates with"
    user ||--o{ member : "belongs to"
    user ||--o{ team_member : "member of"
    user ||--o{ invitation : "invited by"

    organization ||--o{ member : "has members"
    organization ||--o{ team : "contains"
    organization ||--o{ invitation : "receives"

    team ||--o{ team_member : "has members"
    team ||--o{ invitation : "invites to"`}),s[1]||(s[1]=i("",95))])}const u=t(p,[["render",k]]);export{y as __pageData,u as default};
