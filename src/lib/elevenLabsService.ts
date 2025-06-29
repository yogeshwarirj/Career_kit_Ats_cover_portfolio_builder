import toast from 'react-hot-toast';

export interface ElevenLabsConfig {
  apiKey: string;
  voiceId: string;
  model: string;
}

export interface VoiceSettings {
  stability: number;
  similarity_boost: number;
  style?: number;
  use_speaker_boost: boolean;
}

export interface TextToSpeechOptions {
  text: string;
  voiceId?: string;
  voiceSettings?: VoiceSettings;
  model?: string;
}

export interface ElevenLabsVoice {
  voice_id: string;
  name: string;
  category: string;
  description?: string;
}

class ElevenLabsService {
  private static instance: ElevenLabsService;
  private config: ElevenLabsConfig;
  private audioCache: Map<string, string> = new Map();
  private currentAudio: HTMLAudioElement | null = null;
  private isGloballyPlaying: boolean = false;
  private currentPlaybackId: string | null = null;
  private activeComponents: Set<string> = new Set();

  constructor() {
    this.config = {
      apiKey: import.meta.env.VITE_ELEVENLABS_API_KEY || '',
      voiceId: 'EXAVITQu4vr4xnSDxMaL', // Professional female voice (Bella) - clear, articulate, professional
      model: 'eleven_multilingual_v2' // Better quality model
    };
  }

  static getInstance(): ElevenLabsService {
    if (!ElevenLabsService.instance) {
      ElevenLabsService.instance = new ElevenLabsService();
    }
    return ElevenLabsService.instance;
  }

  /**
   * Check if Eleven Labs is properly configured
   */
  isConfigured(): boolean {
    return this.config.apiKey !== '' && 
           this.config.apiKey !== 'your_elevenlabs_api_key_here' && 
           this.config.apiKey !== null && 
           this.config.apiKey !== undefined &&
           this.config.apiKey.length > 10;
  }

  /**
   * Get configuration status
   */
  getConfigurationStatus(): { configured: boolean; message: string } {
    if (!this.config.apiKey || 
        this.config.apiKey === 'your_elevenlabs_api_key_here' || 
        this.config.apiKey === '' ||
        this.config.apiKey.length < 10) {
      return {
        configured: false,
        message: 'Eleven Labs API key not configured. Please add your API key to the .env file and restart the server.'
      };
    }
    
    return {
      configured: true,
      message: 'Eleven Labs is properly configured and ready to use.'
    };
  }

  /**
   * GLOBAL AUDIO CONTROL - Stops ALL audio across ALL components
   */
  stopAllAudio(): void {
    // Stop current audio immediately
    if (this.currentAudio) {
      try {
        this.currentAudio.pause();
        this.currentAudio.currentTime = 0;
        this.currentAudio.onended = null;
        this.currentAudio.onerror = null;
        this.currentAudio.src = '';
      } catch (error) {
        console.warn('Error stopping audio:', error);
      } finally {
        this.currentAudio = null;
      }
    }

    // Reset all state
    this.isGloballyPlaying = false;
    this.currentPlaybackId = null;
    this.activeComponents.clear();

    // Stop any other audio elements that might be playing
    try {
      const audioElements = document.querySelectorAll('audio');
      audioElements.forEach(audio => {
        try {
          audio.pause();
          audio.currentTime = 0;
          audio.src = '';
        } catch (e) {
          // Ignore errors on cleanup
        }
      });
    } catch (error) {
      console.warn('Error cleaning up audio elements:', error);
    }
  }

  /**
   * Check if any audio is currently playing globally
   */
  isGloballyPlaying(): boolean {
    return this.isGloballyPlaying;
  }

  /**
   * Check if a specific component is currently playing
   */
  isComponentPlaying(componentId: string): boolean {
    return this.isGloballyPlaying && this.currentPlaybackId === componentId;
  }

  /**
   * Stop audio if it belongs to a specific component
   */
  stopComponentAudio(componentId: string): void {
    if (this.currentPlaybackId === componentId || this.activeComponents.has(componentId)) {
      this.stopAllAudio();
    }
  }

  /**
   * Convert text to speech and return audio URL
   */
  async textToSpeech(options: TextToSpeechOptions): Promise<string> {
    if (!this.isConfigured()) {
      throw new Error('ELEVENLABS_NOT_CONFIGURED');
    }

    const { text, voiceId = this.config.voiceId, model = this.config.model } = options;
    
    // Check cache first
    const cacheKey = `${text}_${voiceId}_${model}`;
    if (this.audioCache.has(cacheKey)) {
      return this.audioCache.get(cacheKey)!;
    }

    try {
      const voiceSettings: VoiceSettings = {
        stability: 0.71, // Higher stability for professional, consistent delivery
        similarity_boost: 0.5, // Balanced for natural sound
        style: 0.0, // Neutral style for professional context
        use_speaker_boost: true, // Enhanced clarity
        ...options.voiceSettings
      };

      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': this.config.apiKey
        },
        body: JSON.stringify({
          text,
          model_id: model,
          voice_settings: voiceSettings
        })
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('INVALID_API_KEY');
        } else if (response.status === 429) {
          throw new Error('QUOTA_EXCEEDED');
        } else {
          throw new Error('API_ERROR');
        }
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      
      // Cache the audio URL
      this.audioCache.set(cacheKey, audioUrl);
      
      return audioUrl;
    } catch (error) {
      console.error('Eleven Labs TTS error:', error);
      
      if (error instanceof Error) {
        switch (error.message) {
          case 'ELEVENLABS_NOT_CONFIGURED':
            throw new Error('Eleven Labs is not configured. Please add your API key.');
          case 'INVALID_API_KEY':
            throw new Error('Invalid Eleven Labs API key. Please check your configuration.');
          case 'QUOTA_EXCEEDED':
            throw new Error('Eleven Labs quota exceeded. Please try again later.');
          case 'API_ERROR':
            throw new Error('Eleven Labs API error. Please try again.');
          default:
            throw new Error('Failed to generate speech. Please try again.');
        }
      }
      
      throw new Error('Failed to generate speech. Please try again.');
    }
  }

  /**
   * Play text with component identification to prevent conflicts
   * This is the MAIN method all components should use
   */
  async playTextWithId(text: string, componentId: string, options?: Partial<TextToSpeechOptions>): Promise<void> {
    // CRITICAL: Stop ALL audio before starting new audio
    this.stopAllAudio();
    
    // Wait a moment for cleanup to complete
    await new Promise(resolve => setTimeout(resolve, 150));
    
    // Set new playback state
    this.isGloballyPlaying = true;
    this.currentPlaybackId = componentId;
    this.activeComponents.add(componentId);

    try {
      const audioUrl = await this.textToSpeech({ text, ...options });
      
      return new Promise((resolve, reject) => {
        // Double-check that we should still be playing (user might have stopped)
        if (!this.isGloballyPlaying || this.currentPlaybackId !== componentId) {
          resolve();
          return;
        }

        this.currentAudio = new Audio(audioUrl);
        
        // Set volume to ensure it's audible but not too loud
        this.currentAudio.volume = 0.8;
        
        this.currentAudio.onended = () => {
          if (this.currentPlaybackId === componentId) {
            this.currentAudio = null;
            this.isGloballyPlaying = false;
            this.currentPlaybackId = null;
            this.activeComponents.delete(componentId);
          }
          resolve();
        };
        
        this.currentAudio.onerror = (error) => {
          console.error('Audio playback error:', error);
          if (this.currentPlaybackId === componentId) {
            this.currentAudio = null;
            this.isGloballyPlaying = false;
            this.currentPlaybackId = null;
            this.activeComponents.delete(componentId);
          }
          reject(new Error('Failed to play audio'));
        };
        
        // Start playback
        this.currentAudio.play().catch((error) => {
          console.error('Audio play failed:', error);
          if (this.currentPlaybackId === componentId) {
            this.currentAudio = null;
            this.isGloballyPlaying = false;
            this.currentPlaybackId = null;
            this.activeComponents.delete(componentId);
          }
          reject(error);
        });
      });
    } catch (error) {
      this.isGloballyPlaying = false;
      this.currentPlaybackId = null;
      this.activeComponents.delete(componentId);
      console.error('Play text error:', error);
      throw error;
    }
  }

  /**
   * Legacy method - redirects to component-based method
   */
  async playText(text: string, options?: Partial<TextToSpeechOptions>): Promise<void> {
    return this.playTextWithId(text, 'legacy-player', options);
  }

  /**
   * Check if audio is currently playing (legacy method)
   */
  isPlaying(): boolean {
    return this.isGloballyPlaying && this.currentAudio !== null && !this.currentAudio.paused;
  }

  /**
   * Get current playback status
   */
  getPlaybackStatus(): {
    isPlaying: boolean;
    componentId: string | null;
    activeComponents: string[];
  } {
    return {
      isPlaying: this.isGloballyPlaying,
      componentId: this.currentPlaybackId,
      activeComponents: Array.from(this.activeComponents)
    };
  }

  /**
   * Get available voices (for future enhancement)
   */
  async getVoices(): Promise<ElevenLabsVoice[]> {
    if (!this.isConfigured()) {
      throw new Error('ELEVENLABS_NOT_CONFIGURED');
    }

    try {
      const response = await fetch('https://api.elevenlabs.io/v1/voices', {
        headers: {
          'xi-api-key': this.config.apiKey
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch voices');
      }

      const data = await response.json();
      return data.voices || [];
    } catch (error) {
      console.error('Get voices error:', error);
      throw error;
    }
  }

  /**
   * Clear audio cache
   */
  clearCache(): void {
    // Revoke all cached URLs to free memory
    this.audioCache.forEach(url => {
      try {
        URL.revokeObjectURL(url);
      } catch (e) {
        // Ignore errors
      }
    });
    this.audioCache.clear();
  }

  /**
   * Set voice ID for TTS
   */
  setVoiceId(voiceId: string): void {
    this.config.voiceId = voiceId;
  }

  /**
   * Get current voice ID
   */
  getVoiceId(): string {
    return this.config.voiceId;
  }

  /**
   * Get professional female voice settings optimized for interview questions
   */
  getProfessionalFemaleVoiceSettings(): VoiceSettings {
    return {
      stability: 0.75, // Higher stability for clear, consistent delivery
      similarity_boost: 0.6, // Natural sound
      style: 0.1, // Slight engagement for better flow
      use_speaker_boost: true // Enhanced clarity for interview context
    };
  }

  /**
   * Play interview question with optimized professional female voice
   */
  async playInterviewQuestion(text: string): Promise<void> {
    const professionalSettings = this.getProfessionalFemaleVoiceSettings();
    
    return this.playTextWithId(text, 'interview-question', {
      voiceSettings: professionalSettings,
      voiceId: 'EXAVITQu4vr4xnSDxMaL' // Bella - professional, clear female voice
    });
  }
}

// Export singleton instance
export const elevenLabsService = ElevenLabsService.getInstance();

// Export the main functions for easy use
export const playText = (text: string, options?: Partial<TextToSpeechOptions>): Promise<void> => {
  return elevenLabsService.playText(text, options);
};

export const stopAudio = (): void => {
  elevenLabsService.stopAllAudio();
};

export const isAudioPlaying = (): boolean => {
  return elevenLabsService.isPlaying();
};

// Export additional professional voice functions
export const playInterviewQuestion = (text: string): Promise<void> => {
  return elevenLabsService.playInterviewQuestion(text);
};