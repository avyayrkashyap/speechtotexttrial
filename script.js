class SpeechToText {
    constructor() {
        this.recognition = null;
        this.isRecording = false;
        this.speakButton = document.getElementById('speakButton');
        this.result = document.getElementById('result');
        this.transcription = document.getElementById('transcription');
        this.status = document.getElementById('status');
        
        this.init();
    }

    init() {
        // Check if SpeechRecognition is supported
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            this.showError('Speech recognition is not supported in this browser. Please use Chrome.');
            this.speakButton.disabled = true;
            this.speakButton.style.opacity = '0.5';
            return;
        }

        // Initialize speech recognition
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        this.recognition = new SpeechRecognition();
        
        this.setupRecognition();
        this.setupEventListeners();
    }

    setupRecognition() {
        this.recognition.continuous = false;
        this.recognition.interimResults = false;
        this.recognition.lang = 'en-US';

        this.recognition.onstart = () => {
            this.isRecording = true;
            this.updateUI();
            this.showStatus('Listening... Speak now!', 'recording');
        };

        this.recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            this.transcription.textContent = transcript;
            this.result.classList.remove('error');
        };

        this.recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            this.showError(`Error: ${event.error}`);
            this.stopRecording();
        };

        this.recognition.onend = () => {
            this.stopRecording();
        };
    }

    setupEventListeners() {
        this.speakButton.addEventListener('click', () => {
            if (this.isRecording) {
                this.stopRecording();
            } else {
                this.startRecording();
            }
        });
    }

    startRecording() {
        try {
            this.recognition.start();
        } catch (error) {
            console.error('Error starting speech recognition:', error);
            this.showError('Failed to start speech recognition');
        }
    }

    stopRecording() {
        this.isRecording = false;
        this.updateUI();
        this.hideStatus();
        
        if (this.recognition) {
            try {
                this.recognition.stop();
            } catch (error) {
                console.error('Error stopping speech recognition:', error);
            }
        }
    }

    updateUI() {
        if (this.isRecording) {
            this.speakButton.classList.add('recording');
            this.speakButton.innerHTML = '<span class="mic-icon">🔴</span>Stop Recording';
        } else {
            this.speakButton.classList.remove('recording');
            this.speakButton.innerHTML = '<span class="mic-icon">🎤</span>Start Speaking';
        }
    }

    showStatus(message, type = '') {
        this.status.textContent = message;
        this.status.className = `status ${type}`;
        this.status.style.display = 'block';
    }

    hideStatus() {
        this.status.style.display = 'none';
    }

    showError(message) {
        this.result.classList.add('error');
        this.transcription.textContent = message;
        this.showStatus(message, 'error');
    }
}

// Initialize the app when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new SpeechToText();
}); 