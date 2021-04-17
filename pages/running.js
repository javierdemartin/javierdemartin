import React from 'react'
import matter from 'gray-matter'
import ReactMarkdown from "react-markdown";
import Layout from '../components/layout';

function RunningTemplate({ content, data }) {
  // This holds the data between `---` from the .md file
  const frontmatter = data

  return (
    <Layout>
      <h1>{frontmatter.title}</h1>
      {/* <p>{content}</p> */}
      <ReactMarkdown>
          { content }
          </ReactMarkdown>
    </Layout>
  )
}

RunningTemplate.getInitialProps = async (context) => {
  
  // Import our .md file using the `slug` from the URL
  const content = await import(`../content/running.md`)

  // Parse .md data through `matter`
  const data = matter(content.default)
  
  // Pass data to our component props
  return { ...data }
}

export default RunningTemplate