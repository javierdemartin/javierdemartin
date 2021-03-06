import React from 'react';
import Link from 'next/link';

import postList from '../../utils/getAllPosts';
import Layout from '../../components/layout';
import styles from '../../components/layout.module.css'


export default function Blog() {
  return (
    <Layout>

        { postList.map((post) => (
			<div className={styles.postList}>
                <Link href={`/blog${post.link}`}>
                <a>{ post.title }</a>
                </Link>
            </div>
        ))}
    </Layout>
  );
}