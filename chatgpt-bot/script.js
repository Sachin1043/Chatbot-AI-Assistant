// Gemini API Configuration
const API_KEY = "AIzaSyAt149CIT6Nhw9FSXTSZGKNLbqXKfLkSCQ";
const API_URL =
  "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent";

// DOM Element Selectors
const chatbotPopup = document.querySelector(".chatbot-popup");
const closeChatbotBtn = document.getElementById("close-chatbot");
const messageInput = document.getElementById("message-input");
const sendMessageBtn = document.getElementById("send-message");
const chatBody = document.querySelector(".chat-body");

// Event Listeners
document.addEventListener("DOMContentLoaded", () => {
  closeChatbotBtn.addEventListener("click", toggleChatbot);
  sendMessageBtn.addEventListener("click", handleMessageSend);
  messageInput.addEventListener("keypress", handleKeyPress);
});

// Toggle Chatbot Visibility
function toggleChatbot() {
  chatbotPopup.classList.toggle("show-chatbot");
}

// Handle Message Send
// Handle Message Send
async function handleMessageSend(event) {
  event.preventDefault();
  const userMessage = messageInput.value.trim().toLowerCase();
  if (!userMessage) return;

  addMessageToChatBody(userMessage, "user");
  messageInput.value = "";

  // Predefined responses
  const predefinedResponses = {
    "who built you ": "I was built by Sachin. He created and trained me!",
    "who made you": "Sachin made me. I am Senio, created to assist you!",
    "what is your name": "My name is Senio, your AI assistant!",
    "What is your name": "My name is Senio, your AI assistant!",
    "what is ur name": "My name is Senio, your AI assistant!",
    "What is ur name": "My name is Senio, your AI assistant!",
    "ur name": "My name is Senio, your AI assistant!",
    "your name is": "My name is Senio, your AI assistant!",
    "Your name is": "My name is Senio, your AI assistant!",
    "who are you": "I'm Senio, created by Sachin to help you!",
    "who built u": "I was built by Sachin. He created and trained me!",
    "who build u": "I was built by Sachin. He created and trained me!",
  };

  // Check for predefined responses
  for (const key in predefinedResponses) {
    if (userMessage.includes(key)) {
      addMessageToChatBody(predefinedResponses[key], "bot");
      return;
    }
  }

  try {
    const aiResponse = await getGeminiResponse(userMessage);
    addMessageToChatBody(aiResponse, "bot");
  } catch (error) {
    console.error("Error getting AI response:", error);
    addMessageToChatBody("Sorry, something went wrong.", "bot");
  }
}

// Handle Enter Key for Sending Messages
function handleKeyPress(event) {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    sendMessageBtn.click();
  }
}

// Add Message to Chat Body
function addMessageToChatBody(message, sender) {
  const messageElement = document.createElement("div");
  messageElement.classList.add("message", `${sender}-message`);

  if (sender === "bot") {
    messageElement.innerHTML = `
      <div>
        <span class="bot-avatar" style="font-size: 40px;">🤖</span>
      </div>
      <div class="message-text">${message}</div>
    `;
  } else {
    messageElement.innerHTML = `<div class="message-text">${message}</div>`;
  }

  chatBody.appendChild(messageElement);
  chatBody.scrollTop = chatBody.scrollHeight;
}

// Get Response from Gemini API
// Get Response from Gemini API
async function getGeminiResponse(userMessage) {
  try {
    const response = await fetch(`${API_URL}?key=${API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: userMessage }] }],
        generationConfig: { max_output_tokens: 50 }, // Limit response length
      }),
    });

    if (!response.ok)
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    const data = await response.json();
    return (
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No response available."
    );
  } catch (error) {
    console.error("Error in Gemini API request:", error);
    return "I'm having trouble understanding right now.";
  }
}
