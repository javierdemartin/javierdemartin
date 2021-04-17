function importAll(r) {
    return r
      .keys()
      .filter((path) => !path.includes('WIP'))
      .reverse()// .substr(1).replace(/\/index\.md$/, '')
      .map((fileName) => ({
        link: fileName.substr(1).replace('.md', ''),
        title: fileName.substr(2).replace('.md', ''),
        module: r(fileName),
      }));
  }
  
//   export default importAll(require.context('../pages/blog', true, /\.mdx$/));
export default importAll(require.context('../pages/blog', true, /\.md$/));