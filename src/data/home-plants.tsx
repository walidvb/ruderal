export type HomePlantId = 'about' | 'podcasts' | 'happenings' | 'study-group'

export type HomePlantPosition = {
  top: number
  left: number
  labelTop: number
  labelLeft: number
}

export type HomePlant = {
  id: HomePlantId
  title: string
  dialogTitle?: string
  description: string | React.ReactNode
  url: string
  imageSrc: string
  positionDesktop: HomePlantPosition
  positionMobile: HomePlantPosition
}

export const HOME_PLANTS: HomePlant[] = [
  {
    id: 'about',
    title: 'About',
    imageSrc: '/plants/about-plant.png',
    dialogTitle: 'Extending ecological logic into cultural realms',
    description: (
      <>
        Ruderal takes its name from the ecological term ruderal, derived from
        the Latin rudus—rubble, debris, disturbed ground. In ecology, ruderal
        species are plants that thrive in disrupted, abandoned or transitional
        environments: wastelands, margins, cracks and interstitial spaces. They
        grow where established orders begin to fragment, transforming sites of
        rupture into fertile ground. Both indicators of change and agents of
        resilience, they embody the capacity for new forms of life to emerge
        within unstable conditions. Through their often temporary presence and
        adaptive qualities, they open pathways for ongoing transformation,
        preparing the ground for other forms of existence to appear and
        flourish. They remind us that ecological balance is fluid, relational
        and constantly in the making. Ruderal extends this ecological logic into
        the social, cultural, technological and environmental realms.
        <br />
        <br />
        Based in Geneva—a territory shaped by dense networks of knowledge,
        practices, migrations, institutions and initiatives—the association
        understands human and intellectual diversity as a living resource to be
        activated. Rooted in everyday life and in a concrete place, Ruderal
        operates within the interstices: between home and neighbourhood, between
        institutions and vernacular uses, between ecology, creation and
        transmission. At a moment when Geneva, like many other territories, is
        experiencing profound transformations in social relations, technological
        practices and modes of knowledge production, Ruderal seeks to contribute
        to the emergence of formats and structures capable of accompanying these
        shifts and opening renewed forms of coexistence and cooperation.
        <br />
        <br />
        The association mobilises the simultaneous presence of multiple people,
        disciplines and experiences to generate collective forms of
        transmission, encounter and continuous learning. It operates as a
        relational platform for social design and tactical activation, capable
        of intervening in ways that are light, temporary, inclusive and
        responsive. Like ruderal ecologies, Ruderal develops peripheral and
        opportunistic practices: inhabiting margins, passages, temporary
        situations and spaces of friction in order to generate new social and
        cultural possibilities.
      </>
    ),
    url: '',
    positionDesktop: {
      top: 34.6,
      left: 50.68,
      labelTop: 38.45,
      labelLeft: 46.41,
    },
    positionMobile: {
      top: 29.6,
      left: 40.68,
      labelTop: 38.45,
      labelLeft: 46.41,
    },
  },
  {
    id: 'podcasts',
    title: 'Podcast',
    dialogTitle: 'Documenting Artistic Practices and Circulating Knowledge',
    description: (
      <>
        Ruderal produces and shares editorial and audio content emerging through
        multidisciplinary artistic practices in conversation with other fields
        of knowledge. Conceived as a platform for documentation and
        transmission, the podcast programme gives visibility to creative
        processes, critical reflections and situated experiences that often
        remain outside final artistic outputs.
        <br />
        <br /> Through conversations, recordings and shared narratives, it
        contributes to building accessible resources that support exchange,
        reflection and public engagements across disciplines and communities.
        Attentive to the conditions in which practices emerge, these
        conversations assemble heterogeneous voices and temporalities,
        generating a living archive of artistic inquiry and collective
        imagination.
      </>
    ),
    url: '/podcasts',
    imageSrc: '/plants/podcasts-plant.png',
    positionDesktop: {
      top: 37.81,
      left: 16.72,
      labelTop: 38.91,
      labelLeft: 16.72,
    },
    positionMobile: {
      top: 42.81,
      left: 16.72,
      labelTop: 38.91,
      labelLeft: 16.72,
    },
  },
  {
    id: 'happenings',
    title: 'Happenings',
    dialogTitle: 'Cultural participation and Territorial Cooperation',
    description:
      'Ruderal initiates collaborative projects and situated formats that strengthen connections between cultural actors, local contexts and diverse publics. Through participatory events, mediation practices and context-responsive interventions, the programme supports cultural participation and encourages forms of collective engagement rooted in specific territories. These gatherings create opportunities for encounter, dialogue and shared experiences while contributing to the development of sustainable cultural ecosystems',
    url: '',
    imageSrc: '/plants/happenings-plant.png',
    positionDesktop: {
      top: 60.85,
      left: 50.22,
      labelTop: 70.69,
      labelLeft: 48.78,
    },
    positionMobile: {
      top: 66.85,
      left: 51.22,
      labelTop: 70.69,
      labelLeft: 48.78,
    },
  },
  {
    id: 'study-group',
    title: 'Study group',
    dialogTitle: 'Research, Learning and Collective Experimentation.',
    description:
      'Ruderal develops spaces dedicated to collective research, learning and experimentation, fostering continuous education and the circulation of knowledge. Bringing together practitioners, researchers and participants from diverse backgrounds, the study group supports the development of critical tools, professional exchange and collaborative forms of inquiry. Positioned at the intersection of artistic practice and knowledge production, it encourages transversal approaches and creates opportunities for long-term learning and capacity building.',
    url: '',
    imageSrc: '/plants/study-group-plant.png',
    positionDesktop: {
      top: 63.21,
      left: 9.43,
      labelTop: 70.24,
      labelLeft: 14.81,
    },
    positionMobile: {
      top: 68.21,
      left: 13.43,
      labelTop: 70.24,
      labelLeft: 14.81,
    },
  },
]

export const HOME_VIEWBOX = { width: 1728, height: 1098 } as const

export function getHomePlant(id: HomePlantId) {
  return HOME_PLANTS.find((plant) => plant.id === id)
}
