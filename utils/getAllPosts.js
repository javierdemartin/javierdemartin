function importAll(r) {
    return r
      .keys()
      .filter((path) => !path.includes('WIP'))
      .reverse()// .substr(1).replace(/\/index\.md$/, '')
      .map((fileName) => ({
        link: fileName.substr(1).replace('.md', ''),
        // Skip "./xxxx/"
        title: fileName.substr(7).replace('.md', ''),
        module: r(fileName),
      }));
  }
  
export default importAll(require.context('../pages/blog', true, /\.md$/));