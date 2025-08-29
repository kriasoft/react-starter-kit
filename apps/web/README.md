# Marketing Website

A modern marketing website built with [Astro](https://astro.build/) for blazing-fast static site generation and deployed to [Cloudflare Workers](https://workers.cloudflare.com/) edge locations worldwide.

## Tech Stack

We're running [Astro 5](https://astro.build/) with [React 19](https://react.dev/) islands for interactive components, styled with [Tailwind CSS v4](https://tailwindcss.com/), and deployed as a static site to Cloudflare's global edge network. Because nothing says "fast" like serving HTML from 300+ locations worldwide.

### Why This Stack?

- **Astro 5**: Static site generation with islands architecture for optimal performance
- **React 19**: For interactive components where you actually need JavaScript (sparingly)
- **Tailwind CSS v4**: Lightning-fast utility-first CSS with the new CSS-based config
- **Cloudflare Workers**: Deploy once, run everywhere at the edge
- **Bun**: Because npm is so last year (and it's genuinely faster)
- **TypeScript**: Catching bugs at compile time since 2012

## Project Structure

```text
web/
├── layouts/              # Astro layout components
│   └── BaseLayout.astro    # Main layout with header/footer
├── lib/                  # Utilities and helpers
│   └── utils.ts            # Shared utility functions
├── pages/                # Astro pages (file-based routing)
│   ├── index.astro         # Landing page
│   ├── features.astro      # Features showcase
│   ├── pricing.astro       # Pricing tiers
│   └── about.astro         # About page
├── public/               # Static assets (favicon, images, etc.)
├── styles/               # Global styles
│   └── globals.css         # CSS variables and base styles
├── astro.config.mjs      # Astro configuration
├── tailwind.config.css   # Tailwind CSS v4 config
├── postcss.config.js     # PostCSS plugins
└── wrangler.jsonc        # Cloudflare Workers deployment config
```

## Development

### Getting Started

```bash
# Install dependencies (from monorepo root)
bun install

# Start development server
bun web:dev
# or
bun --filter @repo/web dev

# Build for production
bun web:build
# or
bun --filter @repo/web build
```

The site will be available at `http://localhost:4321` (Astro's default port, because 3000 was too mainstream).

### Available Commands

```bash
# Development
bun dev                  # Start dev server with hot reload
bun build                # Build static site to dist/
bun preview              # Preview production build locally
bun check                # Type-check .astro files

# Deployment
bun deploy               # Deploy to Cloudflare Workers (production)
bun deploy:preview       # Deploy to preview environment
```

## Styling with Tailwind CSS v4

We're using the latest Tailwind CSS v4 with its new CSS-based configuration. No more JavaScript config files!

### Configuration

The `tailwind.config.css` file uses CSS directives:

```css
@import "tailwindcss";

/* Tell Tailwind where to look for classes */
@source "./pages/**/*.{astro,js,ts,jsx,tsx}";
@source "./layouts/**/*.{astro,js,ts,jsx,tsx}";
@source "../../packages/ui/components/**/*.{ts,tsx}";

/* Custom dark mode variant */
@custom-variant dark (&:is(.dark *));

/* Theme configuration */
@theme inline {
  --color-primary: var(--primary);
  --color-background: var(--background);
  /* ... more theme tokens */
}
```

### Design System

Our design system uses CSS custom properties for theming:

```css
:root {
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --primary: oklch(0.205 0 0);
  /* Light mode colors */
}

.dark {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
  --primary: oklch(0.922 0 0);
  /* Dark mode colors */
}
```

We use [OKLCH](https://oklch.com/) color space because RGB is for screens from the 90s.

## Component Architecture

### Astro Components

Pure Astro components for maximum performance:

```astro
---
// BaseLayout.astro
export interface Props {
  title?: string;
  description?: string;
}

const { title = 'Your Site Title', description } = Astro.props;
---

<!doctype html>
<html lang="en">
  <head>
    <title>{title}</title>
    <meta name="description" content={description} />
  </head>
  <body>
    <slot />
  </body>
</html>
```

### React Islands

Interactive components using React (only where needed):

```astro
---
import { Button } from '@repo/ui';
---

<!-- Only hydrate on visibility for performance -->
<Button client:visible>
  Interactive Button
</Button>

<!-- Or load immediately if critical -->
<Button client:load>
  Critical Button
</Button>
```

### Shared UI Components

We import components from `@repo/ui` - our shared component library powered by [shadcn/ui](https://ui.shadcn.com/):

```typescript
import { Button, Card, Badge } from "@repo/ui";
```

## Pages & Routing

Astro uses file-based routing. Each `.astro` file in `pages/` becomes a route:

- `pages/index.astro` → `/`
- `pages/about.astro` → `/about`
- `pages/features.astro` → `/features`
- `pages/pricing.astro` → `/pricing`

### Dynamic Routes

For dynamic content (if needed):

```astro
---
// pages/blog/[slug].astro
export async function getStaticPaths() {
  return [
    { params: { slug: 'hello-world' } },
    { params: { slug: 'astro-is-awesome' } },
  ];
}

const { slug } = Astro.params;
---

<h1>Blog post: {slug}</h1>
```

## Performance

### Optimization Features

- **Static Generation**: Pre-rendered HTML for instant loading
- **Zero JavaScript by Default**: JS only loads for interactive islands
- **Automatic Image Optimization**: Via Astro's Image component
- **CSS Extraction**: All styles bundled and minified
- **Asset Hashing**: Optimal browser caching

### Lighthouse Scores

We aim for (and usually hit) perfect scores:

- Performance: 100
- Accessibility: 100
- Best Practices: 100
- SEO: 100

Because if you're not getting 100s, are you even trying? 😎

## Deployment

### Cloudflare Workers

The site deploys to Cloudflare Workers Sites for edge delivery:

```bash
# Deploy to production
bun deploy

# Deploy to preview environment
bun deploy:preview
```

### Deployment Configuration

The `wrangler.jsonc` handles deployment:

```jsonc
{
  "name": "your-website-name",
  "compatibility_date": "2025-08-15",
  "assets": {
    "directory": "./dist",
  },
  "build": {
    "command": "bun run build",
  },
}
```

### Environment Variables

```bash
# .env.local (for local development)
PUBLIC_SITE_URL=http://localhost:4321
PUBLIC_API_URL=http://localhost:3000
```

Note: Astro requires `PUBLIC_` prefix for client-side variables.

## SEO & Meta Tags

The `BaseLayout.astro` component handles all SEO meta tags:

- Open Graph tags for social sharing
- Twitter Card meta tags
- Structured data (JSON-LD)
- Canonical URLs
- Sitemap generation

## Best Practices

### Performance Guidelines

1. **Use Astro components** for static content
2. **Add React islands sparingly** - only for interactivity
3. **Lazy load images** below the fold
4. **Minimize client-side JavaScript** - let Astro do the heavy lifting

### Accessibility Guidelines

1. **Semantic HTML** everywhere
2. **ARIA labels** where needed
3. **Keyboard navigation** for all interactive elements
4. **Color contrast** meeting Web Content Accessibility Guidelines AA standards

### Development Guidelines

1. **Type everything** - TypeScript isn't optional
2. **Component composition** over complex components
3. **Mobile-first** responsive design
4. **Test on slow connections** - not everyone has gigabit

## Troubleshooting

### Common Issues

**Port already in use**: Another process is using port 4321

```bash
# Find and kill the process
lsof -i :4321
kill -9 <PID>
```

**Tailwind classes not working**: Make sure the path is included in `@source` directive

**Build fails on Cloudflare**: Check Node.js version compatibility

**React components not interactive**: Forgot to add `client:*` directive

### Debug Mode

```bash
# Verbose logging
DEBUG=* bun dev

# Astro debug info
bun astro info
```

## Contributing

When adding new pages or features:

1. **Keep it static** unless interactivity is essential
2. **Optimize images** - use WebP/AVIF formats
3. **Test performance** with Lighthouse
4. **Check accessibility** with axe DevTools
5. **Preview on mobile** - most users aren't on desktops
6. **Write semantic HTML** - divs are not the only element

Remember: The fastest JavaScript is no JavaScript. 🚀

## Resources

- [Astro Documentation](https://docs.astro.build/)
- [Tailwind CSS v4 Beta](https://tailwindcss.com/docs/v4-beta)
- [Cloudflare Workers Sites](https://developers.cloudflare.com/workers/platform/sites)
- [shadcn/ui Components](https://ui.shadcn.com/)
- [OKLCH Color Space](https://oklch.com/)

---

> _"Why did the developer use Astro? Because they wanted their site to be out of this world!"_ 🌟  
> — Dad Joke Department
