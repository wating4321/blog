module.exports = {
  title: '十一的博客',
  head: [
    ['link', {rel: 'manifest',href: '/shiyi.png'}],
    ['link', {rel: 'apple-touch-icon',href: '/shiyi.png'}]
  ],
  serviceWorker: true,
  themeConfig: {
    logo: '/shiyi.png',
    nav: [
      {text: '首页', link: '/'},
      {
        text: '技术文档',
        items: [
            { text: 'JavaScript', link: '/JavaScript/' },
            { text: 'CSS', link: '/CSS/' },
            { text: 'HTML5', link: '/HTML5/' },
            { text: 'VUE', link: '/VUE/' },
            { text: 'REACT', link: '/REACT/' }
        ],
      },
      { text: '关于个人', link: '/Personal/' },
    ],
    sidebar: {
      '/JavaScript/': [
        '',
        'shallow-copy',
        'sort',
        'event-model',
        'inherit',
        'this',
        'event-commission',
        'let&const',
        'qqq',
        'requestAnimationFrame',
        'Browser',
        // 'deep-copy',
        'type',
      ],
      '/CSS/': [],
      '/HTML5/': [''],
      '/VUE/': [''],
      '/REACT/': ['']
    }
  },
  
  base: '/'
}