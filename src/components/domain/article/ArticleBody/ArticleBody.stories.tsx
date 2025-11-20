/**
 * ArticleBody Component Stories
 * Shows article content with HTML rendering and styled links
 */

import type { Meta, StoryObj } from '@storybook/nextjs'
import { ArticleBody } from './ArticleBody'

const meta = {
  title: 'Domain/Article/ArticleBody',
  component: ArticleBody,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Article body content with HTML rendering. Features styled links with green underline animation and external link icons.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    content: {
      control: 'text',
      description: 'HTML content to render',
    },
  },
} satisfies Meta<typeof ArticleBody>

export default meta
type Story = StoryObj<typeof meta>

const sampleContent = `
  <h2>KCVV Elewijt behaalt belangrijke overwinning</h2>
  <p>
    KCVV Elewijt heeft afgelopen weekend een belangrijke overwinning behaald in de
    <a href="/competitie">competitie</a>. Het team speelde uitstekend en domineerde de wedstrijd
    van begin tot eind.
  </p>
  <p>
    De coach was zeer tevreden met de prestatie: "Dit is precies wat we nodig hadden.
    Het team heeft fantastisch gespeeld en verdiende deze overwinning volledig."
  </p>
  <h3>Belangrijkste momenten</h3>
  <ul>
    <li>Opening goal in de 15e minuut</li>
    <li>Dominante middenveldprestatie</li>
    <li>Sterke defensieve organisatie</li>
    <li>Beslissende goal in de slotfase</li>
  </ul>
  <blockquote>
    "Dit team toont week na week verbetering. We zijn op de goede weg." - Hoofdcoach
  </blockquote>
  <p>
    Voor meer informatie, bezoek de <a href="https://kcvvelewijt.be" target="_blank">officiële website</a>.
  </p>
`

/**
 * Default article body
 * Shows typical article content with headings, paragraphs, lists, and links
 */
export const Default: Story = {
  args: {
    content: sampleContent,
  },
}

/**
 * Simple text
 * Basic paragraphs without complex formatting
 */
export const SimpleText: Story = {
  args: {
    content: `
      <p>
        Dit is een eenvoudig artikel met alleen tekst. Het bevat meerdere paragrafen
        die de basisopmaak tonen.
      </p>
      <p>
        De tweede paragraaf toont hoe tekst op elkaar volgt met de juiste spacing
        en leesbaarheid.
      </p>
      <p>
        En een derde paragraaf om het voorbeeld compleet te maken.
      </p>
    `,
  },
}

/**
 * With internal links
 * Shows the green underline animation on hover
 */
export const WithInternalLinks: Story = {
  args: {
    content: `
      <p>
        Bekijk onze <a href="/team/a-ploeg">A-ploeg</a> voor meer informatie over de spelers.
        Je kunt ook de <a href="/news">nieuwspagina</a> bekijken voor updates, of kijk naar
        de <a href="/events">aankomende evenementen</a>.
      </p>
      <p>
        Alle links hebben een mooie <a href="/test">groene onderstreping</a> die verschijnt
        bij hover. Dit trekt de aandacht en maakt duidelijk wat klikbaar is.
      </p>
    `,
  },
}

/**
 * With external links
 * External links show an icon after the link text
 */
export const WithExternalLinks: Story = {
  args: {
    content: `
      <p>
        Voor meer informatie over de KBVB, bezoek hun
        <a href="https://www.belgianfootball.be" target="_blank">officiële website</a>.
      </p>
      <p>
        Je kunt ook de
        <a href="https://www.facebook.com/KCVVElewijt" target="_blank">Facebook pagina</a>
        of <a href="https://twitter.com/kcvve" target="_blank">Twitter account</a> volgen.
      </p>
      <p>
        Let op het icoontje na externe links - dit geeft aan dat ze in een nieuw tabblad openen.
      </p>
    `,
  },
}

/**
 * With images
 * Shows how images are rendered in the article
 */
export const WithImages: Story = {
  args: {
    content: `
      <h2>Fotoverslag van de wedstrijd</h2>
      <p>Hieronder enkele hoogtepunten in beeld:</p>
      <img src="https://picsum.photos/800/400?random=1" alt="Match action" />
      <p>Het team viert de overwinning na de wedstrijd.</p>
      <img src="https://picsum.photos/800/400?random=2" alt="Team celebration" />
    `,
  },
}

/**
 * Complex formatting
 * Shows various HTML elements together
 */
export const ComplexFormatting: Story = {
  args: {
    content: `
      <h2>Seizoensrapport 2024-2025</h2>
      <p>
        Het huidige seizoen verloopt uitstekend voor KCVV Elewijt. Hieronder een overzicht
        van de prestaties tot nu toe.
      </p>

      <h3>Statistieken</h3>
      <ul>
        <li>Gespeeld: 15 wedstrijden</li>
        <li>Gewonnen: 10</li>
        <li>Gelijkspel: 3</li>
        <li>Verloren: 2</li>
      </ul>

      <h3>Topscorers</h3>
      <ol>
        <li><a href="/player/jan-janssens">Jan Janssens</a> - 12 doelpunten</li>
        <li><a href="/player/piet-pieters">Piet Pieters</a> - 8 doelpunten</li>
        <li><a href="/player/tom-tomassen">Tom Tomassen</a> - 6 doelpunten</li>
      </ol>

      <blockquote>
        "Dit team heeft het potentieel om ver te komen dit seizoen. De progressie
        die we zien is enorm." - Technisch directeur
      </blockquote>

      <h3>Volgende wedstrijden</h3>
      <p>
        Bekijk het volledige <a href="/team/a-ploeg#team-matches">wedstrijdschema</a>
        of koop <a href="https://tickets.kcvvelewijt.be" target="_blank">tickets</a>
        voor de thuiswedstrijden.
      </p>
    `,
  },
}

/**
 * In article layout context
 */
export const InContext: Story = {
  args: {
    content: sampleContent,
  },
  render: (args) => (
    <div className="max-w-[70rem] mx-auto">
      <div className="flex flex-col lg:flex-row-reverse">
        {/* Sidebar placeholder */}
        <div className="lg:w-[20rem] p-3 bg-gray-100 text-xs">
          <p className="mb-2"><strong>Metadata sidebar</strong></p>
          <p>Author, date, tags...</p>
        </div>

        {/* Article body */}
        <div className="flex-1">
          <ArticleBody {...args} />
        </div>
      </div>
    </div>
  ),
}
