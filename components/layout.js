import styles from './layout.module.css'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'

export const siteTitle = 'AWS CloudFormation template generator'

export default function Layout({ children, home }) {
  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="description"
          content="Generate an AWS cloudformation template by typing in the resouces"
        />
        <meta name="og:title" content={siteTitle} />
      </Head>
      <header className={styles.header}>
          <div className={styles.container}>
            <h1 style={{textAlign: 'left', width: '100%'}}>CF Generator</h1>
          </div>
        
      </header>
      <main className={styles.containerHome}>
        {children}
      </main>
    </>
  )
}