import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const trustedAuthorAssociations = new Set(['OWNER', 'MEMBER', 'COLLABORATOR']);

const categoryAliases = new Map([
  ['essay', 'essay'],
  ['随笔', 'essay'],
  ['travel', 'travel'],
  ['游记', 'travel'],
  ['notes', 'notes'],
  ['短札', 'notes'],
  ['projects', 'projects'],
  ['项目', 'projects'],
]);

function cleanIssueValue(value) {
  const trimmed = String(value ?? '').trim();
  return trimmed === '_No response_' ? '' : trimmed;
}

function sectionValue(sections, label) {
  return cleanIssueValue(sections.get(label));
}

function normalizeCategory(value) {
  const raw = cleanIssueValue(value);

  for (const [alias, category] of categoryAliases) {
    if (raw.includes(alias)) {
      return category;
    }
  }

  return 'essay';
}

function parseTags(value) {
  return cleanIssueValue(value)
    .split(/[,，、;\n]/)
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function parseDraft(value) {
  const status = cleanIssueValue(value);
  return status.includes('草稿') || status.toLowerCase().includes('draft');
}

function yamlString(value) {
  return JSON.stringify(String(value ?? ''));
}

function frontmatterDate(createdAt) {
  return new Date(createdAt).toISOString().slice(0, 10);
}

function issueSlug(createdAt, issueNumber) {
  return `${frontmatterDate(createdAt)}-issue-${issueNumber}`;
}

function requiredField(fields, key, fallback = '') {
  const value = cleanIssueValue(fields[key] ?? fallback);
  if (!value) {
    throw new Error(`Missing required issue form field: ${key}`);
  }
  return value;
}

export function parseIssueFormBody(body) {
  const sections = new Map();
  const bodyText = String(body ?? '');
  const matches = [...bodyText.matchAll(/^###\s+(.+?)\s*$/gm)];

  for (let index = 0; index < matches.length; index += 1) {
    const match = matches[index];
    const nextMatch = matches[index + 1];
    const label = match[1].trim();
    const start = match.index + match[0].length;
    const end = nextMatch?.index ?? bodyText.length;
    sections.set(label, bodyText.slice(start, end).trim());
  }

  return {
    title: sectionValue(sections, '文章标题'),
    description: sectionValue(sections, '摘要'),
    category: normalizeCategory(sectionValue(sections, '分类')),
    tags: parseTags(sectionValue(sections, '标签')),
    cover: sectionValue(sections, '封面图 URL（可选）'),
    draft: parseDraft(sectionValue(sections, '发布状态')),
    content: sectionValue(sections, '正文'),
  };
}

export function isTrustedAuthorAssociation(authorAssociation) {
  return trustedAuthorAssociations.has(String(authorAssociation ?? '').toUpperCase());
}

export function shouldProcessIssue(issue) {
  return (
    String(issue?.title ?? '').startsWith('[投稿]') &&
    isTrustedAuthorAssociation(issue?.authorAssociation)
  );
}

export function buildPostFromIssue({ body, number, createdAt }) {
  const fields = parseIssueFormBody(body);
  const title = requiredField(fields, 'title');
  const description = requiredField(fields, 'description');
  const content = requiredField(fields, 'content', '正文从这里开始。');
  const date = frontmatterDate(createdAt);
  const slug = issueSlug(createdAt, number);
  const path = `src/content/posts/${slug}/index.mdx`;

  const contents = `---
title: ${yamlString(title)}
date: ${date}
description: ${yamlString(description)}
tags: ${JSON.stringify(fields.tags)}
category: ${yamlString(fields.category)}
cover: ${yamlString(fields.cover)}
draft: ${fields.draft ? 'true' : 'false'}
---

${content.trim()}
`;

  return {
    contents,
    draft: fields.draft,
    path,
    slug,
    title,
  };
}

async function writeOutputs(outputs) {
  if (!process.env.GITHUB_OUTPUT) {
    return;
  }

  const outputLines = Object.entries(outputs).map(([key, value]) => `${key}=${value}`);
  await writeFile(process.env.GITHUB_OUTPUT, `${outputLines.join('\n')}\n`, { flag: 'a' });
}

export async function publishIssuePostFromEvent(eventPath) {
  const event = JSON.parse(await readFile(eventPath, 'utf8'));
  const issue = event.issue;
  const normalizedIssue = {
    authorAssociation: issue.author_association,
    title: issue.title,
  };

  if (!shouldProcessIssue(normalizedIssue)) {
    await writeOutputs({ skipped: 'true' });
    return { skipped: true };
  }

  const post = buildPostFromIssue({
    body: issue.body,
    createdAt: issue.created_at,
    number: issue.number,
  });

  await mkdir(dirname(post.path), { recursive: true });
  await writeFile(post.path, post.contents);

  await writeOutputs({
    draft: post.draft ? 'true' : 'false',
    path: post.path,
    skipped: 'false',
    slug: post.slug,
    title: post.title,
  });

  return post;
}

const currentFile = fileURLToPath(import.meta.url);

if (process.argv[1] === currentFile) {
  if (!process.env.GITHUB_EVENT_PATH) {
    throw new Error('GITHUB_EVENT_PATH is required');
  }

  await publishIssuePostFromEvent(process.env.GITHUB_EVENT_PATH);
}
