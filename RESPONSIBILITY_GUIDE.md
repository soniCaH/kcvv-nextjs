# Verantwoordelijkheden / Hulp Systeem - Handleiding

## Overzicht

Het "Hulp" systeem helpt bezoekers snel de juiste contactpersoon te vinden door een eenvoudige vraagstelling:
**"Ik ben [ROLE] en ik [VRAAG]"**

- **Dedicated pagina**: `/hulp`
- **Homepage blok**: Compact formaat voor op de homepage
- **Navigatie**: "Hulp" in het hoofdmenu

## Hoe werkt het?

1. Gebruiker selecteert zijn rol (speler, ouder, trainer, etc.)
2. Begin met typen in het vraagtekstveld
3. Smart autocomplete toont relevante vragen
4. Klik op een suggestie → zie het volledige antwoord met:
   - Contactpersoon(en)
   - Stap-voor-stap instructies
   - Links naar meer info
   - Email/telefoon contactgegevens

## 📝 Vragen Toevoegen of Bewerken

### Bestand Locatie

Alle vragen en antwoorden staan in:
```
src/data/responsibility-paths.ts
```

### Structuur van een Vraag

Elke vraag heeft deze velden:

```typescript
{
  id: 'unieke-id',                    // Unieke code voor deze vraag
  role: ['speler', 'ouder'],          // Voor wie is deze vraag?
  question: 'wil inschrijven',        // De vraag (zonder "Ik ben ... en ik")
  keywords: ['inschrijven', 'lid'],   // Zoekwoorden voor matching
  summary: 'Korte samenvatting...',   // 1-zin samenvatting
  category: 'administratief',          // Categorie
  icon: '📝',                         // Emoji icoon
  primaryContact: {                    // Hoofdcontactpersoon
    role: 'Jeugdsecretaris',
    email: 'jeugd@kcvvelewijt.be',
    department: 'jeugdbestuur',
    orgLink: '/club/organogram',
  },
  steps: [                            // Stappen om te volgen
    {
      order: 1,
      description: 'Ga naar de inschrijvingspagina',
      link: '/club/register',         // Optionele link
    },
    {
      order: 2,
      description: 'Vul het formulier in',
      contact: {                       // Optioneel: extra contact voor deze stap
        role: 'Secretaris',
        email: 'info@kcvvelewijt.be',
      },
    },
  ],
}
```

### Velden Uitleg

| Veld | Type | Verplicht | Uitleg |
|------|------|-----------|--------|
| `id` | string | ✅ | Unieke identificatie (gebruik kebab-case) |
| `role` | array | ✅ | Voor wie: `'speler'`, `'ouder'`, `'trainer'`, `'supporter'`, `'niet-lid'`, `'andere'` |
| `question` | string | ✅ | De vraag **zonder** "Ik ben ... en ik" |
| `keywords` | array | ✅ | Zoekwoorden om deze vraag te vinden |
| `summary` | string | ✅ | Korte samenvatting (1-2 zinnen) |
| `category` | string | ✅ | `'medisch'`, `'sportief'`, `'administratief'`, `'gedrag'`, `'algemeen'`, `'commercieel'` |
| `icon` | string | ✅ | Emoji icoon (bijv. 🏥, ⚽, 📝) |
| `primaryContact` | object | ✅ | Hoofdcontactpersoon (zie onder) |
| `steps` | array | ✅ | Stappen om te volgen (zie onder) |

### Primary Contact Structuur

```typescript
primaryContact: {
  role: 'Functie/Rol',           // Verplicht
  name: 'Jan Janssen',           // Optioneel
  email: 'jan@kcvv.be',          // Optioneel maar aanbevolen
  phone: '+32 123 456 789',      // Optioneel
  department: 'hoofdbestuur',     // Optioneel: hoofdbestuur/jeugdbestuur/algemeen
  orgLink: '/club/organogram',    // Optioneel: link naar organogram
}
```

### Steps Structuur

```typescript
steps: [
  {
    order: 1,                            // Verplicht: volgorde
    description: 'Wat moet je doen',    // Verplicht: tekst
    link: '/path/to/page',              // Optioneel: link naar meer info
    contact: {                           // Optioneel: extra contactpersoon
      role: 'Rol',
      email: 'email@kcvv.be',
    },
  },
]
```

## ✏️ Nieuwe Vraag Toevoegen - Stap voor Stap

### 1. Open het bestand
```
src/data/responsibility-paths.ts
```

### 2. Kopieer een bestaande vraag

Zoek een vergelijkbare vraag en kopieer de hele structuur (van `{` tot `},`)

### 3. Pas de gegevens aan

```typescript
{
  id: 'nieuwe-vraag-id',                // ← Geef een unieke ID
  role: ['speler'],                      // ← Voor wie?
  question: 'wil een nieuwe vraag stellen', // ← De vraag
  keywords: ['vraag', 'nieuwe', 'help'], // ← Zoekwoorden
  summary: 'Dit is de korte samenvatting van het antwoord', // ← Samenvatting
  category: 'algemeen',                  // ← Categorie
  icon: '❓',                            // ← Kies een emoji
  primaryContact: {
    role: 'Wie moet ik contacteren',
    email: 'contact@kcvvelewijt.be',
    orgLink: '/club/organogram',
  },
  steps: [
    {
      order: 1,
      description: 'Eerste stap: doe dit',
    },
    {
      order: 2,
      description: 'Tweede stap: doe dat',
      link: '/meer-info',
    },
  ],
},
```

### 4. Plaats de nieuwe vraag

Voeg hem toe aan het `responsibilityPaths` array (let op de komma!)

### 5. Test

Start de dev server:
```bash
npm run dev
```

Ga naar `http://localhost:3000/hulp` en test of je vraag werkt!

## 🎯 Best Practices

### Keywords Kiezen

Denk aan verschillende manieren waarop mensen kunnen zoeken:
- Synoniemen: "inschrijven", "lid worden", "registreren"
- Spelling varianten: "ongeval", "accident"
- Kortere versies: "blessure", "letsel", "geblesseerd"

### Goede Vraagformulering

✅ **GOED**: "wil graag lid worden"
✅ **GOED**: "heb een ongeval gehad"
✅ **GOED**: "zoek de sportief verantwoordelijke"

❌ **SLECHT**: "Hoe kan ik lid worden?" (te lang, bevat al "ik")
❌ **SLECHT**: "Lidmaatschap" (niet als vraag geformuleerd)

### Stappen Schrijven

Maak de stappen concreet en actionable:

✅ **GOED**:
```
1. Ga naar de inschrijvingspagina
2. Vul het formulier in met je gegevens
3. Upload een pasfoto
4. Betaal het lidgeld via bankoverschrijving
```

❌ **SLECHT**:
```
1. Schrijf je in
2. Geef je gegevens door
3. Betaal
```

## 📁 Categor

ieën

| Categorie | Wanneer Gebruiken | Voorbeelden |
|-----------|-------------------|-------------|
| `medisch` | Ongevallen, blessures, verzekering | Ongeval, herstel, attest |
| `sportief` | Wedstrijden, training, teams | Wedstrijdkalender, trainer zoeken |
| `administratief` | Inschrijving, documenten, formulieren | Lid worden, stage inschrijven |
| `gedrag` | Klachten, ongepast gedrag | Gedrag rapporteren |
| `algemeen` | Overige vragen | ProSoccerData, algemene info |
| `commercieel` | Sponsoring, partnerships | Sponsor worden |

## 🔗 Links Toevoegen

Je kan linken naar:

1. **Interne pagina's**: `/club/organogram`, `/events`, `/team/a-ploeg`
2. **Downloads**: `/club/downloads`
3. **Externe links**: `https://www.prosoccerdata.com`
4. **Email**: Wordt automatisch klikbaar: `info@kcvvelewijt.be`

## 💡 Emoji Iconen

Gebruik passende emoji's voor visuele herkenning:

- 🏥 Medisch / Ongevallen
- ⚽ Voetbal / Sport
- 📝 Inschrijving / Formulieren
- 📅 Kalender / Planning
- 👤 Persoon / Contact
- 🤝 Sponsoring / Partnership
- 🎓 Training / Opleiding
- 📱 Apps / Technologie
- 🛡️ Veiligheid / Gedrag
- 💪 Herstel / Fitness

## 🚀 Deployment

Na het toevoegen/bewerken van vragen:

1. Test lokaal: `npm run dev`
2. Check of autocomplete werkt
3. Controleer contactgegevens
4. Test op mobile
5. Commit en push naar Git
6. Deploy wordt automatisch gedaan

## 📊 Analytics & Verbetering

Let op welke vragen vaak gezocht worden:
- Voeg meer keywords toe voor populaire zoekopdrachten
- Voeg nieuwe vragen toe die veel voorkomen
- Update antwoorden als contactpersonen wijzigen

## ❓ Veelgestelde Vragen

**Q: Kan ik HTML gebruiken in de description?**
A: Nee, gebruik plain text. Links worden automatisch klikbaar.

**Q: Hoeveel stappen mag een antwoord hebben?**
A: Maximaal 5-7 stappen voor leesbaarheid.

**Q: Kan ik meerdere contactpersonen toevoegen?**
A: Ja! Gebruik `primaryContact` voor de hoofdpersoon en voeg extra contacten toe per step indien nodig.

**Q: Hoe update ik een bestaande vraag?**
A: Zoek de vraag op basis van `id` of `question`, pas de velden aan en sla op.

**Q: Kan ik een vraag verwijderen?**
A: Ja, verwijder het hele object (van `{` tot `},`) uit het array.

## 🆘 Hulp Nodig?

- Check de bestaande vragen als voorbeeld
- Zie `/src/types/responsibility.ts` voor alle TypeScript types
- Test altijd lokaal voor je commit!
- Bij twijfel: vraag een ontwikkelaar

---

**Laatste update**: November 2025
**Maintainer**: KCVV Elewijt Development Team
