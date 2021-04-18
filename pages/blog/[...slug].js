import React from 'react'
import matter from 'gray-matter'
import Layout from '../../components/layout';
import ReactMarkdown from "react-markdown";


function PostTemplate({ content, data }) {
  // This holds the data between `---` from the .md file
  const frontmatter = data

  return (
    <Layout>
       <h1>{frontmatter.title}</h1>
       
      <ReactMarkdown>
          { content }
          </ReactMarkdown>
    </Layout>
  )
}

PostTemplate.getInitialProps = async (context) => {
  const { slug } = context.query

  
  // Import our .md file using the `slug` from the URL
  // const content = await import(`../../pages/blog/${slug}.md`)
  const content = await import(`../../pages/blog/${slug.join('/')}.md`)
  
  // Parse .md data through `matter`
  const data = matter(content.default)
  
  // Pass data to our component props
  return { ...data }
}

export default PostTemplate