import { ArrowLeft, ArrowUpRight } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { PageHeader } from '../components/ui'
import { ARTICLES } from '../lib/content'

export function Learn() {
  const [feature, ...rest] = ARTICLES
  return (
    <div className="rise">
      <PageHeader eyebrow="The library" title="Learn" />

      <Link to={`/learn/${feature.slug}`} className="lacquer block rounded-[32px] p-6">
        <p className="eyebrow text-brass-soft">Start here · {feature.minutes} min</p>
        <h2 className="mt-3 font-display text-4xl leading-tight font-medium">{feature.title}</h2>
        <p className="mt-3 text-sm leading-relaxed text-ivory/60">{feature.dek}</p>
        <span className="mt-6 inline-flex items-center gap-1 text-[0.68rem] tracking-[0.2em] uppercase">
          Read <ArrowUpRight size={14} strokeWidth={1.5} />
        </span>
      </Link>

      <ul className="mt-6">
        {rest.map((a) => (
          <li key={a.slug}>
            <Link to={`/learn/${a.slug}`} className="group flex items-start justify-between gap-4 border-b border-hairline py-5">
              <div>
                <p className="eyebrow text-graphite">
                  {a.category} · {a.minutes} min
                </p>
                <h3 className="mt-1.5 font-display text-2xl leading-tight font-medium group-hover:italic">{a.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-graphite">{a.dek}</p>
              </div>
              <ArrowUpRight size={18} strokeWidth={1.3} className="mt-6 shrink-0 text-graphite transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function ArticlePage() {
  const { slug } = useParams()
  const article = ARTICLES.find((a) => a.slug === slug)

  if (!article) {
    return (
      <div className="pt-16 text-center">
        <p className="font-display text-3xl">Not found</p>
        <Link to="/learn" className="mt-4 inline-block text-sm underline">Back to the library</Link>
      </div>
    )
  }

  return (
    <article className="rise pb-8">
      <Link to="/learn" className="mt-8 inline-flex items-center gap-2 text-[0.68rem] tracking-[0.2em] text-graphite uppercase hover:text-piano">
        <ArrowLeft size={14} strokeWidth={1.5} /> Library
      </Link>
      <p className="eyebrow mt-8 text-graphite">
        {article.category} · {article.minutes} min read
      </p>
      <h1 className="mt-2 font-display text-5xl leading-[1.05] font-medium tracking-tight">{article.title}</h1>
      <p className="mt-4 font-display text-xl leading-snug text-graphite italic">{article.dek}</p>
      <div className="rule my-8" />
      <div className="space-y-4 text-[1.02rem] leading-[1.75]">
        {article.body.map((p, i) =>
          p.startsWith('## ') ? (
            <h2 key={i} className="pt-4 font-display text-2xl font-medium">
              {p.slice(3)}
            </h2>
          ) : (
            <p key={i} className={i === 0 ? 'first-letter:float-left first-letter:mr-2 first-letter:font-display first-letter:text-6xl first-letter:leading-[0.85]' : ''}>
              {p}
            </p>
          ),
        )}
      </div>
    </article>
  )
}
