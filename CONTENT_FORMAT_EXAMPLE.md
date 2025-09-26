# Content Format Example

Here's how to format your content with the new structure:

## New Content Structure

```typescript
{
  actionType: "VISUALIZE" | "ACTION" | "RECITE",
  message: "Your message content in quotes",
  displayTime: 15, // Time in seconds to display the message
  category: "mindfulness", // Optional
  intensity: "gentle", // Optional: gentle, moderate, strong
  tags: ["breathing", "calm"] // Optional
}
```

## Example Content for "Good + Safe"

```typescript
good: {
  safe: [
    {
      actionType: "VISUALIZE",
      message: "Close your eyes and imagine a peaceful place. Take 3 deep breaths and feel the calm wash over you.",
      displayTime: 20,
      category: "mindfulness",
      intensity: "gentle"
    },
    {
      actionType: "ACTION", 
      message: "Write down 3 things you're grateful for today. Keep this list somewhere you can see it.",
      displayTime: 15,
      category: "gratitude",
      intensity: "moderate"
    },
    {
      actionType: "RECITE",
      message: "Repeat this affirmation: 'I am worthy of love and happiness. I choose to focus on the positive.'",
      displayTime: 12,
      category: "self-affirmation",
      intensity: "gentle"
    }
  ],
  // ... other contexts
}
```

## Action Types Explained

- **VISUALIZE**: Mental exercises, imagination, visualization
- **ACTION**: Physical activities, tasks, things to do
- **RECITE**: Things to say, repeat, affirmations, mantras

## Display Time Guidelines

- **5-10 seconds**: Very short messages, quick affirmations
- **10-15 seconds**: Standard messages, most content
- **15-20 seconds**: Longer instructions, detailed guidance
- **20+ seconds**: Complex exercises, detailed visualizations

## How to Add Your Content

1. **Open** `src/lib/content.ts`
2. **Find** the mood-context combination you want to edit
3. **Replace** the existing array with your content
4. **Follow** the format above

## Example: Adding Content for "Bad + Moving"

```typescript
bad: {
  moving: [
    {
      actionType: "ACTION",
      message: "Take 5 deep breaths while walking. Count each step as you inhale and exhale.",
      displayTime: 18,
      category: "breathing",
      intensity: "gentle"
    },
    {
      actionType: "RECITE",
      message: "Repeat to yourself: 'This feeling is temporary. I am safe and I will get through this.'",
      displayTime: 15,
      category: "self-compassion",
      intensity: "moderate"
    },
    {
      actionType: "VISUALIZE",
      message: "Imagine each step you take is leaving behind negative energy. Feel it dissolving with each step.",
      displayTime: 20,
      category: "mindfulness",
      intensity: "gentle"
    }
  ]
}
```

## Content Manager Interface

You can also use the content manager at `/content-manager` to:
- View existing content
- Add new messages with the form
- Export content as JSON
- Test different mood-context combinations

The interface will automatically handle the new format with action types and display times.







