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

// export async function getPostData(id) {
//         const fullPath = path.join(postsDirectory, `${id}.md`)
//         const fileContents = fs.readFileSync(fullPath, 'utf8')
    
//         // Use gray-matter to parse the post metadata section
//         const matterResult = matter(fileContents)
    
//         // Use remark to convert markdown into HTML string
//     const processedContent = await remark()
//             .use(html)
//             .process(matterResult.content)
//         const contentHtml = processedContent.toString()
    
//         // Combine the data with the id and contentHtml
//         return {
//             id,
//             contentHtml,
//             markdown: matterResult.content,
//             ...matterResult.data
//         }
// }