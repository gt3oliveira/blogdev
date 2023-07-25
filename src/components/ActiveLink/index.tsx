import Link, { LinkProps } from 'next/link'
import { useRouter } from 'next/router';
import React, { ReactElement, cloneElement } from 'react'

interface ActiveLinkProps extends LinkProps {
  children: ReactElement;
  activeClassName: string;
}

export function ActiveLink({ children, activeClassName, ...rest }: ActiveLinkProps) {
  const { asPath } = useRouter() // pegando o endereço da página atual  ex:('/posts' || '/')
  const className = asPath === rest.href ? activeClassName : ''

  return (
    <Link {...rest}>
      {cloneElement(children, {className})}
    </Link>
  )
}
