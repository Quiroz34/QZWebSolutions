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

    // Gestionar Session ID
    let sessionId = localStorage.getItem('qz_chat_session');
    if (!sessionId) {
        sessionId = 'sess-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('qz_chat_session', sessionId);
    }
    console.log('Session ID:', sessionId);

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
                body: JSON.stringify({ message, sessionId })
            });

            const data = await response.json();

            // Remove loading and add AI response
            const loadingMsg = document.getElementById(loadingId);
            if (loadingMsg) loadingMsg.remove();

            if (response.ok) {
                // Si la librería marked está disponible, convertir Markdown a HTML
                const finalHtml = typeof marked !== 'undefined' ? marked.parse(data.text || '') : (data.text || 'Sin respuesta.');
                appendMessage('ai', finalHtml, true);
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

    const appendMessage = (sender, content, isHtml = false) => {
        const msgDiv = document.createElement('div');
        const id = 'msg-' + Date.now();
        msgDiv.id = id;
        msgDiv.className = `message ${sender}`;
        
        if (isHtml) {
            msgDiv.innerHTML = content;
        } else {
            msgDiv.textContent = content;
        }

        chatMessages.appendChild(msgDiv);
        
        // Smooth scroll to bottom
        chatMessages.scrollTo({
            top: chatMessages.scrollHeight,
            behavior: 'smooth'
        });
        
        return id;
    };

    sendChat.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });
});
