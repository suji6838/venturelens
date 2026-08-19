export type Startup = {
  id: number; name: string; industry: string; founded: number; score: number; stage: string; growth: string; funding: string; tag: string; summary: string; model: string; market: string; growth_text: string; competition: string; valuation: string; fair: string; basis: string; confidence: number; history: string[];
}

type Props = { startup: Startup; selected: boolean; onSelect: () => void }
export default function StartupCard({ startup, selected, onSelect }: Props) {
  return <button className={`startup-card ${selected ? 'selected' : ''}`} onClick={onSelect} aria-pressed={selected}>
    <div className="card-top"><span className="rank">TOP {startup.id}</span><span className={`tag ${startup.tag === '강한 매수' ? 'strong' : ''}`}>{startup.tag}</span></div>
    <div className="score-row"><div><h3>{startup.name}</h3><p>{startup.industry}</p></div><div className="score"><b>{startup.score}</b><small>점</small></div></div>
    <div className="metrics"><span><small>투자 단계</small>{startup.stage}</span><span><small>설립</small>{startup.founded}년</span><span><small>성장률</small>{startup.growth}</span></div>
    <div className="funding"><span className="dot" /> 최근 투자 {startup.funding}</div>
  </button>
}
