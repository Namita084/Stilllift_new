export interface PlayTextAudioOptions {
  title?: string;
  rate?: number;
  pitch?: number;
  volume?: number;
  voiceHintNames?: string[];
  mood?: string;
  context?: string;
  isHomepage?: boolean;
  audioIndex?: number;
  preferExactIndex?: boolean;
}

let activeAudio: HTMLAudioElement | null = null;
let activeSpeech: SpeechSynthesisUtterance | null = null;

type ExternalAudioStopper = () => void;

const externalAudioStopHandlers = new Set<ExternalAudioStopper>();
let isStoppingNarration = false;

export function registerExternalAudioStopper(handler: ExternalAudioStopper): () => void {
  if (typeof window === 'undefined') {
    return () => {};
  }

  externalAudioStopHandlers.add(handler);

  return () => {
    externalAudioStopHandlers.delete(handler);
  };
}

export function stopAllNarration() {
  if (typeof window === 'undefined') return;

  if (isStoppingNarration) return;

  isStoppingNarration = true;

  try {
    const handlers = Array.from(externalAudioStopHandlers);
    for (const handler of handlers) {
      try {
        handler();
      } catch (error) {
        console.warn('[audio] External audio stop handler failed:', error);
      }
    }

    if (activeAudio) {
      activeAudio.pause();
      try {
        activeAudio.currentTime = 0;
      } catch (error) {
        console.warn('[audio] Unable to reset audio currentTime:', error);
      }
      activeAudio = null;
    }

    if (activeSpeech) {
      try {
        window.speechSynthesis.cancel();
      } catch (error) {
        console.warn('[audio] Unable to cancel speech synthesis:', error);
      }
      activeSpeech = null;
    }
  } finally {
    isStoppingNarration = false;
  }
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

/**
 * Try to play a pre-generated audio file using various naming strategies.
 * Returns true if audio file playback started, else false.
 */
async function tryPlayAudioFile(title: string | undefined, message: string, options?: PlayTextAudioOptions): Promise<boolean> {
  const candidates: string[] = [];
  
  // Strategy 1: Mood-Context structured files (your naming pattern) - PRIORITY
  if (options?.mood && options?.context) {
    const moodCapitalized = options.mood.charAt(0).toUpperCase() + options.mood.slice(1);
    const contextMapped = mapContextToYourNaming(options.context);
    const primaryIndex = Math.max(1, Math.floor(options.audioIndex ?? 1));
    const indicesToTry: number[] = [primaryIndex];

    if (!options?.preferExactIndex && primaryIndex !== 1) {
      indicesToTry.push(1);
    }

    for (const idx of indicesToTry) {
      const suffix = `_Audio_${idx}`;
      candidates.push(
        `/Audio/Mood_${moodCapitalized}_Context_${contextMapped}${suffix}.mp3`,
        `/Audio/Mood_${moodCapitalized}_Context_${contextMapped}${suffix}.m4a`,
        `/Audio/Mood_${moodCapitalized}_Context_${contextMapped}${suffix}.ogg`,
        `/Audio/Mood_${moodCapitalized}_Context_${contextMapped}${suffix}.wav`
      );
    }
  }
  
  // Strategy 2: Homepage audio (only if no mood/context or explicitly requested)
  if (options?.isHomepage && (!options?.mood || !options?.context)) {
    candidates.push('/Audio/homepage audio.mp3');
  }
  
  // Strategy 3: Message-based slugs (original approach)
  const combinedKey = title && title.trim().length > 0 ? `${title} ${message}` : '';
  const slugsToTry = [
    ...(combinedKey ? [slugify(combinedKey).slice(0, 120)] : []),
    slugify(message).slice(0, 120),
  ];

  for (const slug of slugsToTry) {
    candidates.push(
      `/Audio/${slug}.mp3`,
      `/Audio/${slug}.m4a`,
      `/Audio/${slug}.ogg`,
      `/Audio/${slug}.wav`,
      `/audio/${slug}.mp3`,
      `/audio/${slug}.m4a`,
      `/audio/${slug}.ogg`,
      `/audio/${slug}.wav`
    );
  }

  console.log('[audio] Trying audio candidates:', candidates);

  for (const src of candidates) {
    try {
      const audio = new Audio(src);
      
      // Add error event listeners to catch audio loading/playback errors
      const playPromise = audio.play();
      
      if (playPromise !== undefined) {
        await playPromise;
        console.log('[audio] ✅ Playing pre-generated file:', src);
        if (activeAudio && activeAudio !== audio) {
          activeAudio.pause();
        }
        activeAudio = audio;
        audio.onended = () => {
          if (activeAudio === audio) {
            activeAudio = null;
          }
        };
        return true;
      }
    } catch (err) {
      // Handle different types of errors
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.log('[audio] ❌ Failed to play:', src, errorMessage);
      continue;
    }
  }
  
  console.warn('[audio] No matching audio file found for title/message. Falling back to TTS.');
  return false;
}

/**
 * Map your app's context names to your audio file naming convention
 */
function mapContextToYourNaming(context: string): string {
  switch (context) {
    case 'safe': return 'Still';
    case 'moving': return 'Move';
    case 'focussed': return 'Focussed';
    default: return context;
  }
}

/**
 * Speak text via Web Speech API.
 */
function speakWithTts(text: string, options?: PlayTextAudioOptions) {
  try {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      console.warn('[audio] Speech synthesis not available');
      return;
    }
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = options?.rate ?? 0.95;
    utterance.pitch = options?.pitch ?? 1;
    utterance.volume = options?.volume ?? 0.9;

    if (options?.voiceHintNames && options.voiceHintNames.length > 0) {
      const voices = window.speechSynthesis.getVoices();
      const preferred = voices.find(v => options.voiceHintNames!.some(h => v.name.includes(h)));
      if (preferred) utterance.voice = preferred;
    }

    // Add error handling for TTS
    utterance.onerror = (event) => {
      console.error('[audio] TTS error:', event.error);
      if (activeSpeech === utterance) {
        activeSpeech = null;
      }
    };

    utterance.onend = () => {
      if (activeSpeech === utterance) {
        activeSpeech = null;
      }
    };

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
    activeSpeech = utterance;
    console.log('[audio] 🔊 Playing TTS:', text);
  } catch (error) {
    console.error('[audio] Error in TTS:', error);
  }
}

/**
 * Plays a pre-generated audio file for the given message if available, otherwise TTS.
 * Now supports your actual file naming patterns!
 */
export async function playMessageAudio(
  title: string | undefined,
  message: string,
  options?: PlayTextAudioOptions
): Promise<void> {
  if (typeof window === 'undefined') return;

  try {
    stopAllNarration();
    // Prefer pre-generated audio
    const played = await tryPlayAudioFile(title, message, options);
    if (played) return;

    // Fallback to TTS
    const fullText = title && title.trim().length > 0 ? `${title}. ${message}` : message;
    speakWithTts(fullText, options);
  } catch (error) {
    console.error('[audio] Error in playMessageAudio:', error);
    // Still try TTS as fallback even if there's an error
    const fullText = title && title.trim().length > 0 ? `${title}. ${message}` : message;
    speakWithTts(fullText, options);
  }
}

export function getSuggestedAudioSlug(title: string | undefined, message: string): string {
  const key = title && title.trim().length > 0 ? `${title} ${message}` : message;
  return slugify(key).slice(0, 120);
}


