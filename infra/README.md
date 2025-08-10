# Infrastructure

Terraform configuration for deploying this application to a cloud provider.

## Structure

- `environments/` - Environment-specific configurations (`preview`, `staging`, `prod`)
- `modules/` - Reusable Terraform modules for database connectivity

## Modules

### Hyperdrive (`modules/hyperdrive`)

- Creates Cloudflare Hyperdrive configurations for Neon PostgreSQL connectivity
- Provides connection pooling and edge optimization for database access
- Configurations: direct (no-cache) and cached (60s TTL) variants

## Environments

Each environment includes:

- `main.tf` - Module instantiation
- `variables.tf` - Input variables
- `outputs.tf` - Output values
- `provider.tf` - Provider configuration
- `backend.tf` - Remote state configuration
- `terraform.tfvars.example` - Example variables
- `terraform.tfvars` - Environment-specific variables

## Usage

```bash
# Navigate to environment
cd environments/preview

# Copy and configure variables
cp terraform.tfvars.example terraform.tfvars
# Edit terraform.tfvars with your values

# Initialize and apply
terraform init
terraform plan
terraform apply
```

## Requirements

- Terraform >= 1.12
- Cloudflare account with API token
- Required variables: `project_name` (lowercase, hyphens only), `cloudflare_account_id`

## Development Setup

For the best development experience with Terraform files:

- **VS Code**: Install the HashiCorp Terraform extension (included in project recommendations)
- **Formatting**: Run `terraform fmt -recursive` to format all .tf files
- **Validation**: Use `terraform validate` to check syntax before applying

## Security

### API Token Permissions

Your Cloudflare API token needs the following permissions:

- **Zone:DNS:Edit** (for DNS management)
- **Zone:Zone:Read** (for domain management)
- **Zone:Zone Settings:Edit** (for configuration)
- **Account:Cloudflare Hyperdrive:Edit** (for database connection pooling)

### Secrets Management

- Keep `terraform.tfvars` files secure and never commit them to version control
- The `.gitignore` should include `*.tfvars` (except `.example` files)
- Store sensitive values in environment variables when possible

## State Management

This configuration uses remote state storage for team collaboration:

- State files are stored in Cloudflare R2 (configured in `backend.tf`)
- Each environment maintains separate state files
- Initialize with `terraform init` to download remote state
- State locking prevents concurrent modifications

## Outputs

After successful deployment, use outputs to configure your application:

```bash
# Get Hyperdrive configuration IDs for apps/edge/wrangler.jsonc
terraform output hyperdrive_direct_id
terraform output hyperdrive_cached_id
```

Add these values to your application's environment configuration.

## Troubleshooting

### Common Issues

**Authentication Error**

```
Error: Authentication error (10000)
```

- Verify your Cloudflare API token has correct permissions
- Check `CLOUDFLARE_API_TOKEN` environment variable is set

**Resource Already Exists**

```
Error: resource already exists
```

- Check if resources exist in Cloudflare dashboard
- Import existing resources: `terraform import <resource> <id>`

**State Lock Error**

```
Error: state locked
```

- Another user may be running terraform
- Force unlock (use carefully): `terraform force-unlock <lock-id>`

**Invalid Project Name**

```
Error: invalid project name
```

- Use only lowercase letters, numbers, and hyphens
- Must start with a letter, max 63 characters
