export const site = {
  name: "Reid's Notes",
  title: "Reid's Notes",
  description: '在生活和技术之间，慢慢写。游记、阅读、AI 观察和一些在路上想明白的小事。',
  url: 'https://zhuch-520.github.io',
  author: 'Reid',
  nav: [
    { label: '文章', href: '/posts/' },
    { label: '游记', href: '/travel/' },
    { label: '短札', href: '/notes/' },
    { label: '关于', href: '/about/' },
  ],
};

export const categoryLabels = {
  essay: '文章',
  travel: '游记',
  notes: '短札',
  projects: '项目',
} as const;
