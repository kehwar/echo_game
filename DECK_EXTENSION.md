# Deck Extension Feature

This document describes the deck extension feature that allows decks to inherit cards from other decks.

## Overview

The `extends` property in deck frontmatter allows a deck to inherit cards from one or more existing decks. This is useful for:

- Creating locale-specific variants that share the same cards
- Building combined decks from multiple source decks
- Creating custom decks based on existing ones

Additionally, the `hidden` property allows you to hide decks from the UI while keeping them parsed and available for extension.

## Frontmatter Properties

### `extends`

Inherit cards from one or more decks.

### `hidden`

Hide the deck from the UI. The deck is still loaded and can be extended by other decks.

```yaml
---
name: Test Deck
hidden: true
---
```

## Usage

### Single Deck Extension

To extend a single deck, add the `extends` property in your deck's frontmatter:

```yaml
---
name: Pokémon
description: Spanish version of the Pokémon deck
locale: es-ES
extends: en-US/pokemon
---

# Optional: Add additional cards specific to this deck
ADDITIONAL_CARD_1
ADDITIONAL_CARD_2
```

### Multiple Deck Extension

To extend multiple decks, use YAML array syntax:

```yaml
---
name: Mixed Deck
description: Combines cards from Pokemon and Animals
locale: en-US
extends:
  - en-US/pokemon
  - en-US/animals
---

# Optional: Add your own unique cards
CUSTOM_CARD_1
CUSTOM_CARD_2
```

### Hidden Test Decks

Test decks can be hidden from the UI while still being available for extension:

```yaml
---
name: Test Deck
description: A test deck for development
locale: en-US
hidden: true
extends: en-US/pokemon
---

TEST_CARD_1
TEST_CARD_2
```

### Nested Extension

Decks can extend other decks that themselves extend decks (nested inheritance):

```yaml
---
name: Super Deck
description: Extends a deck that extends another deck
locale: en-US
extends: es-ES/pokemon
---
# This deck will include cards from:
# 1. en-US/pokemon (extended by es-ES/pokemon)
# 2. es-ES/pokemon (directly extended)
# 3. Any additional cards listed here
```

## How It Works

1. **Card Merging**: When a deck extends another deck, all cards from the extended deck(s) are merged with the extending deck's own cards.

2. **Order of Merging**: Cards are merged in this order:
   - Cards from extended decks (in the order specified)
   - Cards from nested extensions (recursively)
   - Cards from the current deck

3. **Duplicate Removal**: Duplicate cards are automatically removed, keeping only unique cards.

4. **Circular Dependency Detection**: The system detects and warns about circular dependencies (e.g., deck A extends deck B which extends deck A).

## Deck ID Formats

The `extends` property supports two formats for referencing decks:

- **Slash format** (recommended): `en-US/pokemon`
- **Dash format**: `en-US-pokemon`

Both formats reference the same deck. Use the slash format for better readability.

## Examples

### Example 1: Locale Variant

The Spanish Pokémon deck extends the English version:

**en-US/pokemon.md:**
```yaml
---
name: Pokémon
description: Act out iconic 1st generation Pokémon
locale: en-US
---

PIKACHU
CHARIZARD
MEWTWO
```

**es-ES/pokemon.md:**
```yaml
---
name: Pokémon
description: ¡Actúa como los Pokémon icónicos!
locale: es-ES
extends: en-US/pokemon
---
# No additional cards needed - inherits all from en-US version
```

### Example 2: Combined Deck

**en-US/test-mixed.md:**
```yaml
---
name: Mixed Test
description: A test deck that extends from multiple decks
locale: en-US
extends:
  - en-US/pokemon
  - en-US/animals
---

COMBINED_CARD_1
COMBINED_CARD_2
TEST_UNIQUE
```

This deck will have:
- All cards from `en-US/pokemon`
- All cards from `en-US/animals`
- The three additional cards listed

### Example 3: Nested Extension

**en-US/test-nested.md:**
```yaml
---
name: Nested Test
description: Extends a deck that extends another
locale: en-US
extends: es-ES/pokemon
---

NESTED_CARD_1
NESTED_CARD_2
```

This deck will have:
- All cards from `en-US/pokemon` (via `es-ES/pokemon`)
- The two additional cards listed

## Technical Details

### Frontmatter Parsing

The deck loader uses the [gray-matter](https://github.com/jonschlinkert/gray-matter) library to parse YAML frontmatter, which provides:
- Robust YAML parsing
- Support for complex data types (arrays, objects, booleans)
- Proper handling of edge cases

### Implementation

The deck loading system works in two passes:

1. **First Pass**: Load all deck files and parse their frontmatter using gray-matter
2. **Second Pass**: Resolve `extends` relationships and merge cards

### Circular Dependency Handling

If a circular dependency is detected (e.g., A → B → A), the system:
- Logs a warning to the console
- Stops following that particular chain
- Continues processing other valid extensions

### Performance

- All deck loading happens at build time using Vite's `import.meta.glob`
- No runtime overhead for resolving extensions
- Cards are deduplicated efficiently using Set data structures

### Hidden Decks

Decks with `hidden: true` are:
- Fully loaded and parsed at build time
- Available for extension by other decks
- Filtered out in the UI layer (pages/index.vue)
- Still accessible via direct URL if needed

## Best Practices

1. **Use descriptive deck names**: Make it clear what the deck extends
2. **Document custom cards**: Add comments explaining any additional cards
3. **Avoid deep nesting**: Keep extension chains shallow for maintainability
4. **Test your decks**: Verify that cards are merged as expected
5. **Use consistent locale prefixes**: Follow the `locale/name` convention

## Troubleshooting

### Deck Not Found Warning

If you see "Deck not found" in the console, check that:
- The extended deck file exists
- The deck ID format is correct
- The file path matches the ID (e.g., `en-US/pokemon` → `/assets/decks/en-US/pokemon.md`)

### Circular Dependency Warning

If you see "Circular dependency detected", review your extension chain:
- Check which decks extend each other
- Break the circular reference by removing one extends property
- Consider restructuring your deck hierarchy

### Missing Cards

If expected cards are missing:
- Verify the extended deck contains those cards
- Check for typos in the `extends` property
- Ensure the extended deck file is saved with the correct content

## Migration Guide

To convert existing duplicate decks to use `extends`:

1. Identify decks with duplicate cards
2. Choose one deck as the "base" deck
3. Add `extends: base-deck-id` to the variant decks
4. Remove duplicate cards from the variant decks (optional - they'll be deduplicated automatically)
5. Test that the game still works with the modified decks

## Future Enhancements

Potential future improvements:
- Support for excluding specific cards from extended decks
- Ability to override card properties
- Deck composition validation tools
- Visual deck inheritance diagram
