import { existsSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

import {
  buildPostFromIssue,
  isTrustedAuthorAssociation,
  parseIssueFormBody,
  shouldProcessIssue,
} from '../scripts/publish-issue-post.mjs';

const issueBody = `### 文章标题

月亮背面的地球

### 摘要

一次关于远望的短记。

### 分类

游记 travel

### 标签

旅行, 月亮, Earthrise

### 封面图 URL（可选）

https://example.com/cover.jpg

### 发布状态

发布

### 正文

第一段文字。

![地球](https://github.com/user-attachments/assets/example)

第二段文字。`;

describe('GitHub issue post publisher', () => {
  it('parses the mobile issue form into post fields', () => {
    const fields = parseIssueFormBody(issueBody);

    expect(fields.title).toBe('月亮背面的地球');
    expect(fields.description).toBe('一次关于远望的短记。');
    expect(fields.category).toBe('travel');
    expect(fields.tags).toEqual(['旅行', '月亮', 'Earthrise']);
    expect(fields.cover).toBe('https://example.com/cover.jpg');
    expect(fields.draft).toBe(false);
    expect(fields.content).toContain('![地球](https://github.com/user-attachments/assets/example)');
  });

  it('creates a stable MDX post path from the issue number', () => {
    const post = buildPostFromIssue({
      body: issueBody,
      number: 42,
      createdAt: '2026-06-18T09:00:00Z',
    });

    expect(post.path).toBe('src/content/posts/2026-06-18-issue-42/index.mdx');
    expect(post.slug).toBe('2026-06-18-issue-42');
    expect(post.contents).toContain('title: "月亮背面的地球"');
    expect(post.contents).toContain('category: "travel"');
    expect(post.contents).toContain('draft: false');
    expect(post.contents).toContain('第一段文字。');
  });

  it('only publishes issues from trusted repository writers', () => {
    expect(isTrustedAuthorAssociation('OWNER')).toBe(true);
    expect(isTrustedAuthorAssociation('MEMBER')).toBe(true);
    expect(isTrustedAuthorAssociation('COLLABORATOR')).toBe(true);
    expect(isTrustedAuthorAssociation('CONTRIBUTOR')).toBe(false);
    expect(isTrustedAuthorAssociation('NONE')).toBe(false);
  });

  it('requires the mobile writing issue prefix before processing', () => {
    expect(shouldProcessIssue({ title: '[投稿] 月亮背面的地球', authorAssociation: 'COLLABORATOR' })).toBe(true);
    expect(shouldProcessIssue({ title: '月亮背面的地球', authorAssociation: 'COLLABORATOR' })).toBe(false);
    expect(shouldProcessIssue({ title: '[投稿] 垃圾', authorAssociation: 'NONE' })).toBe(false);
  });

  it('adds the GitHub mobile writing form and publishing workflow', () => {
    expect(existsSync('.github/ISSUE_TEMPLATE/blog-post.yml')).toBe(true);
    expect(existsSync('.github/workflows/publish-issue-post.yml')).toBe(true);

    const issueForm = readFileSync('.github/ISSUE_TEMPLATE/blog-post.yml', 'utf8');
    const workflow = readFileSync('.github/workflows/publish-issue-post.yml', 'utf8');

    expect(issueForm).toContain('title: "[投稿] "');
    expect(issueForm).toContain('id: content');
    expect(issueForm).not.toContain('render: markdown');
    expect(workflow).toContain('ISSUE_AUTHOR_ASSOCIATION');
    expect(workflow).toContain('scripts/publish-issue-post.mjs');
  });
});
