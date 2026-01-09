export interface Note {
  name: string;
  frequency: number;
  midiNumber: number;
}

const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const MIN_OCTAVE = 4;
const MAX_OCTAVE = 5;

// Convert MIDI note number to frequency (A4 = 440Hz)
function midiToFrequency(midiNumber: number): number {
  return 440 * Math.pow(2, (midiNumber - 69) / 12);
}

// Convert note name and octave to MIDI number
function noteToMidi(noteName: string, octave: number): number {
  const noteIndex = NOTES.indexOf(noteName);
  return (octave + 1) * 12 + noteIndex;
}

// Convert MIDI number to note name and octave
function midiToNoteName(midiNumber: number): string {
  const octave = Math.floor(midiNumber / 12) - 1;
  const noteIndex = midiNumber % 12;
  return `${NOTES[noteIndex]}${octave}`;
}

export function generateRandomNote(): Note {
  const randomNote = NOTES[Math.floor(Math.random() * NOTES.length)];
  const randomOctave = Math.floor(Math.random() * (MAX_OCTAVE - MIN_OCTAVE + 1)) + MIN_OCTAVE;
  
  const midiNumber = noteToMidi(randomNote, randomOctave);
  const frequency = midiToFrequency(midiNumber);
  const name = `${randomNote}${randomOctave}`;

  return { name, frequency, midiNumber };
}

export function calculateInterval(
  baseNote: Note,
  semitones: number,
  direction: 'ascending' | 'descending'
): Note {
  const offset = direction === 'ascending' ? semitones : -semitones;
  const targetMidi = baseNote.midiNumber + offset;
  
  const frequency = midiToFrequency(targetMidi);
  const name = midiToNoteName(targetMidi);

  return { name, frequency, midiNumber: targetMidi };
}