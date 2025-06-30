/* SPDX-FileCopyrightText: 2014-present Kriasoft */
/* SPDX-License-Identifier: MIT */

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            React Starter Kit
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Modern full-stack web application template optimized for serverless
            deployment to CDN edge locations. Built with React, TypeScript, and
            the latest web technologies.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <a
                href="https://github.com/kriasoft/react-starter-kit"
                target="_blank"
                rel="noopener noreferrer"
              >
                Get Started
              </a>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <a
                href="https://github.com/kriasoft/react-starter-kit"
                target="_blank"
                rel="noopener noreferrer"
              >
                View on GitHub
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight mb-4">
              Everything you need to build modern web apps
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              React Starter Kit provides a solid foundation with best practices,
              modern tooling, and optimized performance out of the box.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>⚡ Lightning Fast</CardTitle>
                <CardDescription>
                  SSR at CDN edge locations with ~100 Lighthouse scores
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Optimized for Cloudflare Workers with Bun runtime for maximum
                  performance.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>🎨 Modern UI</CardTitle>
                <CardDescription>
                  Beautiful components with ShadCN UI and Tailwind CSS
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Pre-built components following modern design principles and
                  accessibility standards.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>🚀 Developer Experience</CardTitle>
                <CardDescription>
                  TypeScript, hot reload, and excellent tooling
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Full TypeScript support with Vite, TanStack Router, and modern
                  development tools.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>📱 Full-Stack</CardTitle>
                <CardDescription>
                  tRPC API with Firestore and authentication
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Complete backend solution with type-safe APIs and Firebase
                  integration.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>🔧 Configurable</CardTitle>
                <CardDescription>
                  Monorepo structure with workspace management
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Organized codebase with separate app, API, edge, and database
                  workspaces.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>☁️ Serverless Ready</CardTitle>
                <CardDescription>
                  Deploy to edge locations worldwide
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Built for Cloudflare Workers with global distribution and
                  automatic scaling.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/20">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold tracking-tight mb-4">
            Built with Modern Technologies
          </h2>
          <p className="text-muted-foreground text-lg mb-12 max-w-2xl mx-auto">
            Carefully selected technologies that work together seamlessly
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
            {[
              "React 19",
              "TypeScript",
              "Vite",
              "TanStack Router",
              "ShadCN UI",
              "Tailwind CSS",
              "Bun",
              "Hono",
              "tRPC",
              "Firebase",
              "Cloudflare",
              "Jotai",
            ].map((tech) => (
              <div key={tech} className="p-4 rounded-lg bg-background border">
                <span className="font-medium">{tech}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold tracking-tight mb-4">
            Ready to start building?
          </h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
            Get started with React Starter Kit today and build your next project
            with confidence.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <a
                href="https://github.com/kriasoft/react-starter-kit"
                target="_blank"
                rel="noopener noreferrer"
              >
                Clone Repository
              </a>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <a
                href="https://github.com/kriasoft/react-starter-kit#readme"
                target="_blank"
                rel="noopener noreferrer"
              >
                Read Documentation
              </a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
