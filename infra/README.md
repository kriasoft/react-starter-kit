# Infrastructure

Terraform configuration for deploying this application to a cloud provider.

## Structure

- `environments/` - Environment-specific configurations (`preview`, `staging`, `prod`)
- `modules/` - Reusable Terraform modules for database and storage

## Modules

### Database (`modules/db`)

- Creates Cloudflare D1 (or, Neon) database for each environment
- Names: `{project-name}-{environment}`

### Storage (`modules/storage`)

- Creates R2 buckets for file storage
- Main bucket: `{project-name}-{environment}`
- Uploads bucket: `{project-name}-uploads-{environment}`

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

- **Zone:Zone:Read** (for domain management)
- **Zone:Zone Settings:Edit** (for configuration)
- **Account:Cloudflare D1:Edit** (for database creation)
- **Account:Cloudflare R2:Edit** (for storage buckets)

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
# Get database ID for wrangler.jsonc
terraform output database_id

# Get R2 bucket names for environment variables
terraform output storage_bucket_name
terraform output uploads_bucket_name
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
