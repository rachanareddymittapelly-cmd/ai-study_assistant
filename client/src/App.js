import { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [message, setMessage] = useState('');
  const [chatLog, setChatLog] = useState([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!message.trim()) return;
    
    const userMsg = { role: 'user', content: message };
    setChatLog(prev => [...prev, userMsg]);
    setMessage('');
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:5000/api/chat', {
        message: message
      });
      
      const aiMsg = { role: 'ai', content: res.data.reply };
      setChatLog(prev => [...prev, aiMsg]);
    } catch (err) {
      setChatLog(prev => [...prev, { role: 'ai', content: 'Error: Is backend running on port 5000?' }]);
    }
    setLoading(false);
  };

  return (
    <div className="App">
      <h1>AI Study Assistant</h1>
      
      <div className="chat-box">
        {chatLog.length === 0 && <div className="msg ai">Hey! Ask me anything about your studies.</div>}
        {chatLog.map((msg, i) => (
          <div key={i} className={`msg ${msg.role}`}>
            <strong>{msg.role === 'user' ? 'You' : 'AI'}:</strong> {msg.content}
          </div>
        ))}
        {loading && <div className="msg ai">AI is thinking...</div>}
      </div>

      <div className="input-area">
        <input 
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Ask me anything..."
        />
        <button onClick={sendMessage} disabled={loading}>Send</button>
      </div>
    </div>
  );
}

export default App;