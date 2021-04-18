import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import hljs from 'highlight.js/lib/core';
import PostHeader from 'components/postHeader';

import hljs from 'highlight.js';
import javascript from 'highlight.js/lib/languages/javascript';
hljs.registerLanguage('javascript', javascript);

function updateCodeSyntaxHighlighting() {
  document.querySelectorAll('pre code').forEach((block) => {
    // Chrome and Safari need re-highlighting on every post load
    hljs.highlightBlock(block);
  });
}

function BlogPost({ children, meta }) {
  useEffect(() => {
    updateCodeSyntaxHighlighting();
  }, [children]);

  return (
    <>
      <Head>
      <link rel="stylesheet" href="//cdn.jsdelivr.net/gh/highlightjs/cdn-release@10.3.2/build/styles/default.min.css"></link>
        <title>
          {meta.title}
          {' '}
          - Javier de Martín
        </title>
        <meta name="title" content={meta.title} />
        <meta name="description" content={meta.description} />
        <meta property="og:image" content={meta.postImg} />

        <meta property="og:type" content="website" />
        <meta property="og:title" content={meta.title} />
        {/* <meta property="og:description" content={meta.description} /> */}
        {/* <meta property="og:image" content={meta.postImg} /> */}

        <meta name="twitter:card" content="summary" />
        <meta name="twitter:site" content="@javierdemartin" />
        <meta name="twitter:title" content={meta.title} />
        <meta name="twitter:description" content={meta.description} />
        <meta
          name="twitter:image"
        />
      </Head>
      {/* <PostHeader meta={meta} isBlogPost /> */}
      <article>{children}</article>
    </>
  );
}

BlogPost.propTypes = {
  children: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  meta: PropTypes.object,
};

export default BlogPost;