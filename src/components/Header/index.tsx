import React from 'react'
import Image from 'next/image'
import styles from './styles.module.scss'
import logo from '../../../public/images/logo.svg'
import { ActiveLink } from '../ActiveLink'

export default function Header() {
  return (
    <header className={styles.headerContainer}>
      <div className={styles.headerContent}>
        <ActiveLink href='/' activeClassName={styles.active}>
          <Image src={logo} alt='logo' />
        </ActiveLink>

        <nav>
          <ActiveLink href='/' activeClassName={styles.active} legacyBehavior>
            <a>Home</a>
          </ActiveLink>
          <ActiveLink href='/posts' activeClassName={styles.active} legacyBehavior>
            <a>Conteúdos</a>
          </ActiveLink>
          <ActiveLink href='/sobre' activeClassName={styles.active} legacyBehavior>
            <a>Quem somos?</a>
          </ActiveLink>
        </nav>

        <a className={styles.readyButton} type='button' href="#">Começar</a>
      </div>
    </header>
  )
}
