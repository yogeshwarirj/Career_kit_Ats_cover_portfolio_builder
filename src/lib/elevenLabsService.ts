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
  use_speaker_boost?: boolean;
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

  constructor() {
    this.config = {
      apiKey: import.meta.env.VITE_ELEVENLABS_API_KEY || '',
      voiceId: 'EXAVITQu4vr4xnSDxMaL', // Default professional voice (Bella)
      model: 'eleven_monolingual_v1'
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
    return this.config.apiKey !== '' && this.config.apiKey !== 'your_elevenlabs_api_key_here';
  }

  /**
   * Get configuration status
   */
  getConfigurationStatus(): { configured: boolean; message: string } {
    if (!this.config.apiKey || this.config.apiKey === 'your_elevenlabs_api_key_here') {
      return {
        configured: false,
        message: 'Eleven Labs API key not configured. Please add VITE_ELEVENLABS_API_KEY to your .env file.'
      };
    }
    
    return {
      configured: true,
      message: 'Eleven Labs is properly configured and ready to use.'
    };
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
        stability: 0.5,
        similarity_boost: 0.75,
        style: 0.0,
        use_speaker_boost: true,
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
  async playText(text: string, options?: Partial<TextToSpeechOptions>): Promise<void> {
    try {
      // Stop any currently playing audio
      this.stopCurrentAudio();
      
      const audioUrl = await this.textToSpeech({ text, ...options });
      
      return new Promise((resolve, reject) => {
        this.currentAudio = new Audio(audioUrl);
        
        this.currentAudio.onended = () => {
          resolve();
        };
        
        this.currentAudio.onerror = () => {
          reject(new Error('Failed to play audio'));
        };
        
        this.currentAudio.play().catch(reject);
      });
    } catch (error) {
      console.error('Play text error:', error);
      throw error;
    }
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
}

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