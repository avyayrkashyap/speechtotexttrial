const speakButton = document.getElementById('speakButton');
const resultContainer = document.getElementById('resultContainer');
const errorContainer = document.getElementById('errorContainer');

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (SpeechRecognition) {
    const recognition = new SpeechRecognition();
    
    // Use minimal configuration for better compatibility
    recognition.lang = 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;

    console.log('Speech Recognition API available');
    console.log('Protocol:', location.protocol);
    console.log('Hostname:', location.hostname);

    recognition.onstart = () => {
        console.log('Recognition started');
        speakButton.classList.add('recording');
        speakButton.textContent = 'Recording...';
    };

    recognition.onresult = (event) => {
        console.log('Recognition result:', event.results);
        const transcript = event.results[0][0].transcript;
        resultContainer.textContent = `You said: ${transcript}`;
    };

    recognition.onerror = (event) => {
        console.error('Recognition error:', event.error);
        
        // Try to restart recognition automatically for network errors
        if (event.error === 'network') {
            console.log('Attempting to restart recognition...');
            setTimeout(() => {
                try {
                    recognition.start();
                } catch (e) {
                    console.error('Failed to restart:', e);
                    errorContainer.textContent = 'Network error - please try again in a few moments.';
                }
            }, 1000);
            return;
        }
        
        let errorMessage = `Error occurred in recognition: ${event.error}`;
        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
            errorMessage = 'Microphone access denied. Please allow microphone access in your browser settings and try again.';
        } else if (event.error === 'no-speech') {
            errorMessage = 'No speech was detected. Please try again.';
        }
        errorContainer.textContent = errorMessage;
    };

    recognition.onend = () => {
        console.log('Recognition ended');
        speakButton.classList.remove('recording');
        speakButton.textContent = 'Start Speaking';
    };

    speakButton.addEventListener('click', () => {
        console.log('Button clicked, starting recognition...');
        resultContainer.textContent = '';
        errorContainer.textContent = '';
        
        // Add a small delay before starting recognition
        setTimeout(() => {
            try {
                recognition.start();
            } catch (e) {
                console.error('Failed to start recognition:', e);
                errorContainer.textContent = 'Failed to start recognition. Please try again.';
            }
        }, 100);
    });

} else {
    speakButton.disabled = true;
    errorContainer.textContent = 'Speech recognition not supported in this browser.';
} 