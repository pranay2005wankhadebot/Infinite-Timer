import React from 'react';
// FIX: Using explicit file path to ensure module resolution.
import Modal from './Modal.tsx';
import { Icon } from './Icon.tsx';

interface SoundSettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    volume: number;
    setVolume: (volume: number) => void;
    isMuted: boolean;
    setIsMuted: (isMuted: boolean) => void;
    tickSound: string | null;
    setTickSound: (sound: string | null) => void;
    endSound: string;
    setEndSound: (sound: string) => void;
}

const soundOptions = [
    { name: 'None', value: null },
    { name: 'Tick', value: 'https://www.soundjay.com/clock/sounds/clock-ticking-1.mp3' },
    { name: 'Click', value: 'https://www.soundjay.com/buttons/sounds/button-7.mp3' }
];

const endSoundOptions = [
    { name: 'Chime', value: 'https://www.soundjay.com/buttons/sounds/button-3.mp3' },
    { name: 'Alert', value: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3' },
    { name: 'Beep', value: 'https://www.soundjay.com/buttons/sounds/beep-07.mp3' }
];

const SoundSettingsModal: React.FC<SoundSettingsModalProps> = ({
    isOpen, onClose, volume, setVolume, isMuted, setIsMuted, tickSound, setTickSound, endSound, setEndSound
}) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="space-y-6 p-2">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Sound Settings</h2>

                <div className="space-y-2">
                    <label className="font-medium">Master Volume</label>
                    <div className="flex items-center gap-4">
                        <button onClick={() => setIsMuted(!isMuted)}>
                            <Icon name={isMuted || volume === 0 ? 'volume-off' : 'volume-up'} className="w-6 h-6 text-gray-500" />
                        </button>
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.05"
                            value={isMuted ? 0 : volume}
                            onChange={e => {
                                setVolume(parseFloat(e.target.value));
                                if (isMuted && parseFloat(e.target.value) > 0) setIsMuted(false);
                            }}
                            className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label htmlFor="tick-sound" className="font-medium">Ticking Sound</label>
                    <select
                        id="tick-sound"
                        value={tickSound || 'None'}
                        onChange={e => setTickSound(e.target.value === 'None' ? null : e.target.value)}
                         className="w-full bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                        {soundOptions.map(opt => <option key={opt.name} value={opt.value || 'None'}>{opt.name}</option>)}
                    </select>
                </div>
                
                 <div className="space-y-2">
                    <label htmlFor="end-sound" className="font-medium">Session End Sound</label>
                    <select
                        id="end-sound"
                        value={endSound}
                        onChange={e => setEndSound(e.target.value)}
                        className="w-full bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                        {endSoundOptions.map(opt => <option key={opt.name} value={opt.value}>{opt.name}</option>)}
                    </select>
                </div>
                
                <div className="flex justify-end pt-4">
                    <button onClick={onClose} className="bg-primary-600 text-white px-6 py-2 rounded-md font-semibold hover:bg-primary-700">
                        Done
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default SoundSettingsModal;
