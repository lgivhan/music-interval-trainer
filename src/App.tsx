import { useState, useEffect } from 'react';
import { AudioEngine } from './utils/audioEngine';
import { generateRandomNote, calculateInterval, type Note } from './utils/noteGenerator';

const INTERVALS = [
  { name: 'Minor 2nd', semitones: 1 },
  { name: 'Major 2nd', semitones: 2 },
  { name: 'Minor 3rd', semitones: 3 },
  { name: 'Major 3rd', semitones: 4 },
  { name: 'Perfect 4th', semitones: 5 },
  { name: 'Tritone', semitones: 6 },
  { name: 'Perfect 5th', semitones: 7 },
  { name: 'Minor 6th', semitones: 8 },
  { name: 'Major 6th', semitones: 9 },
  { name: 'Minor 7th', semitones: 10 },
  { name: 'Major 7th', semitones: 11 },
  { name: 'Octave', semitones: 12 },
];

function App() {
  const [audioEngine] = useState(() => new AudioEngine());
  // Start app on middle C
  const [currentNote, setCurrentNote] = useState<Note | null>({
    name: 'C4',
    frequency: 261.63,
    midiNumber: 60
  });
  const [selectedInterval, setSelectedInterval] = useState(INTERVALS[1].semitones); // Major 2nd default
  const [direction, setDirection] = useState<'ascending' | 'descending'>('ascending');

  useEffect(() => {
    // Initialize audio context on first user interaction
    const initAudio = () => {
      audioEngine.initialize();
      document.removeEventListener('click', initAudio);
    };
    document.addEventListener('click', initAudio);
    return () => document.removeEventListener('click', initAudio);
  }, [audioEngine]);

  const handleChangeNote = () => {
    const note = generateRandomNote();
    setCurrentNote(note);
    audioEngine.playNote(note.frequency, 0.5);
  };

  const handlePlayInterval = () => {
    if (!currentNote) return;
    
    const targetNote = calculateInterval(currentNote, selectedInterval, direction);
    audioEngine.playNote(targetNote.frequency, 0.5);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 flex items-center justify-center p-4">
      <div className="bg-slate-800 rounded-2xl shadow-2xl p-8 max-w-md w-full border border-slate-700">
        <h1 className="text-4xl font-bold text-center mb-2 text-indigo-400">
          Music Interval Trainer
        </h1>
        <p className="text-center text-slate-400 mb-8">
          Train your ear to recognize musical intervals
        </p>

        {/* Note Display */}
        <div className="bg-slate-900 rounded-xl p-6 mb-6 text-center border border-slate-700">
          <p className="text-sm text-slate-400 mb-2">Current Note</p>
          <p className="text-5xl font-bold text-indigo-300">
            {currentNote ? currentNote.name : '—'}
          </p>
        </div>

        {/* Controls */}
        <div className="space-y-4 mb-6">
          {/* Interval Selection */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Interval
            </label>
            <select
              value={selectedInterval}
              onChange={(e) => setSelectedInterval(Number(e.target.value))}
              className="w-full px-4 py-3 border border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-700 text-slate-100"
            >
              {INTERVALS.map((interval) => (
                <option key={interval.semitones} value={interval.semitones}>
                  {interval.name}
                </option>
              ))}
            </select>
          </div>

          {/* Direction Selection */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Direction
            </label>
            <select
              value={direction}
              onChange={(e) => setDirection(e.target.value as 'ascending' | 'descending')}
              className="w-full px-4 py-3 border border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-slate-700 text-slate-100"
            >
              <option value="ascending">Ascending</option>
              <option value="descending">Descending</option>
            </select>
          </div>
        </div>

        {/* Buttons */}
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleChangeNote}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-4 px-6 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
            >
              Change Note
            </button>
            <button
              onClick={() => currentNote && audioEngine.playNote(currentNote.frequency, 0.5)}
              disabled={!currentNote}
              className={`font-semibold py-4 px-6 rounded-lg transition-colors duration-200 shadow-md ${
                currentNote
                  ? 'bg-blue-600 hover:bg-blue-700 text-white hover:shadow-lg'
                  : 'bg-slate-600 text-slate-400 cursor-not-allowed'
              }`}
            >
              Replay Note
            </button>
          </div>
          <button
            onClick={handlePlayInterval}
            disabled={!currentNote}
            className={`w-full font-semibold py-4 px-6 rounded-lg transition-colors duration-200 shadow-md ${
              currentNote
                ? 'bg-green-600 hover:bg-green-700 text-white hover:shadow-lg'
                : 'bg-slate-600 text-slate-400 cursor-not-allowed'
            }`}
          >
            Play Interval
          </button>
        </div>

        {/* Instructions */}
        <div className="mt-8 p-4 bg-slate-900 rounded-lg border border-slate-700">
          <h3 className="font-semibold text-slate-200 mb-2">How to use:</h3>
          <ol className="text-sm text-slate-400 space-y-1 list-decimal list-inside">
            <li>Click "Change Note" to hear a random starting note</li>
            <li>Try to sing the interval in your head</li>
            <li>Click "Play Interval" to hear the correct note</li>
            <li>Compare what you sang with the correct note</li>
          </ol>
        </div>
      </div>
    </div>
  );
}

export default App;