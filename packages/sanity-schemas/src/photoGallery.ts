import {defineField, defineType} from 'sanity'

import {
  galleryImagePreviewSelect,
  prepareGalleryImagePreview,
  photoGalleryPreviewSelect,
  preparePhotoGalleryPreview,
} from './preview/photoGallery-preview'

export const photoGallery = defineType({
  name: 'photoGallery',
  title: 'Photo gallery',
  type: 'document',
  // Editor-UX rework groups (#1471, #1502 convention). `inhoud` is the default
  // tab; `fotos` holds the image array + credit; `koppeling` links the gallery
  // to a wedstrijd or evenement so it surfaces on those detail pages.
  groups: [
    {name: 'inhoud', title: 'Inhoud', default: true},
    {name: 'fotos', title: "Foto's"},
    {name: 'koppeling', title: 'Koppelingen'},
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      group: 'inhoud',
      description:
        'De naam van de galerij (bijv. "3-1 tegen Zemst" of "Mosselfeest 2026"). Wordt als titel op de overzichts- en detailpagina getoond.',
      validation: (r) => r.required().error('Verplicht. Zonder titel heeft de galerij geen naam in het overzicht.'),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'inhoud',
      description:
        'URL-pad van de detailpagina (`/galerij/{slug}`). Klik "Generate" om het uit de titel af te leiden; niet meer wijzigen na publicatie.',
      options: {source: 'title', maxLength: 96},
      validation: (r) =>
        r.required().error('Verplicht. De slug bepaalt de URL van de galerij — zonder slug is de detailpagina onbereikbaar.'),
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published at',
      type: 'datetime',
      group: 'inhoud',
      description:
        'Publicatiedatum. Bepaalt de volgorde in het overzicht (nieuwste eerst) en wordt als datum op de galerijkaart getoond.',
      validation: (r) => r.required().error('Verplicht. Zonder publicatiedatum kan de galerij niet correct gesorteerd worden.'),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'array',
      // Simple prose only (STUDIO-3): the detail page renders this via
      // <PortableText>, so formatting (vet, cursief, links) is preserved.
      // Locked to Normal + no lists — a gallery intro needs no headings.
      of: [{type: 'block', styles: [{title: 'Normaal', value: 'normal'}], lists: []}],
      group: 'inhoud',
      description:
        'Optionele inleiding bovenaan de detailpagina (bijv. context bij de reeks foto\'s). Laat leeg voor een galerij zonder tekst.',
    }),
    defineField({
      name: 'defaultCredit',
      title: 'Default credit',
      type: 'string',
      group: 'fotos',
      description:
        'Standaard fotograaf-vermelding voor de hele reeks (bijv. "Foto: Jan Janssens"). Per foto kan je dit overschrijven met een eigen credit.',
    }),
    defineField({
      name: 'images',
      title: 'Images',
      type: 'array',
      group: 'fotos',
      description:
        'De foto\'s in de galerij. De eerste foto is automatisch de cover (gebruikt op de overzichtskaart en als deelafbeelding). Sleep om de volgorde te wijzigen. Maximaal 80 foto\'s per galerij. Splits grote reeksen op in meerdere galerijen.',
      // A flat array of `image` (not objects wrapping an image) so Sanity's
      // native multi-file drop/paste applies — one item per dropped file, in
      // file order. Metadata lives as custom fields on the image itself (#2363).
      of: [
        defineField({
          name: 'galleryImage', // keep the name — item `_type` stays "galleryImage"
          title: 'Image',
          type: 'image',
          options: {hotspot: true},
          // `required()` can't gate the asset here: alt/caption/credit live on
          // this object, so a caption-only item is non-empty yet imageless.
          validation: (r) =>
            r.custom((img: {asset?: unknown} | undefined) =>
              img?.asset ? true : 'Verplicht. Een lege fotoslot wordt niet getoond.',
            ),
          fields: [
            defineField({
              name: 'alt',
              title: 'Alt text',
              type: 'string',
              description:
                'Beschrijf de foto voor toegankelijkheid (schermlezers) en SEO. Niet hetzelfde als het onderschrift. Laat je dit leeg, dan gebruikt de site het onderschrift als alt-tekst.',
              validation: (r) =>
                r.required().warning('Geef een beschrijvende alt-tekst voor toegankelijkheid.'),
            }),
            defineField({
              name: 'caption',
              title: 'Caption',
              type: 'string',
              description: 'Optioneel onderschrift, getoond als overlay in de lightbox.',
            }),
            defineField({
              name: 'credit',
              title: 'Credit',
              type: 'string',
              description:
                'Optionele fotograaf-vermelding voor deze ene foto. Overschrijft de standaard-credit van de galerij.',
            }),
          ],
          preview: {
            select: galleryImagePreviewSelect,
            prepare: prepareGalleryImagePreview,
          },
        }),
      ],
      validation: (r) => [
        r.required().min(1).error('Voeg minstens één foto toe — de eerste foto is de cover van de galerij.'),
        r.max(80).error("Maximaal 80 foto's per galerij. Verwijder foto's of splits de reeks op in meerdere galerijen."),
      ],
    }),
    defineField({
      name: 'linkedMatch',
      title: 'Linked match',
      type: 'string',
      group: 'koppeling',
      description:
        'Optioneel PSD-wedstrijd-id (kopieer het uit de /wedstrijd/[id] URL). Koppelt de galerij aan een wedstrijd: ze verschijnt dan onderaan die wedstrijdpagina.',
    }),
    defineField({
      name: 'linkedEvent',
      title: 'Linked event',
      type: 'reference',
      to: [{type: 'event'}],
      group: 'koppeling',
      description:
        'Optionele koppeling aan een evenement. De galerij verschijnt dan onderaan de detailpagina van dat evenement.',
    }),
  ],
  preview: {
    select: photoGalleryPreviewSelect,
    prepare: preparePhotoGalleryPreview,
  },
})
