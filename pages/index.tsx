import Image from 'next/image'
import { Inter } from 'next/font/google'
import Link from 'next/link'
const inter = Inter({ subsets: ['latin'] })


export default function Home() {
  return (
    <main>

     
      <h1>Welcome to our test platform </h1>
     <Link href='./SignUpForm'>Sign up</Link>
    </main>
  )
}
