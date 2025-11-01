# Content Management System

This document explains how to manage the content library for your mood and context combinations.

## Overview

The content system is centralized in `src/lib/content.ts` and provides a structured way to manage all the messages that users see based on their selected mood and context.

## Structure

### Moods
- `good` - User is feeling positive
- `okay` - User is feeling neutral
- `bad` - User is feeling negative
- `awful` - User is feeling very negative

### Contexts
- `safe` - User is in a safe, stationary place
- `moving` - User is on the move but safe
- `focussed` - User is on the move and focused

### Content Structure

Each message has the following structure:

```typescript
interface ContentMessage {
  actionType: 'VISUALIZE' | 'ACTION' | 'REPEAT';  // Required: Primary classification of activity type
  message: string;         // The actual message content
  displayTime: number;     // How long to show the message (seconds)
  audioIndex: number;     // Required: Index of the pre-recorded audio file (1-indexed, matches array position)
}
```

#### Understanding audioIndex

**`audioIndex`** (Required):
- **Purpose**: Specifies which pre-recorded audio file to play for this message
- **How It Works**: The system uses this index to locate audio files in the `public/Audio` folder
- **File Naming Pattern**: Audio files are named using the format:
  ```
  Mood_{Mood}_Context_{Context}_Audio_{audioIndex}.mp3
  ```
  
- **Examples**:
  - `audioIndex: 1` → Looks for `/Audio/Mood_Good_Context_Still_Audio_1.mp3`
  - `audioIndex: 5` → Looks for `/Audio/Mood_Good_Context_Move_Audio_5.mp3`
  - `audioIndex: 12` → Looks for `/Audio/Mood_Bad_Context_Focussed_Audio_12.mp3`

- **Context Mapping**: 
  - `safe` → `Still` in filename
  - `moving` → `Move` in filename  
  - `focussed` → `Focussed` in filename

- **How It's Used**:
  1. When a message is displayed and audio is enabled, the system uses the message's `audioIndex` to construct the audio filename
  2. It constructs the audio filename based on mood, context, and the `audioIndex` value
  3. If the pre-recorded audio file exists, it plays that file
  4. If the audio file is not found, the system falls back to Text-to-Speech (TTS)

- **Note**: `audioIndex` is **1-indexed** (starts at 1, not 0) and **must match the message's position in the array** (position 0 = audioIndex 1, position 1 = audioIndex 2, etc.). This ensures each message corresponds to the correct audio file for its mood+context combination.

## How to Add Your Content

### Direct Editing

1. Open `src/lib/content.ts`
2. Find the `CONTENT_LIBRARY` object
3. Navigate to the mood-context combination you want to edit
4. Add your messages to the array

Example:
```typescript
good: {
  safe: [
    {
      actionType: "VISUALIZE",
      message: "Close your eyes and imagine a peaceful place. Take 3 deep breaths and feel the calm wash over you.",
      displayTime: 20,
      audioIndex: 1
    },
    // Add more messages...
  ],
  // ... other contexts
}
```

## Technical Details

### Hooks Available

React hooks that automatically re-compute when mood/context changes. These are used in your React components to access content.

#### `useContent(options)`
**Location**: `src/hooks/useContent.ts`

**What it does**: 
- Returns filtered, shuffled messages based on mood and context
- Optionally limits the number of messages returned
- Includes error handling and loading states

**Parameters**:
- `mood`: Mood value (`'good' | 'okay' | 'bad' | 'awful'`)
- `context`: Context value (`'safe' | 'moving' | 'focussed'`)
- `count?`: Optional number of messages to return (default: 3)
- `shuffle?`: Optional boolean to shuffle messages (default: true)

**Returns**:
```typescript
{
  messages: ContentMessage[],      // Limited/shuffled messages
  randomMessage: ContentMessage | null,  // Single random message
  allMessages: ContentMessage[],   // All messages for the combination
  isLoading: boolean,              // Always false (synchronous)
  error: string | null              // Error message if any
}
```

**Example Usage** (from `src/app/cards/page.tsx`):
```typescript
const { messages: cardMessages, isLoading, error } = useContent({
  mood: currentMood as Mood | null,
  context: currentContext as Context | null,
  count: 3,
  shuffle: true
});
```

**How it works**: Uses React's `useMemo` to cache results. When mood/context changes, it:
1. Gets all messages for the mood+context combination
2. Optionally shuffles them randomly
3. Limits to the requested count
4. Also provides a single random message and all messages

---

#### `useRandomMessage(mood, context)`
**Location**: `src/hooks/useContent.ts`

**What it does**: Returns a single random message for the given mood+context combination.

**Parameters**:
- `mood`: Mood value (can be `null`)
- `context`: Context value (can be `null`)

**Returns**: `ContentMessage | null` (returns `null` if mood/context is invalid)

**Example Usage** (from `src/app/option3/page.tsx` and `src/app/option4/page.tsx`):
```typescript
const randomMessage = useRandomMessage(
  currentMood as Mood | null, 
  currentContext as Context | null
);
```

**How it works**: Calls `getRandomMessage()` internally, wrapped in `useMemo` for performance. Picks one message randomly from the array for that mood+context.

---

#### `useRandomMessages(mood, context, count)`
**Location**: `src/hooks/useContent.ts`

**What it does**: Returns multiple random messages (shuffled) for a mood+context combination.

**Parameters**:
- `mood`: Mood value (can be `null`)
- `context`: Context value (can be `null`)
- `count`: Number of messages to return (default: 3)

**Returns**: `ContentMessage[]` (empty array if mood/context is invalid)

**How it works**: Internally calls `getRandomMessages()`, which shuffles all messages and returns the requested count.

---

#### `useAllMessages(mood, context)`
**Location**: `src/hooks/useContent.ts`

**What it does**: Returns ALL messages for a mood+context combination, in their original order (no shuffling).

**Parameters**:
- `mood`: Mood value (can be `null`)
- `context`: Context value (can be `null`)

**Returns**: `ContentMessage[]` (empty array if mood/context is invalid)

**Example Usage** (from `src/app/content-manager/page.tsx`):
```typescript
const allMessages = useAllMessages(selectedMood, selectedContext);
```

**How it works**: Directly returns the array from `CONTENT_LIBRARY[mood][context]` without any modification.

---

### Utility Functions

Standalone functions (not React hooks) that can be used anywhere in your codebase.

#### `getRandomMessage(mood, context)`
**Location**: `src/lib/content.ts` (line ~991)

**What it does**: Picks one random message from the array for a mood+context combination.

**Returns**: `ContentMessage | null`

**How it works**: 
```typescript
const messages = CONTENT_LIBRARY[mood]?.[context];
const randomIndex = Math.floor(Math.random() * messages.length);
return messages[randomIndex];
```

**Used by**: `useRandomMessage` hook, `src/app/page.tsx` (in `getMicroHabit` function)

---

#### `getAllMessages(mood, context)`
**Location**: `src/lib/content.ts` (line ~1153)

**What it does**: Returns the entire array of messages for a mood+context combination, in original order.

**Returns**: `ContentMessage[]` (empty array if combination doesn't exist)

**How it works**: 
```typescript
return CONTENT_LIBRARY[mood]?.[context] || [];
```

**Used by**: All hooks internally, `src/app/page.tsx` (to find message position)

---

#### `getRandomMessages(mood, context, count)`
**Location**: `src/lib/content.ts` (line ~1157)

**What it does**: Returns multiple random messages (shuffled) for a mood+context combination.

**Parameters**:
- `mood`: Mood value
- `context`: Context value  
- `count`: Number of messages to return (default: 3)

**Returns**: `ContentMessage[]`

**How it works**: 
1. Gets all messages for the combination
2. Shuffles them using `sort(() => Math.random() - 0.5)`
3. Returns the first `count` messages

**Used by**: `useRandomMessages` hook

---

#### `validateContentLibrary()`
**Location**: `src/lib/content.ts` (line ~1167)

**What it does**: Validates that your `CONTENT_LIBRARY` is correctly structured and has no errors.

**Returns**: 
```typescript
{
  isValid: boolean,
  errors: string[]
}
```

**Checks**:
- All moods have content defined
- All contexts have content for each mood
- No empty arrays
- Each message has required fields: `actionType`, `message`, `displayTime`

**Example Usage**:
```typescript
import { validateContentLibrary } from '@/lib/content';

const { isValid, errors } = validateContentLibrary();
if (!isValid) {
  console.error('Content validation errors:', errors);
}
```

**How it works**: Iterates through all mood+context combinations in `CONTENT_LIBRARY` and checks for:
- Missing mood definitions
- Missing context definitions  
- Empty message arrays
- Messages missing required properties

## Adding New Moods or Contexts

1. Add the new mood/context to the `MOODS` or `CONTEXTS` arrays
2. Add the new combination to the `CONTENT_LIBRARY` object
3. Update the type definitions if needed
4. Test the new combinations

## Best Practices

1. **Test Regularly**: Check that all mood-context combinations have content
2. **Balance Content**: Ensure each combination has 3-5 messages minimum
3. **Review Content**: Regularly review and update messages for relevance
4. **Backup Content**: Keep backups of your content library
5. **Validate Structure**: Use the validation function to check for errors

## Example Content Addition

```typescript
// In src/lib/content.ts, add to the CONTENT_LIBRARY:

good: {
  safe: [
    // ... existing messages
    {
      actionType: "ACTION",
      message: "Start your day by thinking of three things you're grateful for. This simple practice can set a positive tone for your entire day.",
      displayTime: 15
    }
  ],
  // ... other contexts
}
```

## Troubleshooting

### Common Issues

1. **Missing Content**: Check that all mood-context combinations have at least one message
2. **Type Errors**: Ensure all messages have required `title` and `message` fields
3. **Import Errors**: Make sure you're importing the correct types and functions

### Validation

Use the built-in validation function to check your content:

```typescript
import { validateContentLibrary } from '@/lib/content';

const { isValid, errors } = validateContentLibrary();
if (!isValid) {
  console.error('Content validation errors:', errors);
}
```

This system makes it easy to manage your content library and ensures consistency across all your app's pages.







