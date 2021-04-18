import Head from 'next/head'
import Layout, { siteTitle } from '../components/layout'
import utilStyles from '../styles/utils.module.css'
import Link from 'next/link'

export default function Home() {
  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section className={utilStyles.headingMd}>
        <p>iOS engineer, also probably <Link href="/running"><a>running</a></Link> around</p>
        {/* <p>I also really like <Link href="/coffee"><a>coffee</a></Link></p> */}

        <p>Check out <Link href="/singlet"><a>Singlet</a></Link>!, the best app to analyze your runs on your iPhone.</p>

        <p>Built <Link href="https://neuralbike.app"><a>Neural Bikes</a></Link> to show bike sharing demand predictions using Machine Learning.</p>

        <p>I am compiling litle tips of <Link href="/swift">
          <a>Swift</a>
          </Link></p>

        <p>
          <Link href="https://twitter.com/javierdemartin">
          <a>Twitter</a>
          </Link>
          {' '}
          <Link href="https://github.com/javierdemartin">
            <a>GitHub</a>
          </Link>
          {' '}
          <Link href="/blog">
            <a>Blog</a>
          </Link>
        </p>
      </section>
    </Layout>
  )
}