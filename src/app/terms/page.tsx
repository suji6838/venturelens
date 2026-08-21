import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '이용약관 | VentureLens',
}

const EFFECTIVE_DATE = '2026년 8월 21일'

export default function TermsPage() {
  return (
    <div className="legal-shell">
      <div className="legal-top"><div className="legal-page" style={{ padding: 0 }}><Link href="/">← VentureLens로 돌아가기</Link></div></div>
      <article className="legal-page">
        <h1>VentureLens 이용약관</h1>
        <p className="legal-meta">시행일: {EFFECTIVE_DATE}</p>

        <section>
          <h2>제1조 (목적)</h2>
          <p>본 약관은 VentureLens(이하 &ldquo;서비스&rdquo;)가 제공하는 AI 기반 스타트업 발굴 및 투자 정보 서비스의 이용 조건과 절차, 이용자와 서비스 운영자의 권리·의무 및 책임사항을 정함을 목적으로 합니다.</p>
        </section>

        <section>
          <h2>제2조 (서비스의 내용)</h2>
          <ul>
            <li>AI 기반 스타트업 발굴 및 필터링</li>
            <li>뉴스 기반 투자유치 정보 피드</li>
            <li>AI 투자매력도 분석 및 가치 추정 정보 제공</li>
          </ul>
        </section>

        <section>
          <h2>제3조 (이용계약의 성립)</h2>
          <p>이용계약은 이용자가 회원가입 양식(이름, 이메일, 비밀번호)을 작성하고 서비스가 이를 승낙함으로써 성립합니다. 로그인 없이도 AI 추천 기업 열람, 투자유치 뉴스 확인 등 대부분의 기능은 이용할 수 있습니다.</p>
        </section>

        <section>
          <h2>제4조 (이용자의 의무)</h2>
          <ul>
            <li>가입 시 제공하는 정보는 사실에 근거해야 합니다.</li>
            <li>본인의 계정 정보를 제3자가 이용하도록 공유해서는 안 되며, 이로 인해 발생하는 문제의 책임은 이용자 본인에게 있습니다.</li>
            <li>자동화된 대량 요청 등 서비스를 부정한 목적으로 이용하거나 서비스 운영을 방해하는 행위를 해서는 안 됩니다.</li>
          </ul>
        </section>

        <section>
          <h2>제5조 (콘텐츠 및 저작권)</h2>
          <p>서비스가 연동하는 뉴스 기사의 저작권은 각 원 저작권자(언론사 등)에게 있으며, 서비스는 해당 콘텐츠의 출처를 표시하고 원문 링크로 연결합니다. 서비스가 직접 작성한 UI, 로고, 편집 구성 등의 저작권은 서비스 운영자에게 있습니다.</p>
        </section>

        <section>
          <h2>제6조 (서비스의 변경 및 중단)</h2>
          <p>서비스 운영자는 운영상·기술상 필요에 따라 서비스의 전부 또는 일부를 변경하거나 중단할 수 있으며, 이 경우 서비스 내 공지를 통해 안내합니다. 서비스가 연동하는 외부 API(뉴스·AI 등)의 장애로 서비스 제공이 일시 중단될 수 있습니다.</p>
        </section>

        <section>
          <h2>제7조 (AI 분석 정보 및 투자 유의사항)</h2>
          <p>서비스가 제공하는 AI 기반 투자매력도 점수, 가치 추정, 시장 분석 등 일체의 정보(이하 &ldquo;AI 분석 정보&rdquo;)는 외부 뉴스 기사 및 공개 데이터를 기초로 생성형 AI가 자동 산출한 참고용 콘텐츠이며, 특정 기업에 대한 투자 자문, 투자 권유 또는 청약의 권유에 해당하지 않습니다. 서비스 운영자는 「자본시장과 금융투자업에 관한 법률」에 따른 투자자문업, 투자중개업 등을 등록하지 않았으며, AI 분석 정보는 전문적인 투자 자문을 대체할 수 없습니다. 이용자는 AI 분석 정보를 참고자료로만 활용해야 하며, 이를 근거로 한 투자 판단 및 그로 인한 손실 등 일체의 결과에 대한 책임은 이용자 본인에게 있습니다.</p>
        </section>

        <section>
          <h2>제8조 (면책조항)</h2>
          <p>서비스가 제공하는 정보는 그 정확성·완전성을 보장하지 않습니다. 서비스는 이용자가 제공된 정보를 바탕으로 내린 판단이나 그로 인해 발생한 손해에 대해 책임을 지지 않습니다. 또한 천재지변, 제3자(NAVER, Google, Vercel 등 외부 서비스)의 장애로 인한 서비스 중단에 대해서는 책임이 제한될 수 있습니다.</p>
        </section>

        <section>
          <h2>제9조 (회원 탈퇴 및 이용 제한)</h2>
          <p>계정 정보는 별도 서버 없이 이용자의 브라우저에 저장되므로, 브라우저에 저장된 사이트 데이터를 삭제하면 즉시 탈퇴 처리됩니다. 이용자가 본 약관을 위반하거나 서비스 운영을 방해하는 경우, 서비스 운영자는 서비스 이용을 제한할 수 있습니다.</p>
        </section>

        <section>
          <h2>제10조 (약관의 개정)</h2>
          <p>본 약관은 관련 법령 또는 서비스 정책 변경에 따라 개정될 수 있으며, 개정 시 이 페이지를 통해 공지합니다.</p>
        </section>

        <section>
          <h2>제11조 (문의)</h2>
          <p>서비스 이용과 관련한 문의는 아래 이메일로 연락해 주시기 바랍니다.</p>
          <p>이메일: <a href="mailto:amandakim6838@gmail.com">amandakim6838@gmail.com</a></p>
        </section>
      </article>
    </div>
  )
}
