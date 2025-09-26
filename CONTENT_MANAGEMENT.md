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
  title: string;           // Short title for the message
  message: string;         // The actual message content
  category?: string;       // Optional category (e.g., "mindfulness", "connection")
  intensity?: 'gentle' | 'moderate' | 'strong';  // Optional intensity level
  tags?: string[];         // Optional tags for filtering
}
```

## How to Add Your Content

### Method 1: Direct Editing (Recommended)

1. Open `src/lib/content.ts`
2. Find the `CONTENT_LIBRARY` object
3. Navigate to the mood-context combination you want to edit
4. Add your messages to the array

Example:
```typescript
good: {
  safe: [
    {
      title: "Your Custom Title",
      message: "Your custom message content here. This is what users will see.",
      category: "mindfulness",
      intensity: "gentle"
    },
    // Add more messages...
  ],
  // ... other contexts
}
```

### Method 2: Using the Content Manager

1. Start your development server: `npm run dev`
2. Navigate to `/content-manager`
3. Select the mood and context combination
4. View existing messages
5. Add new messages using the form
6. Export the JSON structure to copy into your content file

## Content Guidelines

### Writing Effective Messages

1. **Be Empathetic**: Acknowledge the user's current state
2. **Be Actionable**: Provide clear, achievable suggestions
3. **Be Supportive**: Use encouraging, non-judgmental language
4. **Be Concise**: Keep messages focused and easy to read
5. **Be Varied**: Provide different types of content for each combination

### Message Categories

Consider these categories for organizing your content:
- `mindfulness` - Meditation, breathing, awareness
- `connection` - Social interaction, reaching out
- `self-care` - Personal wellness, comfort
- `productivity` - Focus, goal-setting, achievement
- `creativity` - Art, writing, expression
- `gratitude` - Appreciation, thankfulness
- `crisis-support` - Emergency support, professional help

### Intensity Levels

- `gentle` - Soft, calming, low-pressure
- `moderate` - Balanced, encouraging, medium engagement
- `strong` - Direct, motivating, high engagement

## Technical Details

### Hooks Available

- `useContent(options)` - Get filtered and shuffled messages
- `useRandomMessage(mood, context)` - Get a single random message
- `useRandomMessages(mood, context, count)` - Get multiple random messages
- `useAllMessages(mood, context)` - Get all messages for a combination

### Utility Functions

- `getRandomMessage(mood, context)` - Get random message
- `getAllMessages(mood, context)` - Get all messages
- `getRandomMessages(mood, context, count)` - Get multiple random messages
- `getMessagesByCategory(mood, context, category)` - Filter by category
- `getMessagesByIntensity(mood, context, intensity)` - Filter by intensity
- `validateContentLibrary()` - Validate content structure

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
      title: "Morning Gratitude",
      message: "Start your day by thinking of three things you're grateful for. This simple practice can set a positive tone for your entire day.",
      category: "gratitude",
      intensity: "gentle"
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







