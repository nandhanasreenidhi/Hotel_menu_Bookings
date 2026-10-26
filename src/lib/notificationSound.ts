/** Short, dependency-free notification tones using the Web Audio API. */
export function playNotificationSound(kind: 'order' | 'kitchen' = 'order') {
  if (typeof window === 'undefined') return;
  const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
  if (!AudioContextClass) return;

  try {
    const context = new AudioContextClass();
    const notes = kind === 'kitchen' ? [660, 880, 660] : [740, 988];
    const duration = kind === 'kitchen' ? 0.12 : 0.14;
    notes.forEach((frequency, index) => {
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      const start = context.currentTime + index * (duration + 0.045);
      oscillator.type = 'sine';
      oscillator.frequency.value = frequency;
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(0.16, start + 0.018);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
      oscillator.connect(gain);
      gain.connect(context.destination);
      oscillator.start(start);
      oscillator.stop(start + duration + 0.02);
    });
    window.setTimeout(() => { void context.close().catch(() => undefined); }, 900);
  } catch {
    // Sound is an enhancement; ordering must continue if audio is unavailable.
  }
}
