import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '개인정보처리방침 | VentureLens',
}

const EFFECTIVE_DATE = '2026년 8월 21일'

export default function PrivacyPage() {
  return (
    <div className="legal-shell">
      <div className="legal-top"><div className="legal-page" style={{ padding: 0 }}><Link href="/">← VentureLens로 돌아가기</Link></div></div>
      <article className="legal-page">
        <h1>VentureLens 개인정보처리방침</h1>
        <p className="legal-meta">시행일: {EFFECTIVE_DATE}</p>

        <section>
          <p>VentureLens(이하 &ldquo;서비스&rdquo;)는 이용자의 개인정보를 소중히 여기며, 「개인정보 보호법」 등 관련 법령을 준수합니다. 본 방침은 서비스가 어떤 개인정보를 수집·이용·보관하는지 안내합니다.</p>
        </section>

        <section>
          <h2>1. 수집하는 개인정보 항목</h2>
          <ul>
            <li><strong>회원가입 시</strong>: 이름, 이메일 주소, 비밀번호</li>
            <li><strong>서비스 이용 과정</strong>: 로그인 세션 정보(브라우저 세션 저장소), 검색·필터 조건</li>
          </ul>
        </section>

        <section>
          <h2>2. 개인정보의 수집 및 이용 목적</h2>
          <ul>
            <li>회원 식별 및 로그인 인증</li>
            <li>서비스 이용 문의 응대</li>
            <li>서비스 개선 및 신규 기능 안내</li>
          </ul>
        </section>

        <section>
          <h2>3. 개인정보의 보유 및 이용 기간</h2>
          <p>현재 서비스는 별도의 서버 데이터베이스를 운영하지 않으며, 회원가입 시 입력한 이름·이메일·비밀번호는 서비스 서버로 전송·저장되지 않고 이용자의 브라우저(로컬 저장소)에만 저장됩니다. 이용자가 브라우저의 사이트 데이터를 삭제하거나 다른 기기·브라우저로 접속하면 이전에 저장된 정보는 더 이상 조회·이용할 수 없습니다. 로그인 세션 정보는 브라우저 세션 저장소에 저장되며, 브라우저(탭)를 종료하면 자동으로 삭제됩니다. 향후 서버 기반 회원 시스템이 도입되는 경우 본 방침을 사전에 개정하여 고지하며, 그 시점부터는 회원 탈퇴 시 또는 목적 달성 후 지체 없이 개인정보를 파기합니다.</p>
        </section>

        <section>
          <h2>4. 개인정보 처리 위탁 및 외부 서비스 이용</h2>
          <p>서비스는 아래와 같은 외부 서비스를 이용하고 있습니다.</p>
          <ul>
            <li><strong>Google Gemini API</strong> (검색 필터 조건 및 공개 뉴스 텍스트를 전송하여 AI 분석 결과 생성)</li>
            <li><strong>NAVER 뉴스 검색 API</strong> (검색 키워드를 전송하여 관련 뉴스 기사 조회)</li>
            <li><strong>Vercel</strong> (서비스 서버 호스팅)</li>
          </ul>
          <p>위 서비스 중 Google Gemini, NAVER에는 이용자를 식별할 수 있는 개인정보(이름, 이메일 등)가 전송되지 않으며, 검색어·필터 조건·공개 뉴스 텍스트만 처리됩니다. Vercel은 서비스 호스팅을 위해 접속 로그(접속 IP 등)를 처리할 수 있습니다.</p>
        </section>

        <section>
          <h2>5. 개인정보의 제3자 제공</h2>
          <p>서비스는 이용자의 개인정보를 위 이용 업체 외의 제3자에게 제공하지 않습니다. 다만 법령에 근거가 있거나 수사기관이 적법한 절차에 따라 요청하는 경우는 예외로 합니다.</p>
        </section>

        <section>
          <h2>6. 이용자의 권리</h2>
          <p>이용자는 언제든지 본인의 개인정보 열람, 정정, 삭제를 요청할 수 있습니다. 계정 삭제는 브라우저에 저장된 사이트 데이터를 삭제하는 방법으로 직접 처리할 수 있으며, 그 외 문의는 아래 이메일로 연락해 주시기 바랍니다.</p>
        </section>

        <section>
          <h2>7. 쿠키 및 로컬 저장소 사용</h2>
          <p>서비스는 별도의 추적 쿠키를 사용하지 않으며, 로그인 상태 유지를 위해 브라우저의 세션 저장소 및 로컬 저장소를 사용합니다. 브라우저 설정에서 저장된 정보를 언제든지 삭제할 수 있으며, 이 경우 로그인 상태가 초기화될 수 있습니다.</p>
        </section>

        <section>
          <h2>8. 개인정보의 안전성 확보 조치</h2>
          <p>현재 개인정보를 서비스 서버에 별도 저장하지 않고 이용자 브라우저에만 저장하여, 서버 해킹 등으로 인한 대량 유출 위험을 구조적으로 낮추고 있습니다. 다만 브라우저 로컬 저장소는 암호화되지 않은 상태로 저장되므로, 공용 PC 등 타인과 공유하는 기기에서는 회원가입·로그인 이용을 권장하지 않습니다. 향후 서버 기반 회원 시스템을 도입할 경우 비밀번호 암호화 저장 등 관련 법령이 요구하는 안전성 확보 조치를 적용할 예정입니다.</p>
        </section>

        <section>
          <h2>9. 개인정보 보호책임자 및 문의</h2>
          <p>개인정보 관련 문의, 열람·정정·삭제 요청은 아래 이메일로 연락해 주시기 바랍니다.</p>
          <p>이메일: <a href="mailto:amandakim6838@gmail.com">amandakim6838@gmail.com</a></p>
        </section>

        <section>
          <h2>10. 개정 안내</h2>
          <p>본 방침은 법령 및 서비스 변경에 따라 개정될 수 있으며, 변경 시 이 페이지를 통해 공지합니다.</p>
        </section>

        <p className="muted">관련 문서: <Link href="/terms">이용약관</Link></p>
      </article>
    </div>
  )
}
