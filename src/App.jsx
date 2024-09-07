import { useState } from 'react';
import './index.css';

const API_KEY = "YOUR_API_KEY_HERE";

const systemMessage = {
  "role": "system", "content": "Explain things like you're talking to a software professional with 2 years of experience."
}

function App() {
  const [messages, setMessages] = useState([
    {
      message: "Hello, I'm ChatGPT! Ask me anything!",
      sender: "ChatGPT"
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const newMessage = {
      message: inputValue,
      sender: "user"
    };

    const newMessages = [...messages, newMessage];
    setMessages(newMessages);
    setInputValue("");
    setIsTyping(true);
    await processMessageToChatGPT(newMessages);
  };

  async function processMessageToChatGPT(chatMessages) {
    let apiMessages = chatMessages.map((messageObject) => {
      let role = messageObject.sender === "ChatGPT" ? "assistant" : "user";
      return { role: role, content: messageObject.message }
    });

    const apiRequestBody = {
      "model": "gpt-3.5-turbo",
      "messages": [
        systemMessage,
        ...apiMessages
      ]
    }

    await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + API_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(apiRequestBody)
    }).then((data) => {
      return data.json();
    }).then((data) => {
      setMessages([...chatMessages, {
        message: data.choices[0].message.content,
        sender: "ChatGPT"
      }]);
      setIsTyping(false);
    });
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-r from-blue-500 to-purple-500">
      <div className="flex-grow p-4 overflow-y-auto backdrop-blur-md bg-white/30 rounded-lg shadow-lg">
        <div className="flex flex-col space-y-4">
          {messages.map((message, i) => (
            <div key={i} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"} animate-fadeIn`}>
              <div className={`p-2 rounded-lg max-w-xs ${message.sender === "user" ? "bg-blue-500 text-white" : "bg-gray-300 text-black"}`}>
                {message.message}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start  animate-fadeIn">
              <div className="p-2 rounded-lg bg-gray-300 text-black max-w-xs">ChatGPT is typing...</div>
            </div>
          )}
        </div>
      </div>
      <div className="p-4 bg-white/50 backdrop-blur-md border-t border-gray-300 rounded-b-lg">
        <div className="flex">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type a message..."
            className="flex-grow p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSend}
            className="ml-2 p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none transition duration-300 ease-in-out transform hover:scale-105"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;