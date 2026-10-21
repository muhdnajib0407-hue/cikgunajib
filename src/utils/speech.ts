class SpeechManager {
  private isSpeaking: boolean = false;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private rate: number = 0.85; // slightly slower by default for MBPK special education clarity

  public setRate(newRate: number) {
    this.rate = Math.max(0.6, Math.min(1.5, newRate));
  }

  public getRate(): number {
    return this.rate;
  }

  public stop() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      this.isSpeaking = false;
    }
  }

  public speak(
    text: string,
    options?: {
      rate?: number;
      onStart?: () => void;
      onEnd?: () => void;
    }
  ): Promise<void> {
    return new Promise((resolve) => {
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
        console.warn('Speech synthesis not supported in this environment');
        resolve();
        return;
      }

      this.stop();

      const utterance = new SpeechSynthesisUtterance(text);
      this.currentUtterance = utterance;

      // Select Malay or Indonesian voice if available
      const voices = window.speechSynthesis.getVoices();
      const malayVoice = voices.find(
        (v) =>
          v.lang.startsWith('ms') ||
          v.lang.startsWith('id') ||
          v.name.toLowerCase().includes('malay') ||
          v.name.toLowerCase().includes('indonesia')
      );

      if (malayVoice) {
        utterance.voice = malayVoice;
      }

      utterance.rate = options?.rate ?? this.rate;
      utterance.pitch = 1.05; // Friendly warm pitch

      utterance.onstart = () => {
        this.isSpeaking = true;
        options?.onStart?.();
      };

      utterance.onend = () => {
        this.isSpeaking = false;
        options?.onEnd?.();
        resolve();
      };

      utterance.onerror = (e) => {
        console.warn('Speech error:', e);
        this.isSpeaking = false;
        options?.onEnd?.();
        resolve();
      };

      window.speechSynthesis.speak(utterance);
    });
  }

  public isBusy(): boolean {
    return this.isSpeaking;
  }
}

export const speech = new SpeechManager();
