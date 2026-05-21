import { useState } from "react";

export default function AICustomerServicePage() {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Namaste! Main AutoSell ka AI assistant hoon. Meesho, Flipkart, pricing, ya orders ke baare mein kuch bhi poocho!" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = { role: "user", content: input };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: "You are AutoSell AI assistant for Indian dropshippers. Help with Meesho, Flipkart, Amazon India, product pricing, order management, and dropshipping advice. Respond in Hinglish (Hindi-English mix). Be concise and practical.",
          messages: newMessages
        })
      });
      const data = await response.json();
      const reply = data.content[0].text;
      setMessages([...newMessages, { role: "assistant", content: reply }]);
    } catch (err) {
      setMessages([...newMessages, { role: "assistant", content: "Sorry, kuch error hua. Dobara try karo." }]);
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#030712", color: "white", display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "20px 24px", borderBottom: "1px solid #1f2937" }}>
        <h1 style={{ fontSize: "22px", fontWeight: "bold", margin: 0 }}>AI Support</h1>
        <p style={{ color: "#6b7280", margin: "4px 0 0", fontSize: "13px" }}>Powered by Claude AI</p>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px", display: "flex", flexDirection: "column", gap: "12px" }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start" }}>
            <div style={{
              maxWidth: "75%", padding: "12px 16px", borderRadius: "16px", fontSize: "14px", lineHeight: "1.5",
              background: msg.role === "user" ? "#7c3aed" : "#111827",
              color: "white"
            }}>
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: "flex", justifyContent: "flex-start" }}>
            <div style={{ background: "#111827", padding: "12px 16px", borderRadius: "16px", fontSize: "14px", color: "#6b7280" }}>
              Soch raha hoon...
            </div>
          </div>
        )}
      </div>

      <div style={{ padding: "16px 24px", borderTop: "1px solid #1f2937", display: "flex", gap: "12px" }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && sendMessage()}
          placeholder="Kuch bhi poocho..."
          style={{ flex: 1, background: "#111827", border: "1px solid #374151", borderRadius: "12px", padding: "12px 16px", color: "white", fontSize: "14px", outline: "none" }}
        />
        <button
          onClick={sendMessage}
          disabled={loading}
          style={{ background: "#7c3aed", color: "white", border: "none", borderRadius: "12px", padding: "12px 20px", fontSize: "14px", fontWeight: "600", cursor: "pointer" }}>
          Send
        </button>
      </div>
    </div>
  );
}
