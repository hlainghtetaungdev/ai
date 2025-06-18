const API_KEY = "AIzaSyCtcrDMmiuphAcYa-UZBWwLGzbJymwD2To";
    const chat = document.getElementById("chat");
    const userInput = document.getElementById("userInput");
    const botAvatar = "image.png";
    let typingMsg = null;

    function toggleMode() {
      document.body.classList.toggle("light-mode");
      localStorage.setItem("mode", document.body.classList.contains("light-mode") ? "light" : "dark");
    }

    function addMessage(text, className, avatar = null) {
      const msgContainer = document.createElement("div");
      msgContainer.className = "message " + className;

      if (avatar) {
        const img = document.createElement("img");
        img.className = "avatar";
        img.src = avatar;
        msgContainer.appendChild(img);
      }

      const bubble = document.createElement("div");
      bubble.className = "bubble";
      bubble.textContent = text;
      msgContainer.appendChild(bubble);
      chat.appendChild(msgContainer);
      chat.scrollTop = chat.scrollHeight;
    }

    function showTyping() {
      typingMsg = document.createElement("div");
      typingMsg.className = "typing ai";
      typingMsg.textContent = "Hlaing Htet is typing...";
      chat.appendChild(typingMsg);
      chat.scrollTop = chat.scrollHeight;
    }

    function hideTyping() {
      if (typingMsg) {
        typingMsg.remove();
        typingMsg = null;
      }
    }

    async function sendMessage() {
      const input = userInput.value.trim();
      if (!input) return;

      addMessage(input, "user");
      userInput.value = "";
      showTyping();

      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              contents: [
                {
                  parts: [
                    {
                      text: input,
                    },
                  ],
                },
              ],
            }),
          }
        );

        const data = await response.json();
        hideTyping();
        const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response from AI.";
        addMessage(reply, "ai", botAvatar);
        saveConversation(input, reply);
      } catch (error) {
        console.error("Error:", error);
        hideTyping();
        addMessage("Error contacting AI API.", "ai", botAvatar);
      }
    }

    function saveConversation(userText, botText) {
      const history = JSON.parse(localStorage.getItem("chatHistory")) || [];
      history.push({ user: userText, bot: botText });
      localStorage.setItem("chatHistory", JSON.stringify(history));
    }

    function loadConversation() {
      const history = JSON.parse(localStorage.getItem("chatHistory")) || [];
      history.forEach(entry => {
        addMessage(entry.user, "user");
        addMessage(entry.bot, "ai", botAvatar);
      });
    }

    userInput.addEventListener("keypress", function (e) {
      if (e.key === "Enter") sendMessage();
    });

    window.onload = () => {
      if (localStorage.getItem("mode") === "light") {
        document.body.classList.add("light-mode");
      }
      loadConversation();
      const welcome = "မင်္ဂလာပါ....HHA Ai ကနေကြိုဆိုလိုက်ပါတယ်။ သင်သိလိုသမျှ မေးမြန်းနိုင်ပါတယ်။";
      addMessage(welcome, "ai", botAvatar);
    };