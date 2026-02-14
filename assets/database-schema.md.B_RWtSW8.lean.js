import{_ as t,I as e,c as n,o as l,a5 as i,J as h}from"./chunks/framework.BeeQ8TS1.js";const y=JSON.parse('{"title":"Database Schema","description":"","frontmatter":{},"headers":[],"relativePath":"database-schema.md","filePath":"database-schema.md","lastUpdated":1771102970000}'),d={name:"database-schema.md"};function p(r,s,k,o,E,c){const a=e("Mermaid");return l(),n("div",null,[s[0]||(s[0]=i("",12)),h(a,{code:`erDiagram
    %% Core Authentication Tables
    user {
        text id PK "gen_random_uuid()"
        text name "Full name"
        text email UK "Email address"
        boolean email_verified "Email verification status"
        text image "Profile image URL"
        boolean is_anonymous "Anonymous user flag"
        timestamp created_at "Account creation timestamp"
        timestamp updated_at "Last update timestamp"
    }

    session {
        text id PK "gen_random_uuid()"
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
        text id PK "gen_random_uuid()"
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
        text id PK "gen_random_uuid()"
        text identifier "Email or other identifier"
        text value "Verification code/token"
        timestamp expires_at "Expiration timestamp"
        timestamp created_at "Creation timestamp"
        timestamp updated_at "Last update timestamp"
    }

    passkey {
        text id PK "gen_random_uuid()"
        text name "Key name"
        text public_key "WebAuthn public key"
        text credential_id UK "WebAuthn credential ID"
        integer counter "Signature counter"
        text device_type "Authenticator type"
        boolean backed_up "Backed up flag"
        text transports "Supported transports"
        text aaguid "Authenticator AAGUID"
        timestamp last_used_at "Last authentication time"
        text device_name "User-friendly device name"
        text platform "platform or cross-platform"
        text user_id FK "User reference"
        timestamp created_at "Creation timestamp"
        timestamp updated_at "Last update timestamp"
    }

    %% Multi-tenancy Tables
    organization {
        text id PK "gen_random_uuid()"
        text name "Organization name"
        text slug UK "URL-friendly identifier"
        text logo "Logo URL"
        text metadata "JSON metadata"
        timestamp created_at "Creation timestamp"
        timestamp updated_at "Last update timestamp"
    }

    member {
        text id PK "gen_random_uuid()"
        text user_id FK "User reference"
        text organization_id FK "Organization reference"
        text role "owner, admin, or member"
        timestamp created_at "Join timestamp"
        timestamp updated_at "Last update timestamp"
    }

    team {
        text id PK "gen_random_uuid()"
        text name "Team name"
        text organization_id FK "Parent organization"
        timestamp created_at "Creation timestamp"
        timestamp updated_at "Last update timestamp"
    }

    team_member {
        text id PK "gen_random_uuid()"
        text team_id FK "Team reference"
        text user_id FK "User reference"
        timestamp created_at "Join timestamp"
        timestamp updated_at "Last update timestamp"
    }

    invitation {
        text id PK "gen_random_uuid()"
        text email "Invitee email"
        text inviter_id FK "Inviting user"
        text organization_id FK "Target organization"
        text role "Invited role"
        invitation_status status "pending, accepted, rejected, canceled"
        text team_id FK "Target team (optional)"
        timestamp expires_at "Expiration timestamp"
        timestamp accepted_at "Acceptance timestamp"
        timestamp rejected_at "Rejection timestamp"
        timestamp created_at "Creation timestamp"
        timestamp updated_at "Last update timestamp"
    }

    %% Relationships
    user ||--o{ session : "has"
    user ||--o{ identity : "authenticates with"
    user ||--o{ passkey : "registers"
    user ||--o{ member : "belongs to"
    user ||--o{ team_member : "member of"
    user ||--o{ invitation : "invited by"

    organization ||--o{ member : "has members"
    organization ||--o{ team : "contains"
    organization ||--o{ invitation : "receives"

    team ||--o{ team_member : "has members"
    team ||--o{ invitation : "invites to"`}),s[1]||(s[1]=i("",97))])}const u=t(d,[["render",p]]);export{y as __pageData,u as default};
