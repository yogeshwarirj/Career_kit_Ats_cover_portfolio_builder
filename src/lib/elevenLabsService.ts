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
  private audioQueue: Array<{ text: string; options?: Partial<TextToSpeechOptions>; resolve: () => void; reject: (error: Error) => void }> = [];
  private currentPlaybackId: string | null = null;

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
   * Check if any audio is currently playing globally
   */
  isGloballyPlaying(): boolean {
    return this.isGloballyPlaying;
  }

  /**
   * Stop all audio playback globally
   */
  stopAllAudio(): void {
    this.stopCurrentAudio();
    this.audioQueue = [];
    this.isGloballyPlaying = false;
    this.currentPlaybackId = null;
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
   * Play text as speech
   */
  async playText(text: string, options?: Partial<TextToSpeechOptions>, playbackId?: string): Promise<void> {
    // If there's already audio playing globally, stop it first
    if (this.isGloballyPlaying) {
      this.stopAllAudio();
      // Small delay to ensure cleanup
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    // Set global playing state and playback ID
    this.isGloballyPlaying = true;
    this.currentPlaybackId = playbackId || null;

    try {
      const audioUrl = await this.textToSpeech({ text, ...options });
      
      return new Promise((resolve, reject) => {
        this.currentAudio = new Audio(audioUrl);
        
        this.currentAudio.onended = () => {
          this.currentAudio = null;
          this.isGloballyPlaying = false;
          this.currentPlaybackId = null;
          resolve();
        };
        
        this.currentAudio.onerror = () => {
          this.currentAudio = null;
          this.isGloballyPlaying = false;
          this.currentPlaybackId = null;
          reject(new Error('Failed to play audio'));
        };
        
        this.currentAudio.play().catch((error) => {
          this.currentAudio = null;
          this.isGloballyPlaying = false;
          this.currentPlaybackId = null;
          reject(error);
        });
      });
    } catch (error) {
      this.isGloballyPlaying = false;
      this.currentPlaybackId = null;
      console.error('Play text error:', error);
      throw error;
    }
  }

  /**
   * Play text with component identification to prevent conflicts
   */
  async playTextWithId(text: string, componentId: string, options?: Partial<TextToSpeechOptions>): Promise<void> {
    return this.playText(text, options, componentId);
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
    if (this.currentPlaybackId === componentId) {
      this.stopAllAudio();
    }
  }

  /**
   * Queue audio for sequential playback (useful for multiple messages)
   */
  async queueText(text: string, options?: Partial<TextToSpeechOptions>): Promise<void> {
    return new Promise((resolve, reject) => {
      this.audioQueue.push({ text, options, resolve, reject });
      
      // If nothing is playing, start the queue
      if (!this.isGloballyPlaying) {
        this.processAudioQueue();
      }
    });
  }

  /**
   * Process the audio queue sequentially
   */
  private async processAudioQueue(): Promise<void> {
    while (this.audioQueue.length > 0) {
      const item = this.audioQueue.shift();
      if (!item) break;

      try {
        await this.playText(item.text, item.options);
        item.resolve();
      } catch (error) {
        item.reject(error instanceof Error ? error : new Error('Audio playback failed'));
        // Continue with next item even if one fails
      }

      // Small delay between queue items
      if (this.audioQueue.length > 0) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
  }

  /**
   * Clear the audio queue
   */
  clearQueue(): void {
    // Reject all pending promises
    this.audioQueue.forEach(item => {
      item.reject(new Error('Audio queue cleared'));
    });
    this.audioQueue = [];
  }

  /**
   * Enhanced stop current audio with better cleanup
   */
  stopCurrentAudio(): void {
    if (this.currentAudio) {
      try {
        this.currentAudio.pause();
        this.currentAudio.currentTime = 0;
        this.currentAudio.onended = null;
        this.currentAudio.onerror = null;
      } catch (error) {
        console.warn('Error stopping audio:', error);
      } finally {
        this.currentAudio = null;
        this.isGloballyPlaying = false;
        this.currentPlaybackId = null;
      }
    }
  }

  /**
   * Get current playback status
   */
  getPlaybackStatus(): {
    isPlaying: boolean;
    componentId: string | null;
    queueLength: number;
  } {
    return {
      isPlaying: this.isGloballyPlaying,
      componentId: this.currentPlaybackId,
      queueLength: this.audioQueue.length
    };
  }

  /**
   * Stop currently playing audio
   */
  stopCurrentAudio(): void {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.currentAudio = null;
    }
  }

  /**
   * Check if audio is currently playing
   */
  isPlaying(): boolean {
    return this.currentAudio !== null && !this.currentAudio.paused;
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
      URL.revokeObjectURL(url);
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
    
    return this.playText(text, {
      voiceSettings: professionalSettings,
      voiceId: 'EXAVITQu4vr4xnSDxMaL' // Bella - professional, clear female voice
    });
  }
}

// Export additional professional voice functions
export const playInterviewQuestion = (text: string): Promise<void> => {
  return elevenLabsService.playInterviewQuestion(text);
};

// Export singleton instance
export const elevenLabsService = ElevenLabsService.getInstance();

// Export the main functions for easy use
export const playText = (text: string, options?: Partial<TextToSpeechOptions>): Promise<void> => {
  return elevenLabsService.playText(text, options);
};

export const stopAudio = (): void => {
  elevenLabsService.stopCurrentAudio();
};

export const isAudioPlaying = (): boolean => {
  return elevenLabsService.isPlaying();
};