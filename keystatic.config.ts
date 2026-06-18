import { collection, config, fields } from '@keystatic/core';
import { block, wrapper } from '@keystatic/core/content-components';

import {
  editablePostCollectionPath,
  editorImageConfig,
  postCategoryOptions,
} from './src/lib/editor-config';

const textImageFields = {
  src: fields.text({
    label: '图片 URL',
    validation: { isRequired: true },
  }),
  alt: fields.text({ label: '替代文字' }),
  caption: fields.text({ label: '图注', multiline: true }),
};

const writingComponents = {
  WideImage: block({
    label: '宽图',
    schema: textImageFields,
  }),
  ImageText: wrapper({
    label: '图文并排',
    schema: {
      ...textImageFields,
      side: fields.select({
        label: '图片位置',
        options: [
          { label: '左侧', value: 'left' },
          { label: '右侧', value: 'right' },
        ],
        defaultValue: 'right',
      }),
    },
  }),
  ImageGrid: block({
    label: '图片组',
    schema: {
      images: fields.array(fields.object(textImageFields), {
        label: '图片',
        itemLabel: ({ value }) => value.caption || value.alt || '图片',
      }),
    },
  }),
  PullQuote: wrapper({
    label: '引用',
    schema: {},
  }),
  Note: wrapper({
    label: '提示',
    schema: {
      title: fields.text({ label: '标题', defaultValue: '写作提醒' }),
    },
  }),
  RouteMap: block({
    label: '路线',
    schema: {
      start: fields.text({ label: '起点', validation: { isRequired: true } }),
      end: fields.text({ label: '终点', validation: { isRequired: true } }),
      stops: fields.array(fields.text({ label: '停靠点' }), {
        label: '停靠点',
        itemLabel: ({ value }) => value || '停靠点',
      }),
      date: fields.text({ label: '日期' }),
      transport: fields.text({ label: '交通方式' }),
    },
  }),
};

export default config({
  storage: {
    kind: 'local',
  },
  ui: {
    brand: {
      name: 'Reid 写作后台',
    },
    navigation: {
      内容: ['posts'],
    },
  },
  collections: {
    posts: collection({
      label: '文章',
      slugField: 'title',
      path: editablePostCollectionPath,
      format: { contentField: 'content' },
      entryLayout: 'content',
      columns: ['title', 'date', 'category', 'draft'],
      schema: {
        title: fields.slug({
          name: {
            label: '标题',
            validation: { isRequired: true },
          },
          slug: {
            label: 'URL Slug',
            description: '用于文章链接，建议英文或拼音。',
          },
        }),
        date: fields.date({
          label: '发布日期',
          defaultValue: { kind: 'today' },
          validation: { isRequired: true },
        }),
        description: fields.text({
          label: '摘要',
          multiline: true,
          validation: { isRequired: true },
        }),
        tags: fields.array(fields.text({ label: '标签' }), {
          label: '标签',
          itemLabel: ({ value }) => value || '新标签',
        }),
        category: fields.select({
          label: '分类',
          options: postCategoryOptions,
          defaultValue: 'essay',
        }),
        cover: fields.text({
          label: '封面图 URL',
          description: '可先用远程图片地址；正文图片可在编辑器里上传。',
        }),
        location: fields.text({
          label: '地点',
          description: '游记可填，例如 Kamakura, Japan。',
        }),
        series: fields.text({
          label: '系列',
        }),
        draft: fields.checkbox({
          label: '草稿',
          defaultValue: true,
          description: '勾选时不会出现在公开页面。',
        }),
        featured: fields.checkbox({
          label: '首页精选',
          defaultValue: false,
        }),
        content: fields.mdx({
          label: '正文',
          options: {
            image: {
              directory: editorImageConfig.directory,
              publicPath: editorImageConfig.publicPath,
            },
          },
          components: writingComponents,
        }),
      },
    }),
  },
});
