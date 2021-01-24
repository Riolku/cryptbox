import Head from 'next/head'

interface HeaderProps{
    title: string
}

export default function Header({title}:HeaderProps){
    return(
        <Head>
            <title>CryptBox | {title}</title>
            <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        </Head>
    )
}