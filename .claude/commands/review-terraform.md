# Terraform Infrastructure Review Checklist

## Structure & Organization

### Module Structure

- [ ] Each module has separate `main.tf`, `variables.tf`, `outputs.tf`, and `provider.tf` files
- [ ] Module dependencies are clearly defined and minimal
- [ ] Modules are reusable across environments (preview, staging, prod)

### Directory Layout

- [ ] Clear separation between modules (`modules/`) and environments (`environments/`)
- [ ] Consistent file naming conventions across all modules and environments
- [ ] No hardcoded environment-specific values in modules

## Configuration Standards

### Provider Configuration

- [ ] All modules specify required providers with correct source (`cloudflare/cloudflare`)
- [ ] Provider version constraints are consistent across modules (`~> 5.0`)
- [ ] No legacy provider references (`hashicorp/cloudflare`)

### Variable Management

- [ ] All variables have proper descriptions and type definitions
- [ ] Input validation rules are implemented where appropriate
- [ ] Variables follow naming conventions (snake_case)
- [ ] `terraform.tfvars.example` files exist and are up-to-date

### Resource Naming

- [ ] Resources use consistent naming: `${var.project_name}-${var.environment}`
- [ ] Names comply with Cloudflare resource naming requirements
- [ ] No hardcoded resource names

## Security & Best Practices

### State Management

- [ ] Backend configuration is appropriate for each environment:
  - Preview: Local backend
  - Staging/Prod: Remote backend (S3)
- [ ] State files are not committed to version control
- [ ] Backend encryption is enabled for remote state

### Secrets & Sensitive Data

- [ ] No hardcoded API keys, tokens, or sensitive values
- [ ] Sensitive outputs are marked as `sensitive = true`
- [ ] `terraform.tfvars` files are git-ignored

### Access Control

- [ ] Cloudflare account ID validation is in place
- [ ] Resource permissions follow least-privilege principle

## Environment-Specific Configuration

### Environment Consistency

- [ ] All environments use the same module versions
- [ ] Environment-specific differences are minimal and documented
- [ ] Module calls are consistent across environments

### Resource Allocation

- [ ] Preview environment has appropriate resource limits
- [ ] Production environment includes additional resources (KV namespace)
- [ ] Staging environment matches production configuration

## Testing & Validation

### Code Quality

- [ ] Terraform formatting is consistent (`terraform fmt`)
- [ ] Configuration is valid (`terraform validate`)
- [ ] No unused variables or outputs
- [ ] Clear documentation for complex logic

### Deployment Testing

- [ ] `terraform plan` runs successfully for all environments
- [ ] Module interdependencies work correctly
- [ ] Resource creation order is optimized

## Monitoring & Maintenance

### Documentation

- [ ] Module purposes and usage are documented
- [ ] Environment setup instructions are clear
- [ ] Variable requirements are documented

### Version Management

- [ ] Provider versions are pinned appropriately
- [ ] Module versions are tracked if using external modules
- [ ] Upgrade paths are documented

## Deployment Readiness

### Infrastructure as Code

- [ ] All infrastructure is defined in Terraform
- [ ] Manual changes are avoided
- [ ] Drift detection strategies are in place

### Automation

- [ ] CI/CD pipeline integration is considered
- [ ] Automated testing for infrastructure changes
- [ ] Rollback procedures are documented

---

## Review Commands

```bash
# Navigate to environment
cd infra/environments/{preview|staging|prod}

# Basic validation
terraform fmt -check
terraform validate
terraform plan

# Security checks
terraform providers
grep -r "hardcoded" .
grep -r "TODO\|FIXME" .

# State inspection
terraform state list
terraform show
```
