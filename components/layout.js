import Head from 'next/head'
import Image from 'next/image'
import styles from './layout.module.css'
import utilStyles from '../styles/utils.module.css'
import Link from 'next/link'

import hljs from 'highlight.js';
import javascript from 'highlight.js/lib/languages/javascript';
hljs.registerLanguage('javascript', javascript);


const name = 'javierdemartin'
export const siteTitle = 'javierdemartin'

export default function Layout({ children, home }) {
  return (
    <div className={styles.container}>
      <Head>
//         <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width"/>
        <meta
          name="description"
          content="I guess this is my web"
        />
        
        <meta name="og:title" content={siteTitle} />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <header className={styles.header}>
      
      
      
      <h2 className={utilStyles.heading}>
      <Link href="/">
                <a className={utilStyles.colorInherit}>{name}</a>
              </Link>
              </h2>

        {/* {home ? (
          <>
            <Image
              priority
              src="/images/profile.jpg"
              className={utilStyles.borderCircle}
              height={144}
              width={144}
              alt={name}
            />
            <h1 className={utilStyles.heading}>{name}</h1>
          </>
        ) : (
          <>
            <Link href="/">
              <a>
                <Image
                  priority
                  src="/images/profile.jpg"
                  className={utilStyles.borderCircle}
                  height={108}
                  width={108}
                  alt={name}
                />
              </a>
            </Link>
            <h2 className={utilStyles.heading}>
              <Link href="/">
                <a className={utilStyles.colorInherit}>{name}</a>
              </Link>
            </h2>
          </>
        )} */}
      </header>
      <main>{children}</main>
      {!home && (
        <div className={styles.backToHome}>
          <Link href="/">
            <a>←</a>
          </Link>
        </div>
      )}
    </div>
  )
}