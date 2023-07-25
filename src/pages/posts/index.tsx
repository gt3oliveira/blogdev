import React, { useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import { GetStaticProps } from 'next'
import { getPrismicClient } from '@/services/prismic'
import Prismic from '@prismicio/client'
import { RichText } from 'prismic-dom'

// https://png-pixel.com/
import { FiChevronLeft, FiChevronRight, FiChevronsLeft, FiChevronsRight } from 'react-icons/fi'
import styles from './styles.module.scss'

type Post = {
  slug: string;
  title: string;
  description: string;
  cover: string;
  updatedAt: string;
}

interface PostProps {
  posts: Post[];
  page: string;
  totalPage: string;
}

export default function Posts({ posts, page, totalPage }: PostProps) {  

  const [currentPage, setCurrentPage] = useState(Number(page))
  const [post, setPost] = useState(posts || [])

  async function reqPost(pageNumber: number) {
    const prismic = getPrismicClient()        

    const response = await prismic.query([
      Prismic.Predicates.at('document.type', 'post')
    ], {
      orderings: '[document.last_publication_date desc]', // Ordenar pelo mais recente
      fetch: ['post.title', 'post.description', 'post.cover'],
      pageSize: 3,
      page: String(pageNumber)
    })

    return response;
  }

  async function navigatePage(pageNumber: number) {        
    const response = await reqPost(pageNumber)

    if (response.results.length === 0) {
      return
    }

    const getPosts = response.results.map(post => {
      return {
        slug: post.uid as string,
        title: RichText.asText(post.data.title),
        description: post.data.description.find((content: { type: string }) => content.type === 'paragraph')?.text ?? '',
        cover: post.data.cover.url,
        updatedAt: new Date(post.last_publication_date as string).toLocaleDateString('pt-br', {
          day: '2-digit',
          month: 'long',
          year: 'numeric'
        })
      }
    })    

    setCurrentPage(pageNumber)
    setPost(getPosts)
    scrollTo(0,0)
  }

  return (
    <>
      <Head>
        <title>Blog do Dev | 💬 Conteúdos</title>
      </Head>
      <main className={styles.container}>
        <div className={styles.posts}>
          {post.map(post => (
            <Link key={post.slug} href={`/posts/${post.slug}`} legacyBehavior>
              <a key={post.slug}>
                <Image src={post.cover} alt={post.title}
                  width={720} height={410}
                  quality={100}
                  placeholder='blur'
                  blurDataURL='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mN0vQgAAWEBGHsgcxcAAAAASUVORK5CYII='
                />
                <strong>{post.title}</strong>
                <time>{post.updatedAt}</time>
                <p>{post.description}</p>
              </a>
            </Link>
          ))}

          <div className={styles.buttonNavigate}>
            {currentPage >= 2 && (
              <div>
                <button onClick={() => navigatePage(1)}>
                  <FiChevronsLeft size={25} color='#fff' />
                </button>
                <button onClick={() => navigatePage(currentPage - 1)}>
                  <FiChevronLeft size={25} color='#fff' />
                </button>
              </div>
            )}

            {currentPage < Number(totalPage) && (
              <div className={styles.next}>
                <button onClick={() => navigatePage(currentPage + 1)}>
                  <FiChevronRight size={25} color='#fff' />
                </button>
                <button onClick={() => navigatePage(Number(totalPage))}>
                  <FiChevronsRight size={25} color='#fff' />
                </button>
              </div>
            )}
          </div>

        </div>
      </main>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient()

  const response = await prismic.query([
    Prismic.Predicates.at('document.type', 'post')
  ], {
    orderings: '[document.last_publication_date desc]', // Ordenar pelo mais recente
    fetch: ['post.title', 'post.description', 'post.cover'],
    pageSize: 3
  })

  // console.log(JSON.stringify(response, null, 2))

  const posts = response.results.map(post => {
    return {
      slug: post.uid,
      title: RichText.asText(post.data.title),
      description: post.data.description.find((content: { type: string }) => content.type === 'paragraph')?.text ?? '',
      cover: post.data.cover.url,
      updatedAt: new Date(post.last_publication_date as string).toLocaleDateString('pt-br', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      })
    }
  })

  return {
    props: {
      posts,
      page: response.page,
      totalPage: response.total_pages
    },
    revalidate: 60 * 30
  }
}
