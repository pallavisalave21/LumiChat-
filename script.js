const API_KEY = "AIzaSyDGG1BT9A5vsh2k-4Dy7k0-y_UhACbJJl0"; // optional

const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;

const chatDisplay = document.getElementById("chat-box");
const userInputField = document.getElementById("user-input");
const submitButton = document.getElementById("send-btn");

async function sendMessage() {
    const userMessageText = userInputField.value.trim();
    if (userMessageText === "") return;

    createChatBubble(userMessageText, "user");
    userInputField.value = "";

    const loadingId = showLoading();

    try {
        const responseData = await fetchAIResponse(userMessageText);
        removeLoading(loadingId);

        let reply;

        if (responseData.candidates && responseData.candidates[0]?.content?.parts?.[0]?.text) {
            reply = responseData.candidates[0].content.parts[0].text;
        } else {
            reply = fallbackReply(userMessageText);
        }

        createChatBubble(reply, "bot");

    } catch (err) {
        removeLoading(loadingId);
        createChatBubble(fallbackReply(userMessageText), "bot");
    }

    scrollToBottom();
}

async function fetchAIResponse(userQuery) {
    const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            contents: [{ parts: [{ text: userQuery }] }]
        })
    });
    return await response.json();
}

/* ✅ CLEAN CHAT BUBBLE (NO You/AI text) */
function createChatBubble(text, senderType) {
    const row = document.createElement("div");
    row.className = `chat-row ${senderType}`;

    row.innerHTML = `
        <div class="bubble ${senderType}">
            ${text}
        </div>
    `;

    chatDisplay.appendChild(row);
}

/* loading */
function showLoading() {
    const id = "loading-" + Date.now();
    const row = document.createElement("div");
    row.className = "chat-row bot";
    row.id = id;

    row.innerHTML = `
        <div class="bubble bot">Typing...</div>
    `;

    chatDisplay.appendChild(row);
    return id;
}

function removeLoading(id) {
    const el = document.getElementById(id);
    if (el) el.remove();
}

function scrollToBottom() {
    chatDisplay.scrollTop = chatDisplay.scrollHeight;
}

/* fallback (if API fails) */
function fallbackReply(msg) {
    msg = msg.toLowerCase();

    if (msg.includes("hi")) return "Heyyy 💖";
    if (msg.includes("name")) return "I'm LumiChat ✨";
    if (msg.includes("how are you")) return "I'm doing amazing 😌";

    return "I'm having connection issues 😅 but I'm still here!";
}

/* events */
submitButton.addEventListener("click", sendMessage);

userInputField.addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendMessage();
});
