import styles from './layout.module.css'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'

export const siteTitle = 'AWS CloudFormation template generator'

export default function Layout({ children, home }) {
  return (
    <div>
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

        <footer className={styles.footer}>
          <a
            href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Powered by{' '}
            <span className={styles.logo}>
              <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
            </span>
          </a>
        </footer>
      </main>
    </div>
  )
}