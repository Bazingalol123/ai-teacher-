// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const userScreen = document.getElementById('user-screen');
    const createUserScreen = document.getElementById('create-user-screen');
    const welcomeScreen = document.getElementById('welcome-screen');
    const chatScreen = document.getElementById('chat-screen');
    const createUserBtn = document.getElementById('create-user-btn');
    const createUserForm = document.getElementById('create-user-form');
    const backToUsersBtn = document.getElementById('back-to-users');
    const usersList = document.getElementById('users-list');
    const chatMessages = document.getElementById('chat-messages');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-message');
    const loadingIndicator = document.getElementById('loading-indicator');

    // User session data
    let currentUser = null;
    let subjectMetadata = {};

    // Load subject metadata
    async function loadSubjectMetadata() {
        try {
            const response = await fetch('learning-paths.json');
            const data = await response.json();
            subjectMetadata = data.subjects;
        } catch (error) {
            console.error('Error loading subject metadata:', error);
        }
    }

    // Load users from localStorage
    function loadUsers() {
        try {
            const usersData = localStorage.getItem('aiTeacherUsers');
            return usersData ? JSON.parse(usersData) : [];
        } catch (error) {
            console.error('Error loading users:', error);
            return [];
        }
    }

    // Save users to localStorage
    function saveUsers(users) {
        try {
            localStorage.setItem('aiTeacherUsers', JSON.stringify(users));
            return true;
        } catch (error) {
            console.error('Error saving users:', error);
            return false;
        }
    }

    // Display users in the list
    function displayUsers() {
        const users = loadUsers();
        usersList.innerHTML = '';
        
        if (users.length === 0) {
            usersList.innerHTML = '<p>No users found. Please create a new user.</p>';
            return;
        }

        users.forEach(user => {
            const userCard = document.createElement('div');
            userCard.className = 'user-card';
            userCard.innerHTML = `
                <h4>${user.name}</h4>
                <p>Learning Progress: ${Object.keys(user.learningProgress || {}).join(', ') || 'No subjects started'}</p>
            `;
            userCard.addEventListener('click', () => selectUser(user));
            usersList.appendChild(userCard);
        });
    }

    // Handle user selection
    function selectUser(user) {
        currentUser = user;
        if (!currentUser.learningProgress) {
            currentUser.learningProgress = {};
        }
        userScreen.classList.remove('active');
        welcomeScreen.classList.add('active');
    }

    // Handle user creation
    createUserForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const userName = document.getElementById('user-name').value;
        
        const users = loadUsers();
        const newUser = {
            id: `user${Date.now()}`,
            name: userName,
            learningProgress: {}
        };
        
        users.push(newUser);
        saveUsers(users);
        
        currentUser = newUser;
        createUserScreen.classList.remove('active');
        welcomeScreen.classList.add('active');
    });

    // Navigation between screens
    createUserBtn.addEventListener('click', () => {
        userScreen.classList.remove('active');
        createUserScreen.classList.add('active');
    });

    backToUsersBtn.addEventListener('click', () => {
        createUserScreen.classList.remove('active');
        userScreen.classList.add('active');
    });

    // Handle initial form submission
    document.getElementById('initial-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const subject = document.getElementById('subject').value;
        const level = document.getElementById('level').value;
        const learningStyle = document.getElementById('learning-style').value;

        // Initialize or update learning progress
        if (!currentUser.learningProgress[subject]) {
            currentUser.learningProgress[subject] = {
                level,
                learningStyle,
                lastSession: new Date().toISOString(),
                conversations: []
            };
        }

        // Save updated user data
        const users = loadUsers();
        const userIndex = users.findIndex(u => u.id === currentUser.id);
        if (userIndex !== -1) {
            users[userIndex] = currentUser;
            saveUsers(users);
        }

        // Switch to chat screen
        welcomeScreen.classList.remove('active');
        chatScreen.classList.add('active');

        // Start the learning session
        await initializeLearningSession(subject, level, learningStyle);
    });

    async function initializeLearningSession(subject, level, learningStyle) {
        const metadata = subjectMetadata[subject] || {};
        const systemMessage = `You are an expert ${subject} teacher with years of industry experience. Your teaching approach is highly interactive and hands-on.

Role: Senior ${subject} Developer & Technical Mentor
Teaching Style: ${learningStyle} focused, project-based learning
Student Level: ${level}

CONTEXT:
Prerequisites Required: ${metadata.prerequisites?.join(', ') || 'None'}
Core Topics: ${metadata.keyTopics?.join(', ') || 'Flexible curriculum'}
Project Focus: ${metadata.projectTypes?.join(', ') || 'Various projects'}

TEACHING GUIDELINES:
1. Start each topic with a real-world problem to solve
2. Break down complex concepts into digestible chunks
3. Provide code examples that students can run immediately
4. After each concept, give a small coding challenge
5. Use analogies and visual explanations when possible
6. Encourage experimentation and learning from mistakes

INTERACTION RULES:
1. Keep explanations under 4-5 sentences
2. Always include practical code examples using \`\`\`jsx
3. After each explanation, ask a specific question
4. Provide immediate feedback on student's code
5. Use emojis to make interactions more engaging
6. Format important points with **bold** and *italic*

LEARNING PATH STRUCTURE:
1. Concept Introduction (2-3 sentences)
2. Real-World Example
3. Code Demonstration
4. Practice Challenge
5. Knowledge Check
6. Project Integration

Current Learning Goals:
${metadata.keyTopics?.map(topic => `- Master ${topic}`).join('\n') || 'Custom learning path'}

Begin by:
1. Introducing yourself as an experienced developer
2. Asking about their specific project goals
3. Checking their experience with ${metadata.prerequisites?.join(', ')}
4. Suggesting a practical project they can build while learning

Remember: Focus on ${learningStyle} learning style - provide lots of hands-on exercises and real-time coding challenges.`;

        addMessage(systemMessage, 'ai');
    }

    // Handle chat messages
    sendButton.addEventListener('click', handleMessage);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleMessage();
        }
    });

    function handleMessage() {
        const message = userInput.value.trim();
        if (!message) return;

        addMessage(message, 'user');
        userInput.value = '';
        processUserMessage(message);
    }

    function addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', `${sender}-message`);
        
        // Enhanced markdown-style formatting
        let formattedText = text
            // Code blocks with language support
            .replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => 
                `<pre><code class="language-${lang || 'plaintext'}">${code.trim()}</code></pre>`)
            // Inline code
            .replace(/`([^`]+)`/g, '<code>$1</code>')
            // Headers
            .replace(/### (.*?)\n/g, '<h3>$1</h3>')
            .replace(/## (.*?)\n/g, '<h2>$1</h2>')
            .replace(/# (.*?)\n/g, '<h1>$1</h1>')
            // Bold and italic
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            // Lists
            .replace(/^\s*[-*+]\s+(.*)/gm, '<li>$1</li>')
            .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')
            .replace(/^\d+\.\s+(.*)/gm, '<li>$1</li>')
            .replace(/(<li>.*<\/li>)/s, '<ol>$1</ol>')
            // Links
            .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>')
            // Tables
            .replace(/\|(.+)\|/g, '<td>$1</td>')
            .replace(/(<td>.+<\/td>)/g, '<tr>$1</tr>')
            .replace(/(<tr>.+<\/tr>)/g, '<table>$1</table>')
            // Emojis (common ones)
            .replace(/:smile:/g, '😊')
            .replace(/:thumbsup:/g, '👍')
            .replace(/:rocket:/g, '🚀')
            .replace(/:bulb:/g, '💡')
            .replace(/:warning:/g, '⚠️')
            .replace(/:check:/g, '✅')
            // Line breaks
            .replace(/\n/g, '<br>');

        messageDiv.innerHTML = formattedText;

        // Add syntax highlighting for code blocks
        if (messageDiv.querySelectorAll('code').length > 0) {
            // Add Prism.js for syntax highlighting if not already added
            if (!document.getElementById('prism-css')) {
                const prismCss = document.createElement('link');
                prismCss.id = 'prism-css';
                prismCss.rel = 'stylesheet';
                prismCss.href = 'https://cdnjs.cloudflare.com/ajax/libs/prism/1.24.1/themes/prism-tomorrow.min.css';
                document.head.appendChild(prismCss);

                const prismJs = document.createElement('script');
                prismJs.id = 'prism-js';
                prismJs.src = 'https://cdnjs.cloudflare.com/ajax/libs/prism/1.24.1/prism.min.js';
                document.body.appendChild(prismJs);

                // Add JSX support
                const prismJsx = document.createElement('script');
                prismJsx.src = 'https://cdnjs.cloudflare.com/ajax/libs/prism/1.24.1/components/prism-jsx.min.js';
                document.body.appendChild(prismJsx);
            }

            // Apply highlighting
            setTimeout(() => {
                if (window.Prism) {
                    messageDiv.querySelectorAll('code').forEach(block => {
                        Prism.highlightElement(block);
                    });
                }
            }, 100);
        }

        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;

        // Save to user's learning progress
        const subject = document.getElementById('subject').value;
        if (currentUser.learningProgress[subject]) {
            currentUser.learningProgress[subject].conversations.push({
                sender,
                text,
                timestamp: new Date().toISOString()
            });
            
            // Save progress
            const users = loadUsers();
            const userIndex = users.findIndex(u => u.id === currentUser.id);
            if (userIndex !== -1) {
                users[userIndex] = currentUser;
                saveUsers(users);
            }
        }
    }

    async function processUserMessage(message) {
        loadingIndicator.classList.add('active');
        
        try {
            const response = await callOpenAI(message);
            addMessage(response, 'ai');
        } catch (error) {
            console.error('Error:', error);
            addMessage("I'm sorry, I encountered an error. Please try again.", 'ai');
        } finally {
            loadingIndicator.classList.remove('active');
        }
    }

    async function callOpenAI(message) {
       
        
        const apiKey = "your-api-key-here";
        
        const subject = document.getElementById('subject').value;
        const learningProgress = currentUser.learningProgress[subject];
        
        // Get recent conversation history (last 10 messages)
        const recentConversations = learningProgress.conversations.slice(-10);
        
        // Create a dynamic system message based on conversation context
        const contextMessage = `Current Teaching Context:
- Subject: ${subject}
- Student Level: ${learningProgress.level}
- Learning Style: ${learningProgress.learningStyle}
- Session Progress: ${recentConversations.length} interactions
- Last Topic: ${recentConversations.length > 0 ? 'Building on previous discussion' : 'Starting fresh'}

Teaching Approach:
1. Keep responses focused and practical
2. Include runnable code examples
3. Ask engaging questions
4. Provide immediate feedback
5. Suggest next steps

Remember to:
- Format code with proper syntax highlighting
- Use markdown for better readability
- Keep explanations concise
- Encourage hands-on practice
- Validate understanding before moving on`;

        const messages = [
            {
                role: "system",
                content: contextMessage
            },
            ...recentConversations.map(msg => ({
                role: msg.sender === 'user' ? 'user' : 'assistant',
                content: msg.text
            })),
            {
                role: "user",
                content: message
            }
        ];

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: messages,
                temperature: 0.7,
                max_tokens: 2000,
                presence_penalty: 0.6,
                frequency_penalty: 0.5
            })
        });

        const data = await response.json();
        return data.choices[0].message.content;
    }

    // Initialize the application
    displayUsers();
    loadSubjectMetadata();
}); 