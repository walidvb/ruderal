export type HomePlantId = 'about' | 'podcasts' | 'happenings' | 'study-group'

export type HomePlant = {
  id: HomePlantId
  title: string
  description: string
  url: string
}

export const HOME_PLANTS: HomePlant[] = [
  {
    id: 'about',
    title: 'About',
    description:
      'Ruderal takes its name from the ecological term ruderal, derived from the Latin rudus—rubble, debris, disturbed ground. In ecology, ruderal species are plants that thrive in disrupted, abandoned or transitional environments: wastelands, margins, cracks and interstitial spaces. They grow where established orders begin to fragment, transforming sites of rupture into fertile ground. Both indicators of change and agents of resilience, they embody the capacity for new forms of life to emerge within unstable conditions. Through their often temporary presence and adaptive qualities, they open pathways for ongoing transformation, preparing the ground for other forms of existence to appear and flourish. They remind us that ecological balance is fluid, relational and constantly in the making. Ruderal extends this ecological logic into the social, cultural, technological and environmental realms. Based in Geneva—a territory shaped by dense networks of knowledge, practices, migrations, institutions and initiatives—the association understands human and intellectual diversity as a living resource to be activated. Rooted in everyday life and in a concrete place, Ruderal operates within the interstices: between home and neighbourhood, between institutions and vernacular uses, between ecology, creation and transmission. At a moment when Geneva, like many other territories, is experiencing profound transformations in social relations, technological practices and modes of knowledge production, Ruderal seeks to contribute to the emergence of formats and structures capable of accompanying these shifts and opening renewed forms of coexistence and cooperation. The association mobilises the simultaneous presence of multiple people, disciplines and experiences to generate collective forms of transmission, encounter and continuous learning. It operates as a relational platform for social design and tactical activation, capable of intervening in ways that are light, temporary, inclusive and responsive. Like ruderal ecologies, Ruderal develops peripheral and opportunistic practices: inhabiting margins, passages, temporary situations and spaces of friction in order to generate new social and cultural possibilities.',
    url: '',
  },
  {
    id: 'podcasts',
    title: 'Podcast',
    description:
      'Documenting Artistic Practices and Circulating Knowledge. Ruderal produces and shares editorial and audio content emerging through multidisciplinary artistic practices in conversation with other fields of knowledge. Conceived as a platform for documentation and transmission, the podcast programme gives visibility to creative processes, critical reflections and situated experiences that often remain outside final artistic outputs. Through conversations, recordings and shared narratives, it contributes to building accessible resources that support exchange, reflection and public engagements across disciplines and communities. Attentive to the conditions in which practices emerge, these conversations assemble heterogeneous voices and temporalities, generating a living archive of artistic inquiry and collective imagination.',
    url: '',
  },
  {
    id: 'happenings',
    title: 'Happenings',
    description: '',
    url: '',
  },
  {
    id: 'study-group',
    title: 'Study group',
    description:
      'Research, Learning and Collective Experimentation. Ruderal develops spaces dedicated to collective research, learning and experimentation, fostering continuous education and the circulation of knowledge. Bringing together practitioners, researchers and participants from diverse backgrounds, the study group supports the development of critical tools, professional exchange and collaborative forms of inquiry. Positioned at the intersection of artistic practice and knowledge production, it encourages transversal approaches and creates opportunities for long-term learning and capacity building.',
    url: '',
  },
]

export const HOME_VIEWBOX = { width: 1728, height: 1098 } as const

export function getHomePlant(id: HomePlantId) {
  return HOME_PLANTS.find((plant) => plant.id === id)
}
