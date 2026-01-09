export class AudioEngine {
  private audioContext: AudioContext | null = null;

  initialize() {
    if (!this.audioContext) {
      this.audioContext = new AudioContext();
    }
  }

  playNote(frequency: number, duration: number = 0.5) {
    if (!this.audioContext) {
      console.error('AudioContext not initialized');
      return;
    }

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';

    // Envelope for smooth attack and release
    const now = this.audioContext.currentTime;
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.3, now + 0.01); // Attack
    gainNode.gain.linearRampToValueAtTime(0.3, now + duration - 0.1); // Sustain
    gainNode.gain.linearRampToValueAtTime(0, now + duration); // Release

    oscillator.start(now);
    oscillator.stop(now + duration);
  }
}