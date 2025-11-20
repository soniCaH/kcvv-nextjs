/**
 * Article Page Stories
 * Complete article page combining all article components
 */

import type { Meta, StoryObj } from '@storybook/nextjs'
import {
  ArticleHeader,
  ArticleMetadata,
  ArticleBody,
  ArticleFooter,
} from './index'

const meta = {
  title: 'Domain/Article/Complete Article Page',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Complete article page combining ArticleHeader, ArticleMetadata, ArticleBody, and ArticleFooter components. This demonstrates the full article layout as it appears on the website.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta

export default meta
type Story = StoryObj<typeof meta>

const sampleArticleContent = `
  <p>KCVV Elewijt heeft afgelopen weekend een indrukwekkende overwinning behaald tegen hun rivalen met een score van 3-1. Het team toonde uitstekende teamwork en determinatie gedurende de hele wedstrijd.</p>

  <p>
    <img src="https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&h=600&fit=crop" alt="Team celebrating the opening goal" />
  </p>

  <h2>Eerste Helft Dominantie</h2>
  <p>Vanaf het eerste fluitsignaal nam KCVV Elewijt de controle over de wedstrijd. Met een sterk middenveld en uitstekende passing creëerden ze kans na kans. In de 23e minuut opende <a href="/player/jan-janssens">Jan Janssens</a> de score met een prachtig schot van buiten de zestien.</p>

  <blockquote>
    <p>Dit was een van onze beste prestaties van het seizoen. Het team heeft hard gewerkt en het resultaat laat dat zien.</p>
  </blockquote>

  <p>
    <img src="https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800&h=600&fit=crop" alt="Match action shot" />
  </p>

  <h2>Tweede Helft Spanning</h2>
  <p>De tweede helft begon met meer druk van de tegenstander, maar onze verdediging bleef sterk. <a href="/player/piet-pieters">Piet Pieters</a> verdubbelde de voorsprong in de 67e minuut met een kopbal na een perfecte hoekschop.</p>

  <p>Ondanks dat de tegenstander terugkwam tot 2-1, wist <a href="/player/jan-janssens">Jan Janssens</a> de wedstrijd in de 89e minuut definitief te beslissen met zijn tweede doelpunt van de dag.</p>

  <h3>Statistieken</h3>
  <ul>
    <li>Balbezit: 62%</li>
    <li>Schoten op doel: 8</li>
    <li>Hoekschoppen: 7</li>
    <li>Overtredingen: 12</li>
  </ul>

  <p>Meer informatie over <a href="/team/a-ploeg">onze A-Ploeg</a> en de komende wedstrijden vind je op <a href="https://kcvvelewijt.be/calendar" target="_blank">onze kalender</a>.</p>

  <p><em><strong>💡 Tip:</strong> Hover over de afbeeldingen om ze te vergroten!</em></p>
`

/**
 * Default article page with all components
 */
export const Default: Story = {
  render: () => (
    <div className="min-h-screen bg-white">
      <ArticleHeader
        title="KCVV Elewijt wint met 3-1 in spannende derby"
        imageUrl="https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?w=1120&h=560&fit=crop"
        imageAlt="Voetbalwedstrijd KCVV Elewijt"
      />

      <main className="w-full max-w-[70rem] mx-auto px-0 lg:flex lg:flex-row-reverse">
        {/* Metadata - First in HTML, displays on RIGHT on desktop */}
        <aside className="lg:flex lg:flex-col lg:max-w-[20rem] lg:self-start">
          <ArticleMetadata
            author="Tom Redactie"
            date="15 januari 2025"
            tags={[
              { name: 'A-Ploeg', href: '/news?category=a-ploeg' },
              { name: 'Wedstrijdverslag', href: '/news?category=wedstrijdverslag' },
              { name: 'Derby', href: '/news?category=derby' },
            ]}
            shareConfig={{
              url: 'https://kcvvelewijt.be/news/overwinning-derby',
              title: 'KCVV Elewijt wint met 3-1 in spannende derby',
            }}
          />
        </aside>

        {/* Body - Second in HTML, displays on LEFT on desktop */}
        <div className="flex-1">
          <ArticleBody content={sampleArticleContent} />
        </div>
      </main>

      <ArticleFooter
        relatedContent={[
          {
            title: 'Volgende wedstrijd: KCVV Elewijt vs SK Wolvertem',
            href: '/news/volgende-wedstrijd',
            type: 'article',
          },
          {
            title: 'Jan Janssens - Speler van de Maand',
            href: '/player/jan-janssens',
            type: 'player',
          },
          {
            title: 'A-Ploeg Teaminfo',
            href: '/team/a-ploeg',
            type: 'team',
          },
        ]}
      />

      {/* Next section to show footer overlap */}
      <div className="bg-gray-100 pt-8 pb-16">
        <div className="max-w-[70rem] mx-auto px-6">
          <h2 className="text-2xl font-bold mb-4">Andere Artikelen</h2>
          <p className="text-gray-600">
            Hier komen andere artikelen of widgets...
          </p>
        </div>
      </div>
    </div>
  ),
}

/**
 * Article without image - uses simple header
 */
export const WithoutImage: Story = {
  render: () => (
    <div className="min-h-screen bg-white">
      <header className="bg-kcvv-green-bright px-3 pt-4 pb-4 xl:px-0">
        <div className="w-full max-w-[70rem] mx-auto">
          <h1 className="text-white text-[2.5rem] leading-[0.92] font-bold">
            Trainingsschema aangepast voor winterstop
          </h1>
        </div>
      </header>

      <main className="w-full max-w-[70rem] mx-auto px-0 lg:flex lg:flex-row-reverse">
        <aside className="lg:flex lg:flex-col lg:max-w-[20rem]">
          <ArticleMetadata
            author="Club Secretariaat"
            date="20 december 2024"
            tags={[
              { name: 'Training', href: '/news?category=training' },
              { name: 'Algemeen', href: '/news?category=algemeen' },
            ]}
            shareConfig={{
              url: 'https://kcvvelewijt.be/news/trainingsschema',
              title: 'Trainingsschema aangepast voor winterstop',
            }}
          />
        </aside>

        <div className="flex-1">
          <ArticleBody
            content={`
              <p>Wegens de winterstop wordt het trainingsschema aangepast. Alle teams trainen vanaf nu op dinsdag- en donderdagavond.</p>
              <p>Meer informatie over de <a href="/team/a-ploeg">trainingstijden per ploeg</a>.</p>
            `}
          />
        </div>
      </main>

      <ArticleFooter
        relatedContent={[
          {
            title: 'Winterstop: Wat je moet weten',
            href: '/news/winterstop-info',
            type: 'article',
          },
          {
            title: 'Hoofdtrainer John Doe',
            href: '/staff/john-doe',
            type: 'staff',
          },
        ]}
      />
    </div>
  ),
}

/**
 * Long article with multiple sections
 */
export const LongArticle: Story = {
  render: () => (
    <div className="min-h-screen bg-white">
      <ArticleHeader
        title="Seizoensoverzicht 2024-2025: Een analyse van onze prestaties"
        imageUrl="https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=1120&h=560&fit=crop"
        imageAlt="KCVV Elewijt seizoen analyse"
      />

      <main className="w-full max-w-[70rem] mx-auto px-0 lg:flex lg:flex-row-reverse">
        <aside className="lg:flex lg:flex-col lg:max-w-[20rem]">
          <ArticleMetadata
            author="Marc Analyse"
            date="18 december 2024"
            tags={[
              { name: 'A-Ploeg', href: '/news?category=a-ploeg' },
              { name: 'Analyse', href: '/news?category=analyse' },
              { name: 'Seizoen 2024-2025', href: '/news?category=seizoen-2024-2025' },
            ]}
            shareConfig={{
              url: 'https://kcvvelewijt.be/news/seizoensoverzicht',
              title: 'Seizoensoverzicht 2024-2025: Een analyse van onze prestaties',
            }}
          />
        </aside>

        <div className="flex-1">
          <ArticleBody
            content={`
              <p>Het seizoen 2024-2025 is tot nu toe een memorabel seizoen geweest voor KCVV Elewijt. Met een mix van jonge talenten en ervaren spelers heeft het team uitstekende resultaten behaald.</p>

              <h2>Augustus - September: Sterke Start</h2>
              <p>De competitie begon veelbelovend met vier opeenvolgende overwinningen. De ploeg toonde direct aan klaar te zijn voor een succesvol seizoen.</p>

              <blockquote>
                <p>We zijn trots op wat het team tot nu toe heeft gepresteerd. De chemie tussen de spelers is uitstekend.</p>
              </blockquote>

              <h2>Oktober - November: Uitdagingen</h2>
              <p>Deze maanden brachten enkele uitdagingen met zich mee. Blessures bij belangrijke spelers dwongen de coach om tactische aanpassingen te maken.</p>

              <h3>Belangrijke Statistieken</h3>
              <ul>
                <li>20 wedstrijden gespeeld</li>
                <li>13 overwinningen</li>
                <li>4 gelijke spelen</li>
                <li>3 nederlagen</li>
                <li>42 doelpunten voor</li>
                <li>18 doelpunten tegen</li>
              </ul>

              <h2>December: Herstel en Groei</h2>
              <p>Met de terugkeer van belangrijke spelers herpakte het team zich en behaalde opnieuw uitstekende resultaten. De winterstop komt op een goed moment om te herstellen en voorbereidingen te treffen voor de tweede helft van het seizoen.</p>

              <p>Lees meer over onze <a href="/team/a-ploeg">A-Ploeg spelers</a> en bekijk het volledige <a href="https://kcvvelewijt.be/ranking" target="_blank">klassement</a>.</p>
            `}
          />
        </div>
      </main>

      <ArticleFooter
        relatedContent={[
          {
            title: 'Topscorer Jan Janssens: 18 doelpunten',
            href: '/player/jan-janssens',
            type: 'player',
          },
          {
            title: 'Trainer reflecteert op eerste seizoenshelft',
            href: '/news/trainer-reflectie',
            type: 'article',
          },
          {
            title: 'A-Ploeg Selectie 2024-2025',
            href: '/team/a-ploeg',
            type: 'team',
          },
          {
            title: 'Jeugdwerking ook succesvol',
            href: '/news/jeugd-succes',
            type: 'article',
          },
        ]}
      />
    </div>
  ),
}

/**
 * Mobile viewport preview
 */
export const MobileView: Story = {
  ...Default,
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
}

/**
 * Tablet viewport preview
 */
export const TabletView: Story = {
  ...Default,
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
  },
}
