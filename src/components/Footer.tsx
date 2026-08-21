import Link from 'next/link'

export default function Footer() {
  return <footer className="site-footer">
    <p>&copy; {new Date().getFullYear()} VentureLens</p>
    <nav><Link href="/privacy">개인정보처리방침</Link><Link href="/terms">이용약관</Link><a href="mailto:amandakim6838@gmail.com">문의하기</a></nav>
  </footer>
}
