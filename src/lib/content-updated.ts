// Content management system for mood-context combinations
// This file contains all the content that will be displayed to users

export interface ContentMessage {
  actionType: 'VISUALIZE' | 'ACTION' | 'RECITE';
  message: string;
  displayTime: number; // Time in seconds to display the message
  // Optional additional properties for future enhancements
  category?: string;
  intensity?: 'gentle' | 'moderate' | 'strong';
  tags?: string[];
  audioIndex?: number;
}

export interface MoodContextContent {
  [context: string]: ContentMessage[];
}

export interface ContentLibrary {
  [mood: string]: MoodContextContent;
}

// Define the available moods and contexts
export const MOODS = ['good', 'okay', 'bad', 'awful'] as const;
export const CONTEXTS = ['safe', 'moving', 'focussed'] as const;

export type Mood = typeof MOODS[number];
export type Context = typeof CONTEXTS[number];

// Main content library - imported from Google Sheets
export const CONTENT_LIBRARY: ContentLibrary = {
  good: {
    safe: [
      {
        actionType: "VISUALIZE",
        message: "Do a mindful body scan",
        displayTime: 120,
        category: "mindfulness",
        intensity: "moderate",
        audioIndex: 1
      },
      {
        actionType: "ACTION",
        message: "Write down three things you're grateful for",
        displayTime: 180,
        category: "gratitude",
        intensity: "moderate",
        audioIndex: 2
      },
      {
        actionType: "RECITE",
        message: "Recite a positive affirmation aloud",
        displayTime: 60,
        category: "affirmation",
        intensity: "moderate"
      },
      {
        actionType: "VISUALIZE",
        message: "Visualise your ideal day",
        displayTime: 120,
        category: "visualization",
        intensity: "moderate"
      },
      {
        actionType: "RECITE",
        message: "Repeat the phrase: 'Today, I am at peace'",
        displayTime: 60,
        category: "affirmation",
        intensity: "gentle"
      },
      {
        actionType: "ACTION",
        message: "Stretch your arms slowly and smile",
        displayTime: 120,
        category: "movement",
        intensity: "moderate"
      },
      {
        actionType: "ACTION",
        message: "Sit with eyes closed and breathe deeply",
        displayTime: 180,
        category: "breathing",
        intensity: "strong"
      },
      {
        actionType: "RECITE",
        message: "Repeat: 'I choose calm over chaos'",
        displayTime: 60,
        category: "affirmation",
        intensity: "gentle"
      },
      {
        actionType: "ACTION",
        message: "Draw a doodle of how you feel",
        displayTime: 240,
        category: "mindfulness",
        intensity: "moderate"
      },
      {
        actionType: "VISUALIZE",
        message: "Imagine yourself floating on calm water",
        displayTime: 120,
        category: "visualization",
        intensity: "gentle"
      },
      {
        actionType: "RECITE",
        message: "Repeat: 'Joy flows through me'",
        displayTime: 60,
        category: "affirmation",
        intensity: "moderate"
      },
      {
        actionType: "ACTION",
        message: "Light a candle and focus on the flame",
        displayTime: 180,
        category: "focus",
        intensity: "moderate"
      },
      {
        actionType: "VISUALIZE",
        message: "Visualise a place you love",
        displayTime: 120,
        category: "visualization",
        intensity: "moderate"
      },
      {
        actionType: "RECITE",
        message: "Recite: 'I am rooted and grounded'",
        displayTime: 60,
        category: "affirmation",
        intensity: "moderate"
      },
      {
        actionType: "ACTION",
        message: "Do a 4-7-8 breathing pattern",
        displayTime: 120,
        category: "breathing",
        intensity: "moderate"
      }
    ],
    moving: [
      {
        actionType: "ACTION",
        message: "Walk while noticing five things around you",
        displayTime: 180,
        category: "movement",
        intensity: "moderate"
      },
      {
        actionType: "RECITE",
        message: "Repeat: 'Every step energises me'",
        displayTime: 60,
        category: "affirmation",
        intensity: "moderate"
      },
      {
        actionType: "VISUALIZE",
        message: "Visualise your feet touching light with each step",
        displayTime: 120,
        category: "visualization",
        intensity: "moderate"
      },
      {
        actionType: "ACTION",
        message: "Stretch one arm at a time while walking",
        displayTime: 120,
        category: "movement",
        intensity: "moderate"
      },
      {
        actionType: "RECITE",
        message: "Repeat your favourite quote as you walk",
        displayTime: 60,
        category: "affirmation",
        intensity: "moderate"
      },
      {
        actionType: "ACTION",
        message: "Swing arms loosely and smile",
        displayTime: 120,
        category: "mindfulness",
        intensity: "moderate"
      },
      {
        actionType: "ACTION",
        message: "Breathe in rhythm with your footsteps",
        displayTime: 120,
        category: "breathing",
        intensity: "moderate"
      },
      {
        actionType: "VISUALIZE",
        message: "Picture yourself on a mountain path",
        displayTime: 120,
        category: "visualization",
        intensity: "moderate"
      },
      {
        actionType: "RECITE",
        message: "Repeat: 'Step by step, I move forward'",
        displayTime: 60,
        category: "affirmation",
        intensity: "moderate"
      },
      {
        actionType: "ACTION",
        message: "Tap fingers to the beat of your walk",
        displayTime: 60,
        category: "movement",
        intensity: "moderate"
      },
      {
        actionType: "VISUALIZE",
        message: "Imagine a bubble of light around you",
        displayTime: 120,
        category: "visualization",
        intensity: "moderate"
      },
      {
        actionType: "RECITE",
        message: "Repeat: 'I am grounded and moving'",
        displayTime: 60,
        category: "affirmation",
        intensity: "moderate"
      },
      {
        actionType: "ACTION",
        message: "Bounce lightly on your toes",
        displayTime: 60,
        category: "mindfulness",
        intensity: "moderate"
      },
      {
        actionType: "VISUALIZE",
        message: "Picture your body as fluid and strong",
        displayTime: 120,
        category: "visualization",
        intensity: "strong"
      },
      {
        actionType: "RECITE",
        message: "Recite: 'Movement is joy'",
        displayTime: 60,
        category: "affirmation",
        intensity: "moderate"
      }
    ],
    focussed: [
      {
        actionType: "ACTION",
        message: "Listen to upbeat instrumental music",
        displayTime: 180,
        category: "audio",
        intensity: "moderate"
      },
      {
        actionType: "RECITE",
        message: "Repeat: 'I am alert and clear'",
        displayTime: 60,
        category: "affirmation",
        intensity: "moderate"
      },
      {
        actionType: "VISUALIZE",
        message: "Visualise a beam of light guiding your focus",
        displayTime: 120,
        category: "visualization",
        intensity: "moderate"
      },
      {
        actionType: "RECITE",
        message: "Recite a short poem from memory",
        displayTime: 120,
        category: "affirmation",
        intensity: "moderate"
      },
      {
        actionType: "ACTION",
        message: "Listen to a motivational quote recording",
        displayTime: 120,
        category: "audio",
        intensity: "moderate"
      },
      {
        actionType: "VISUALIZE",
        message: "Visualise a calm ocean while breathing",
        displayTime: 120,
        category: "breathing",
        intensity: "gentle"
      },
      {
        actionType: "RECITE",
        message: "Repeat: 'Clarity is my strength'",
        displayTime: 60,
        category: "affirmation",
        intensity: "moderate"
      },
      {
        actionType: "ACTION",
        message: "Listen to nature sounds with eyes open",
        displayTime: 180,
        category: "audio",
        intensity: "moderate"
      },
      {
        actionType: "VISUALIZE",
        message: "Imagine your thoughts as clouds passing",
        displayTime: 120,
        category: "visualization",
        intensity: "moderate"
      },
      {
        actionType: "RECITE",
        message: "Repeat: 'Each moment matters'",
        displayTime: 60,
        category: "affirmation",
        intensity: "moderate"
      },
      {
        actionType: "ACTION",
        message: "Focus on one sound in your environment",
        displayTime: 120,
        category: "audio",
        intensity: "moderate"
      },
      {
        actionType: "VISUALIZE",
        message: "Visualise your brain lighting up",
        displayTime: 120,
        category: "visualization",
        intensity: "moderate"
      },
      {
        actionType: "RECITE",
        message: "Repeat: 'I am present and attentive'",
        displayTime: 60,
        category: "affirmation",
        intensity: "moderate"
      },
      {
        actionType: "ACTION",
        message: "Listen to calming binaural beats",
        displayTime: 180,
        category: "audio",
        intensity: "gentle"
      },
      {
        actionType: "VISUALIZE",
        message: "Picture a tunnel narrowing toward one goal",
        displayTime: 120,
        category: "visualization",
        intensity: "moderate"
      }
    ]
  },
  okay: {
    safe: [
      {
        actionType: "VISUALIZE",
        message: "Do a mindful body scan",
        displayTime: 120,
        category: "mindfulness",
        intensity: "moderate"
      },
      {
        actionType: "ACTION",
        message: "Write down three things you're grateful for",
        displayTime: 180,
        category: "gratitude",
        intensity: "moderate"
      },
      {
        actionType: "RECITE",
        message: "Recite a positive affirmation aloud",
        displayTime: 60,
        category: "affirmation",
        intensity: "moderate"
      },
      {
        actionType: "VISUALIZE",
        message: "Visualise your ideal day",
        displayTime: 120,
        category: "visualization",
        intensity: "moderate"
      },
      {
        actionType: "RECITE",
        message: "Repeat the phrase: 'Today, I am at peace'",
        displayTime: 60,
        category: "affirmation",
        intensity: "gentle"
      },
      {
        actionType: "ACTION",
        message: "Stretch your arms slowly and smile",
        displayTime: 120,
        category: "movement",
        intensity: "moderate"
      },
      {
        actionType: "ACTION",
        message: "Sit with eyes closed and breathe deeply",
        displayTime: 180,
        category: "breathing",
        intensity: "strong"
      },
      {
        actionType: "RECITE",
        message: "Repeat: 'I choose calm over chaos'",
        displayTime: 60,
        category: "affirmation",
        intensity: "gentle"
      },
      {
        actionType: "ACTION",
        message: "Draw a doodle of how you feel",
        displayTime: 240,
        category: "mindfulness",
        intensity: "moderate"
      },
      {
        actionType: "VISUALIZE",
        message: "Imagine yourself floating on calm water",
        displayTime: 120,
        category: "visualization",
        intensity: "gentle"
      },
      {
        actionType: "RECITE",
        message: "Repeat: 'Joy flows through me'",
        displayTime: 60,
        category: "affirmation",
        intensity: "moderate"
      },
      {
        actionType: "ACTION",
        message: "Light a candle and focus on the flame",
        displayTime: 180,
        category: "focus",
        intensity: "moderate"
      },
      {
        actionType: "VISUALIZE",
        message: "Visualise a place you love",
        displayTime: 120,
        category: "visualization",
        intensity: "moderate"
      },
      {
        actionType: "RECITE",
        message: "Recite: 'I am rooted and grounded'",
        displayTime: 60,
        category: "affirmation",
        intensity: "moderate"
      },
      {
        actionType: "ACTION",
        message: "Do a 4-7-8 breathing pattern",
        displayTime: 120,
        category: "breathing",
        intensity: "moderate"
      }
    ],
    moving: [
      {
        actionType: "ACTION",
        message: "Walk while noticing five things around you",
        displayTime: 180,
        category: "movement",
        intensity: "moderate"
      },
      {
        actionType: "RECITE",
        message: "Repeat: 'Every step energises me'",
        displayTime: 60,
        category: "affirmation",
        intensity: "moderate"
      },
      {
        actionType: "VISUALIZE",
        message: "Visualise your feet touching light with each step",
        displayTime: 120,
        category: "visualization",
        intensity: "moderate"
      },
      {
        actionType: "ACTION",
        message: "Stretch one arm at a time while walking",
        displayTime: 120,
        category: "movement",
        intensity: "moderate"
      },
      {
        actionType: "RECITE",
        message: "Repeat your favourite quote as you walk",
        displayTime: 60,
        category: "affirmation",
        intensity: "moderate"
      },
      {
        actionType: "ACTION",
        message: "Swing arms loosely and smile",
        displayTime: 120,
        category: "mindfulness",
        intensity: "moderate"
      },
      {
        actionType: "ACTION",
        message: "Breathe in rhythm with your footsteps",
        displayTime: 120,
        category: "breathing",
        intensity: "moderate"
      },
      {
        actionType: "VISUALIZE",
        message: "Picture yourself on a mountain path",
        displayTime: 120,
        category: "visualization",
        intensity: "moderate"
      },
      {
        actionType: "RECITE",
        message: "Repeat: 'Step by step, I move forward'",
        displayTime: 60,
        category: "affirmation",
        intensity: "moderate"
      },
      {
        actionType: "ACTION",
        message: "Tap fingers to the beat of your walk",
        displayTime: 60,
        category: "movement",
        intensity: "moderate"
      },
      {
        actionType: "VISUALIZE",
        message: "Imagine a bubble of light around you",
        displayTime: 120,
        category: "visualization",
        intensity: "moderate"
      },
      {
        actionType: "RECITE",
        message: "Repeat: 'I am grounded and moving'",
        displayTime: 60,
        category: "affirmation",
        intensity: "moderate"
      },
      {
        actionType: "ACTION",
        message: "Bounce lightly on your toes",
        displayTime: 60,
        category: "mindfulness",
        intensity: "moderate"
      },
      {
        actionType: "VISUALIZE",
        message: "Picture your body as fluid and strong",
        displayTime: 120,
        category: "visualization",
        intensity: "strong"
      },
      {
        actionType: "RECITE",
        message: "Recite: 'Movement is joy'",
        displayTime: 60,
        category: "affirmation",
        intensity: "moderate"
      }
    ],
    focussed: [
      {
        actionType: "ACTION",
        message: "Listen to upbeat instrumental music",
        displayTime: 180,
        category: "audio",
        intensity: "moderate"
      },
      {
        actionType: "RECITE",
        message: "Repeat: 'I am alert and clear'",
        displayTime: 60,
        category: "affirmation",
        intensity: "moderate"
      },
      {
        actionType: "VISUALIZE",
        message: "Visualise a beam of light guiding your focus",
        displayTime: 120,
        category: "visualization",
        intensity: "moderate"
      },
      {
        actionType: "RECITE",
        message: "Recite a short poem from memory",
        displayTime: 120,
        category: "affirmation",
        intensity: "moderate"
      },
      {
        actionType: "ACTION",
        message: "Listen to a motivational quote recording",
        displayTime: 120,
        category: "audio",
        intensity: "moderate"
      },
      {
        actionType: "VISUALIZE",
        message: "Visualise a calm ocean while breathing",
        displayTime: 120,
        category: "breathing",
        intensity: "gentle"
      },
      {
        actionType: "RECITE",
        message: "Repeat: 'Clarity is my strength'",
        displayTime: 60,
        category: "affirmation",
        intensity: "moderate"
      },
      {
        actionType: "ACTION",
        message: "Listen to nature sounds with eyes open",
        displayTime: 180,
        category: "audio",
        intensity: "moderate"
      },
      {
        actionType: "VISUALIZE",
        message: "Imagine your thoughts as clouds passing",
        displayTime: 120,
        category: "visualization",
        intensity: "moderate"
      },
      {
        actionType: "RECITE",
        message: "Repeat: 'Each moment matters'",
        displayTime: 60,
        category: "affirmation",
        intensity: "moderate"
      },
      {
        actionType: "ACTION",
        message: "Focus on one sound in your environment",
        displayTime: 120,
        category: "audio",
        intensity: "moderate"
      },
      {
        actionType: "VISUALIZE",
        message: "Visualise your brain lighting up",
        displayTime: 120,
        category: "visualization",
        intensity: "moderate"
      },
      {
        actionType: "RECITE",
        message: "Repeat: 'I am present and attentive'",
        displayTime: 60,
        category: "affirmation",
        intensity: "moderate"
      },
      {
        actionType: "ACTION",
        message: "Listen to calming binaural beats",
        displayTime: 180,
        category: "audio",
        intensity: "gentle"
      },
      {
        actionType: "VISUALIZE",
        message: "Picture a tunnel narrowing toward one goal",
        displayTime: 120,
        category: "visualization",
        intensity: "moderate"
      }
    ]
  },
  bad: {
    safe: [
      {
        actionType: "VISUALIZE",
        message: "Do a mindful body scan",
        displayTime: 120,
        category: "mindfulness",
        intensity: "moderate"
      },
      {
        actionType: "ACTION",
        message: "Write down three things you're grateful for",
        displayTime: 180,
        category: "gratitude",
        intensity: "moderate"
      },
      {
        actionType: "RECITE",
        message: "Recite a positive affirmation aloud",
        displayTime: 60,
        category: "affirmation",
        intensity: "moderate"
      },
      {
        actionType: "VISUALIZE",
        message: "Visualise your ideal day",
        displayTime: 120,
        category: "visualization",
        intensity: "moderate"
      },
      {
        actionType: "RECITE",
        message: "Repeat the phrase: 'Today, I am at peace'",
        displayTime: 60,
        category: "affirmation",
        intensity: "gentle"
      },
      {
        actionType: "ACTION",
        message: "Stretch your arms slowly and smile",
        displayTime: 120,
        category: "movement",
        intensity: "moderate"
      },
      {
        actionType: "ACTION",
        message: "Sit with eyes closed and breathe deeply",
        displayTime: 180,
        category: "breathing",
        intensity: "strong"
      },
      {
        actionType: "RECITE",
        message: "Repeat: 'I choose calm over chaos'",
        displayTime: 60,
        category: "affirmation",
        intensity: "gentle"
      },
      {
        actionType: "ACTION",
        message: "Draw a doodle of how you feel",
        displayTime: 240,
        category: "mindfulness",
        intensity: "moderate"
      },
      {
        actionType: "VISUALIZE",
        message: "Imagine yourself floating on calm water",
        displayTime: 120,
        category: "visualization",
        intensity: "gentle"
      },
      {
        actionType: "RECITE",
        message: "Repeat: 'Joy flows through me'",
        displayTime: 60,
        category: "affirmation",
        intensity: "moderate"
      },
      {
        actionType: "ACTION",
        message: "Light a candle and focus on the flame",
        displayTime: 180,
        category: "focus",
        intensity: "moderate"
      },
      {
        actionType: "VISUALIZE",
        message: "Visualise a place you love",
        displayTime: 120,
        category: "visualization",
        intensity: "moderate"
      },
      {
        actionType: "RECITE",
        message: "Recite: 'I am rooted and grounded'",
        displayTime: 60,
        category: "affirmation",
        intensity: "moderate"
      },
      {
        actionType: "ACTION",
        message: "Do a 4-7-8 breathing pattern",
        displayTime: 120,
        category: "breathing",
        intensity: "moderate"
      }
    ],
    moving: [
      {
        actionType: "ACTION",
        message: "Walk while noticing five things around you",
        displayTime: 180,
        category: "movement",
        intensity: "moderate"
      },
      {
        actionType: "RECITE",
        message: "Repeat: 'Every step energises me'",
        displayTime: 60,
        category: "affirmation",
        intensity: "moderate"
      },
      {
        actionType: "VISUALIZE",
        message: "Visualise your feet touching light with each step",
        displayTime: 120,
        category: "visualization",
        intensity: "moderate"
      },
      {
        actionType: "ACTION",
        message: "Stretch one arm at a time while walking",
        displayTime: 120,
        category: "movement",
        intensity: "moderate"
      },
      {
        actionType: "RECITE",
        message: "Repeat your favourite quote as you walk",
        displayTime: 60,
        category: "affirmation",
        intensity: "moderate"
      },
      {
        actionType: "ACTION",
        message: "Swing arms loosely and smile",
        displayTime: 120,
        category: "mindfulness",
        intensity: "moderate"
      },
      {
        actionType: "ACTION",
        message: "Breathe in rhythm with your footsteps",
        displayTime: 120,
        category: "breathing",
        intensity: "moderate"
      },
      {
        actionType: "VISUALIZE",
        message: "Picture yourself on a mountain path",
        displayTime: 120,
        category: "visualization",
        intensity: "moderate"
      },
      {
        actionType: "RECITE",
        message: "Repeat: 'Step by step, I move forward'",
        displayTime: 60,
        category: "affirmation",
        intensity: "moderate"
      },
      {
        actionType: "ACTION",
        message: "Tap fingers to the beat of your walk",
        displayTime: 60,
        category: "movement",
        intensity: "moderate"
      },
      {
        actionType: "VISUALIZE",
        message: "Imagine a bubble of light around you",
        displayTime: 120,
        category: "visualization",
        intensity: "moderate"
      },
      {
        actionType: "RECITE",
        message: "Repeat: 'I am grounded and moving'",
        displayTime: 60,
        category: "affirmation",
        intensity: "moderate"
      },
      {
        actionType: "ACTION",
        message: "Bounce lightly on your toes",
        displayTime: 60,
        category: "mindfulness",
        intensity: "moderate"
      },
      {
        actionType: "VISUALIZE",
        message: "Picture your body as fluid and strong",
        displayTime: 120,
        category: "visualization",
        intensity: "strong"
      },
      {
        actionType: "RECITE",
        message: "Recite: 'Movement is joy'",
        displayTime: 60,
        category: "affirmation",
        intensity: "moderate"
      }
    ],
    focussed: [
      {
        actionType: "ACTION",
        message: "Listen to upbeat instrumental music",
        displayTime: 180,
        category: "audio",
        intensity: "moderate"
      },
      {
        actionType: "RECITE",
        message: "Repeat: 'I am alert and clear'",
        displayTime: 60,
        category: "affirmation",
        intensity: "moderate"
      },
      {
        actionType: "VISUALIZE",
        message: "Visualise a beam of light guiding your focus",
        displayTime: 120,
        category: "visualization",
        intensity: "moderate"
      },
      {
        actionType: "RECITE",
        message: "Recite a short poem from memory",
        displayTime: 120,
        category: "affirmation",
        intensity: "moderate"
      },
      {
        actionType: "ACTION",
        message: "Listen to a motivational quote recording",
        displayTime: 120,
        category: "audio",
        intensity: "moderate"
      },
      {
        actionType: "VISUALIZE",
        message: "Visualise a calm ocean while breathing",
        displayTime: 120,
        category: "breathing",
        intensity: "gentle"
      },
      {
        actionType: "RECITE",
        message: "Repeat: 'Clarity is my strength'",
        displayTime: 60,
        category: "affirmation",
        intensity: "moderate"
      },
      {
        actionType: "ACTION",
        message: "Listen to nature sounds with eyes open",
        displayTime: 180,
        category: "audio",
        intensity: "moderate"
      },
      {
        actionType: "VISUALIZE",
        message: "Imagine your thoughts as clouds passing",
        displayTime: 120,
        category: "visualization",
        intensity: "moderate"
      },
      {
        actionType: "RECITE",
        message: "Repeat: 'Each moment matters'",
        displayTime: 60,
        category: "affirmation",
        intensity: "moderate"
      },
      {
        actionType: "ACTION",
        message: "Focus on one sound in your environment",
        displayTime: 120,
        category: "audio",
        intensity: "moderate"
      },
      {
        actionType: "VISUALIZE",
        message: "Visualise your brain lighting up",
        displayTime: 120,
        category: "visualization",
        intensity: "moderate"
      },
      {
        actionType: "RECITE",
        message: "Repeat: 'I am present and attentive'",
        displayTime: 60,
        category: "affirmation",
        intensity: "moderate"
      },
      {
        actionType: "ACTION",
        message: "Listen to calming binaural beats",
        displayTime: 180,
        category: "audio",
        intensity: "gentle"
      },
      {
        actionType: "VISUALIZE",
        message: "Picture a tunnel narrowing toward one goal",
        displayTime: 120,
        category: "visualization",
        intensity: "moderate"
      }
    ]
  },
  awful: {
    safe: [
      {
        actionType: "VISUALIZE",
        message: "Do a mindful body scan",
        displayTime: 120,
        category: "mindfulness",
        intensity: "moderate"
      },
      {
        actionType: "ACTION",
        message: "Write down three things you're grateful for",
        displayTime: 180,
        category: "gratitude",
        intensity: "moderate"
      },
      {
        actionType: "RECITE",
        message: "Recite a positive affirmation aloud",
        displayTime: 60,
        category: "affirmation",
        intensity: "moderate"
      },
      {
        actionType: "VISUALIZE",
        message: "Visualise your ideal day",
        displayTime: 120,
        category: "visualization",
        intensity: "moderate"
      },
      {
        actionType: "RECITE",
        message: "Repeat the phrase: 'Today, I am at peace'",
        displayTime: 60,
        category: "affirmation",
        intensity: "gentle"
      },
      {
        actionType: "ACTION",
        message: "Stretch your arms slowly and smile",
        displayTime: 120,
        category: "movement",
        intensity: "moderate"
      },
      {
        actionType: "ACTION",
        message: "Sit with eyes closed and breathe deeply",
        displayTime: 180,
        category: "breathing",
        intensity: "strong"
      },
      {
        actionType: "RECITE",
        message: "Repeat: 'I choose calm over chaos'",
        displayTime: 60,
        category: "affirmation",
        intensity: "gentle"
      },
      {
        actionType: "ACTION",
        message: "Draw a doodle of how you feel",
        displayTime: 240,
        category: "mindfulness",
        intensity: "moderate"
      },
      {
        actionType: "VISUALIZE",
        message: "Imagine yourself floating on calm water",
        displayTime: 120,
        category: "visualization",
        intensity: "gentle"
      },
      {
        actionType: "RECITE",
        message: "Repeat: 'Joy flows through me'",
        displayTime: 60,
        category: "affirmation",
        intensity: "moderate"
      },
      {
        actionType: "ACTION",
        message: "Light a candle and focus on the flame",
        displayTime: 180,
        category: "focus",
        intensity: "moderate"
      },
      {
        actionType: "VISUALIZE",
        message: "Visualise a place you love",
        displayTime: 120,
        category: "visualization",
        intensity: "moderate"
      },
      {
        actionType: "RECITE",
        message: "Recite: 'I am rooted and grounded'",
        displayTime: 60,
        category: "affirmation",
        intensity: "moderate"
      },
      {
        actionType: "ACTION",
        message: "Do a 4-7-8 breathing pattern",
        displayTime: 120,
        category: "breathing",
        intensity: "moderate"
      }
    ],
    moving: [
      {
        actionType: "ACTION",
        message: "Walk while noticing five things around you",
        displayTime: 180,
        category: "movement",
        intensity: "moderate"
      },
      {
        actionType: "RECITE",
        message: "Repeat: 'Every step energises me'",
        displayTime: 60,
        category: "affirmation",
        intensity: "moderate"
      },
      {
        actionType: "VISUALIZE",
        message: "Visualise your feet touching light with each step",
        displayTime: 120,
        category: "visualization",
        intensity: "moderate"
      },
      {
        actionType: "ACTION",
        message: "Stretch one arm at a time while walking",
        displayTime: 120,
        category: "movement",
        intensity: "moderate"
      },
      {
        actionType: "RECITE",
        message: "Repeat your favourite quote as you walk",
        displayTime: 60,
        category: "affirmation",
        intensity: "moderate"
      },
      {
        actionType: "ACTION",
        message: "Swing arms loosely and smile",
        displayTime: 120,
        category: "mindfulness",
        intensity: "moderate"
      },
      {
        actionType: "ACTION",
        message: "Breathe in rhythm with your footsteps",
        displayTime: 120,
        category: "breathing",
        intensity: "moderate"
      },
      {
        actionType: "VISUALIZE",
        message: "Picture yourself on a mountain path",
        displayTime: 120,
        category: "visualization",
        intensity: "moderate"
      },
      {
        actionType: "RECITE",
        message: "Repeat: 'Step by step, I move forward'",
        displayTime: 60,
        category: "affirmation",
        intensity: "moderate"
      },
      {
        actionType: "ACTION",
        message: "Tap fingers to the beat of your walk",
        displayTime: 60,
        category: "movement",
        intensity: "moderate"
      },
      {
        actionType: "VISUALIZE",
        message: "Imagine a bubble of light around you",
        displayTime: 120,
        category: "visualization",
        intensity: "moderate"
      },
      {
        actionType: "RECITE",
        message: "Repeat: 'I am grounded and moving'",
        displayTime: 60,
        category: "affirmation",
        intensity: "moderate"
      },
      {
        actionType: "ACTION",
        message: "Bounce lightly on your toes",
        displayTime: 60,
        category: "mindfulness",
        intensity: "moderate"
      },
      {
        actionType: "VISUALIZE",
        message: "Picture your body as fluid and strong",
        displayTime: 120,
        category: "visualization",
        intensity: "strong"
      },
      {
        actionType: "RECITE",
        message: "Recite: 'Movement is joy'",
        displayTime: 60,
        category: "affirmation",
        intensity: "moderate"
      }
    ],
    focussed: [
      {
        actionType: "ACTION",
        message: "Listen to upbeat instrumental music",
        displayTime: 180,
        category: "audio",
        intensity: "moderate"
      },
      {
        actionType: "RECITE",
        message: "Repeat: 'I am alert and clear'",
        displayTime: 60,
        category: "affirmation",
        intensity: "moderate"
      },
      {
        actionType: "VISUALIZE",
        message: "Visualise a beam of light guiding your focus",
        displayTime: 120,
        category: "visualization",
        intensity: "moderate"
      },
      {
        actionType: "RECITE",
        message: "Recite a short poem from memory",
        displayTime: 120,
        category: "affirmation",
        intensity: "moderate"
      },
      {
        actionType: "ACTION",
        message: "Listen to a motivational quote recording",
        displayTime: 120,
        category: "audio",
        intensity: "moderate"
      },
      {
        actionType: "VISUALIZE",
        message: "Visualise a calm ocean while breathing",
        displayTime: 120,
        category: "breathing",
        intensity: "gentle"
      },
      {
        actionType: "RECITE",
        message: "Repeat: 'Clarity is my strength'",
        displayTime: 60,
        category: "affirmation",
        intensity: "moderate"
      },
      {
        actionType: "ACTION",
        message: "Listen to nature sounds with eyes open",
        displayTime: 180,
        category: "audio",
        intensity: "moderate"
      },
      {
        actionType: "VISUALIZE",
        message: "Imagine your thoughts as clouds passing",
        displayTime: 120,
        category: "visualization",
        intensity: "moderate"
      },
      {
        actionType: "RECITE",
        message: "Repeat: 'Each moment matters'",
        displayTime: 60,
        category: "affirmation",
        intensity: "moderate"
      },
      {
        actionType: "ACTION",
        message: "Focus on one sound in your environment",
        displayTime: 120,
        category: "audio",
        intensity: "moderate"
      },
      {
        actionType: "VISUALIZE",
        message: "Visualise your brain lighting up",
        displayTime: 120,
        category: "visualization",
        intensity: "moderate"
      },
      {
        actionType: "RECITE",
        message: "Repeat: 'I am present and attentive'",
        displayTime: 60,
        category: "affirmation",
        intensity: "moderate"
      },
      {
        actionType: "ACTION",
        message: "Listen to calming binaural beats",
        displayTime: 180,
        category: "audio",
        intensity: "gentle"
      },
      {
        actionType: "VISUALIZE",
        message: "Picture a tunnel narrowing toward one goal",
        displayTime: 120,
        category: "visualization",
        intensity: "moderate"
      }
    ]
  }
};

// Utility functions for content management
export function getRandomMessage(mood: Mood, context: Context): ContentMessage | null {
  const messages = CONTENT_LIBRARY[mood]?.[context];
  if (!messages || messages.length === 0) {
    return null;
  }
  
  const randomIndex = Math.floor(Math.random() * messages.length);
  return messages[randomIndex];
}

export function getAllMessages(mood: Mood, context: Context): ContentMessage[] {
  return CONTENT_LIBRARY[mood]?.[context] || [];
}

export function getRandomMessages(mood: Mood, context: Context, count: number = 3): ContentMessage[] {
  const allMessages = getAllMessages(mood, context);
  if (allMessages.length === 0) return [];
  
  // Shuffle and take the requested number
  const shuffled = [...allMessages].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, allMessages.length));
}

export function getMessagesByCategory(mood: Mood, context: Context, category: string): ContentMessage[] {
  const allMessages = getAllMessages(mood, context);
  return allMessages.filter(message => message.category === category);
}

export function getMessagesByIntensity(mood: Mood, context: Context, intensity: 'gentle' | 'moderate' | 'strong'): ContentMessage[] {
  const allMessages = getAllMessages(mood, context);
  return allMessages.filter(message => message.intensity === intensity);
}

// Validation function to ensure content structure is correct
export function validateContentLibrary(): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  // Check that all moods have content
  for (const mood of MOODS) {
    if (!CONTENT_LIBRARY[mood]) {
      errors.push(`Missing content for mood: ${mood}`);
      continue;
    }
    
    // Check that all contexts have content for each mood
    for (const context of CONTEXTS) {
      if (!CONTENT_LIBRARY[mood][context]) {
        errors.push(`Missing content for mood-context combination: ${mood}-${context}`);
        continue;
      }
      
      // Check that each context has at least one message
      if (CONTENT_LIBRARY[mood][context].length === 0) {
        errors.push(`Empty content array for mood-context combination: ${mood}-${context}`);
        continue;
      }
      
      // Validate each message structure
      CONTENT_LIBRARY[mood][context].forEach((message, index) => {
        if (!message.actionType || !message.message || !message.displayTime) {
          errors.push(`Invalid message structure at ${mood}-${context}[${index}]: missing actionType, message, or displayTime`);
        }
      });
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}







