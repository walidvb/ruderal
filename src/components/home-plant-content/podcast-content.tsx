const EPISODES = [
  { label: 'EP 1', href: '#' },
  { label: 'EP 2', href: '#' },
  { label: 'EP 3', href: '#' },
] as const

export function PodcastPlantContent() {
  return (
    <>
      <nav className="home-plant-podcast-nav" aria-label="Podcast episodes">
        {EPISODES.map((episode, index) => (
          <span key={episode.label} className="flex items-center gap-3">
            {index > 0 ? <span aria-hidden>|</span> : null}
            <a href={episode.href} className="home-plant-podcast-link">
              {episode.label}
            </a>
          </span>
        ))}
        <span aria-hidden>|</span>
        <a href="#" className="home-plant-podcast-link home-plant-podcast-link--list">
          full list
          <span aria-hidden>→</span>
        </a>
      </nav>
      <div className="home-plant-podcast-media" aria-hidden />
    </>
  )
}
