import { GetStaticProps } from 'next'
import Head from 'next/head'
import styles from './sobre.module.scss'

import { getPrismicClient } from '@/services/prismic'
import { RichText } from 'prismic-dom'
import Prismic from '@prismicio/client'

import { FaYoutube, FaInstagram, FaFacebook, FaLinkedin } from 'react-icons/fa'

interface ContentProps {
  content: {
    title: string;
    description: string;
    banner: string;
    facebook: string;
    instagram: string;
    youtube: string;
    linkedin: string;
  }
}

export default function Sobre({ content }: ContentProps) {
  return (
    <>
      <Head>
        <title>Blog do Dev | Quem somos ??</title>
      </Head>
      <main className={styles.container}>
        <div className={styles.containerHeader}>
          <section className={styles.ctaText}>
            <h1>{content.title}</h1>
            <p>{content.description}</p>

            <a href={content.youtube}>
              <FaYoutube size={46} />
            </a>
            <a href={content.instagram}>
              <FaInstagram size={46} />
            </a>
            <a href={content.facebook}>
              <FaFacebook size={46} />
            </a>
            <a href={content.linkedin}>
              <FaLinkedin size={46} />
            </a>
          </section>

          <img src={content.banner} alt="Sobre Blog do Dev" />
        </div>
      </main>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient()
  const response = await prismic.query([
    Prismic.Predicates.at('document.type', 'about')
  ])

  const {
    title,
    description,
    banner,
    facebook,
    instagram,
    youtube,
    linkedin
  } = response.results[0].data

  const content = {
    title: RichText.asText(title),
    description: RichText.asText(description),
    banner: banner.url,
    facebook: facebook.url,
    instagram: instagram.url,
    youtube: youtube.url,
    linkedin: linkedin.url
  }

  return {
    props: {
      content
    },
    revalidate: 60 * 60
  }
}
