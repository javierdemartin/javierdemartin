import React from 'react';
import Link from 'next/link';

import postList from '../../utils/getAllPosts';
import Layout from '../../components/layout';


export default function Blog() {
  return (
    <Layout>
      {/* <p>Blog</p> */}
      { postList.map((post) => (


<div>
          <Link href={`/blog${post.link}`}>
            <a>
            { post.title }
            {' '}

        </a>
        </Link>
          {'\n\n'}
          </div>
        // <Preview key={post.link} post={post} />
      ))}
    </Layout>
  );
}