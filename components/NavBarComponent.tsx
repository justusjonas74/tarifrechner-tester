"use client"
import Link from "next/link";
import { usePathname } from "next/navigation";


export default function NavbarComponent() {

  const pathname = usePathname()

  return <nav className='navbar navbar-expand-lg bg-body-tertiary'>
    <div className='container'>
      <Link href='/' className='navbar-brand'>
        VVO Tarifrechner Test-Tool
      </Link>
      <ul className='navbar-nav me-auto mb-2 mb-lg-0'>
        <li className='nav-item'>
          <Link
            href='/'
            className={pathname == "/" ? "nav-link active" : "nav-link"}
            aria-current='page'
          >
            EFA/MOBI-App
          </Link>
        </li>
        <li className='nav-item'>
          <Link
            href='/cico'
            className={pathname == "/cico" ? "nav-link active" : "nav-link"}
            aria-current='page'
          >
            CICO/FAIRTIQ
          </Link>
        </li>
        <li className='nav-item'>
          <Link
            href='/info'
            className={pathname == "/info" ? "nav-link active" : "nav-link"}
            aria-current='page'
          >
            Info
          </Link>
        </li>

      </ul>
    </div>
  </nav >
}
