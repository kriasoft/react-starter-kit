import React from 'react';
import MarkdownIt from 'markdown-it';
import fm from 'front-matter';

import Layout from '../../components/base/Layout';
import DefaultPage from '../../components/templates/DefaultPage';

async function action({ path, fetch }) {
  // Generic page fetch from contents
  const resp = await fetch(`/api/content`, {
    method: `post`,
    headers: {
      Accept: `application/json`,
      'Content-Type': `application/json`,
    },
    body: JSON.stringify({
      path: `${path}`,
    }),
  });

  if (resp.status === 404) return undefined;
  if (resp.status !== 200) throw new Error(resp.statusText);

  const { source } = await resp.json();
  if (!source) return undefined;

  // This is an example on how to use the local content API with markdown files.
  // The source const will give back the data from that specific path
  // You can parse it as json too or any other format
  const md = new MarkdownIt('commonmark');
  // Get title and other attributes from markdown file
  const frontmatter = fm(source);
  // Convert Markdown to HTML
  frontmatter.attributes.html = md.render(frontmatter.body);
  const { title, html } = frontmatter.attributes;

  return {
    chunks: ['generic'],
    title,
    component: (
      <Layout>
        <DefaultPage title={title} html={html} />
      </Layout>
    ),
  };
}

export default action;
