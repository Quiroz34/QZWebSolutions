document.addEventListener('DOMContentLoaded', () => {
    console.log('Chat JS cargado correctamente');
    const chatToggle = document.getElementById('chat-toggle');
    const chatWindow = document.getElementById('chat-window');
    const closeChat = document.getElementById('close-chat');
    const chatInput = document.getElementById('chat-input');
    const sendChat = document.getElementById('send-chat');
    const chatMessages = document.getElementById('chat-messages');

    // Toggle Chat Window
    chatToggle.addEventListener('click', () => {
        chatWindow.classList.toggle('hidden');
        if (!chatWindow.classList.contains('hidden')) {
            chatInput.focus();
        }
    });

    closeChat.addEventListener('click', () => {
        chatWindow.classList.add('hidden');
    });

    // Send Message
    const sendMessage = async () => {
        const message = chatInput.value.trim();
        if (!message) return;

        // Add user message to UI
        appendMessage('user', message);
        chatInput.value = '';

        // Add loading state
        const loadingId = appendMessage('ai', 'Escribiendo...');

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message })
            });

            const data = await response.json();

            // Remove loading and add AI response
            const loadingMsg = document.getElementById(loadingId);
            if (loadingMsg) loadingMsg.remove();

            if (response.ok) {
                appendMessage('ai', data.text || 'Sin respuesta del servidor.');
            } else {
                appendMessage('ai', data.error || 'Lo siento, hubo un error al procesar tu mensaje.');
            }
        } catch (error) {
            console.error('Error in chat:', error);
            const loadingMsg = document.getElementById(loadingId);
            if (loadingMsg) loadingMsg.remove();
            appendMessage('ai', 'Error de conexión. Inténtalo más tarde.');
        }
    };

    const appendMessage = (sender, text) => {
        const msgDiv = document.createElement('div');
        const id = 'msg-' + Date.now();
        msgDiv.id = id;
        msgDiv.className = `message ${sender}`;
        msgDiv.textContent = text;
        chatMessages.appendChild(msgDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        return id;
    };

    sendChat.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });
});
