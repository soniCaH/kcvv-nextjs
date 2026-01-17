# Responsibility Q&A Files

This directory contains markdown files that power the "Hulp nodig?" (Need Help?) feature on the KCVV website.

## 📝 Editing Guide

Each markdown file represents a question and its answer path. Non-technical users can edit these files directly on GitHub!

### File Structure

```markdown
---
id: unique-identifier
roles:
  - speler
  - ouder
question: the question users will search for
keywords:
  - search
  - terms
category: medisch
icon: 🏥
primaryContact:
  role: Contact Person Title
  email: email@kcvvelewijt.be
  department: jeugdbestuur
  orgLink: /club/organigram
---

# Summary

Short answer summary goes here.

## Steps

### 1. First step description

**Contact:** Optional contact for this step
**Email:** email@example.com
**Link:** /optional/link

### 2. Second step description

...
```

## 🏷️ Field Descriptions

### Frontmatter (YAML section at the top)

- **id**: Unique identifier (lowercase, use hyphens). Example: `ongeval-speler-training`
- **roles**: Who can ask this question. Choose from:
  - `speler` - Player
  - `ouder` - Parent
  - `trainer` - Coach
  - `supporter` - Supporter
  - `niet-lid` - Non-member
  - `andere` - Other
- **question**: The question text as users will type it (lowercase, no punctuation)
- **keywords**: Search terms that will match this question (be generous!)
- **category**: Type of question. Choose from:
  - `medisch` - Medical/health
  - `sportief` - Sports-related
  - `administratief` - Administrative
  - `gedrag` - Behavior/conduct
  - `algemeen` - General
  - `commercieel` - Commercial/volunteering
- **icon**: Emoji representing the category
- **primaryContact**: Main contact person
  - `role`: Title/role (required)
  - `email`: Email address (optional)
  - `phone`: Phone number (optional)
  - `name`: Person name (optional)
  - `department`: One of: `hoofdbestuur`, `jeugdbestuur`, `algemeen`
  - `orgLink`: Link to organigram (optional)

### Content Sections

- **Summary**: Short answer (1-2 sentences) that appears first
- **Steps**: Ordered list of actions to take
  - Each step is a heading: `### 1. Description`
  - Optional metadata using bold labels:
    - `**Contact:**` - Contact person for this step
    - `**Email:**` - Email for this step
    - `**Phone:**` - Phone number
    - `**Link:**` - Related page link

## ✏️ How to Edit

### On GitHub (Recommended for non-technical users)

1. Navigate to the file you want to edit
2. Click the pencil icon (Edit this file)
3. Make your changes
4. Scroll down and click "Commit changes"
5. Add a description of what you changed
6. Click "Commit changes" again

### Locally (For developers)

1. Edit the markdown file
2. Run `npm run build:responsibility` to regenerate TypeScript
3. Commit both the markdown and generated TypeScript file

## 🎯 Examples

### Simple Question (No Extra Contacts/Links)

```markdown
---
id: herstel-blessure
roles:
  - speler
  - ouder
question: ben hersteld van mijn ongeval/blessure
keywords:
  - hersteld
  - beter
  - genezen
category: medisch
icon: 💪
primaryContact:
  role: Trainer
  department: jeugdbestuur
---

# Summary

Breng je trainer op de hoogte en lever een medisch attest af indien vereist.

## Steps

### 1. Breng je trainer op de hoogte dat je weer kan trainen

### 2. Bezorg een medisch attest indien de blessure langer dan 21 dagen duurde

### 3. Volg de aanwijzingen van je trainer voor geleidelijke herstart
```

### Complex Question (With Step-Specific Contacts and Links)

```markdown
---
id: ongeval-speler-training
roles:
  - speler
  - ouder
question: heb een ongeval op training/wedstrijd
keywords:
  - ongeval
  - blessure
  - letsel
category: medisch
icon: 🏥
primaryContact:
  role: Verzekeringverantwoordelijke
  email: verzekering@kcvvelewijt.be
  department: algemeen
  orgLink: /club/organigram
---

# Summary

Meld het ongeval onmiddellijk bij je trainer en neem contact op met de verzekeringverantwoordelijke.

## Steps

### 1. Meld het ongeval onmiddellijk bij je trainer of ploegverantwoordelijke

### 2. Raadpleeg indien nodig een arts of ga naar de spoeddienst

### 3. Contacteer de verzekeringverantwoordelijke binnen 48 uur

**Contact:** Verzekeringverantwoordelijke
**Email:** verzekering@kcvvelewijt.be

### 4. Vul het ongevalformulier in (beschikbaar via de club)

**Link:** /club/downloads
```

## 🚨 Common Mistakes to Avoid

1. **YAML Syntax**: Make sure indentation is consistent (2 spaces per level)
2. **Step Numbers**: Must be sequential (1, 2, 3, not 1, 3, 5)
3. **Category Names**: Use exact values listed above (lowercase, no spaces)
4. **Role Names**: Use exact values from the list (lowercase)
5. **Missing Fields**: `id`, `roles`, `question`, `keywords`, `category`, and `primaryContact.role` are required

## 🔍 Testing Your Changes

After editing a file, the build system will:

1. Parse your markdown
2. Validate the structure
3. Generate TypeScript code
4. Show errors if something is wrong

If you see an error, check:

- YAML indentation (use spaces, not tabs)
- Required fields are present
- Category and role names match the allowed values
- Step numbers are sequential

## 📚 More Help

- See existing files for examples
- Ask a developer if you're stuck
- Check the [implementation plan](../../PLAN-markdown-qa.md) for technical details
