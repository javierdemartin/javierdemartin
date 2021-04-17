import React from 'react'
import matter from 'gray-matter'
import ReactMarkdown from "react-markdown";
import Layout from '../components/layout';
import Image from 'next/image'
import Link from 'next/link';

function RunningTemplate({ content, data }) {
  // This holds the data between `---` from the .md file
  const frontmatter = data

  return (
    <Layout>
      {/* <h1>{frontmatter.title}</h1> */}
      {/* <p>{content}</p> */}

        <Image
              priority
              src="/singlet/singlet_promo.png"
              height={1638}
              width={2010}
              layout="responsive"
        />


    <Link href="https://apps.apple.com/us/app/id1545746941">
    <Image
              priority
              src="/singlet/app_store.svg"
              width={120}
              height={120}
              layout="fixed"
        />
    </Link>

        <p>
        Singlet is the running log you need to keep track of your progress as a runner. That's it, that's what you need to know.

Apple Watches, Garmins, Polars, even if you only use your phone. Every single source of data works and it's read by Singlet. Any device that writes workout data to HealthKit works. Singlet will then display all the relevant data you need to know so you become a better runner.
        </p>

        <p>
        Notable features:

        <ul>
            <li>Voice Over support</li>
            <li>Widget showing your latest workout data</li>
            <li>Health.app data analysis alongside your workout data</li>
            <li>Health.app data analysis alongside your workout data</li>
            <li>A place that joins Health.app and Fitness.app data in a single spot</li>
        </ul>

    Heads up for developers, alongside this app I am maintaining <Link href="https://github.com/javierdemartin/HKCombine">HKCombine</Link>, an open source Combine-based wrapper for common HealthKit operations that I use in this application.

    <h3>Privacy</h3>

Singlet does not track you in any way. In fact it doesn't use any third party libraries. Everything stays on your device.
        </p>
    </Layout>
  )
}

export default RunningTemplate