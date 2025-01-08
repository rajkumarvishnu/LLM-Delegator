"use client";

import { useState } from "react";

export default function ChatPage() {
	const [message, setMessage] = useState("");
	const [response, setResponse] = useState("");
	const [loading, setLoading] = useState(false);

	const sendMessage = async () => {
		if (!message.trim()) return;

		setLoading(true);
		setResponse(""); // Clear previous response
		try {
			const res = await fetch("/api/chat", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ message }),
			});
			const data = await res.json();
			setResponse(data.response || data.error);
		} catch (error) {
			setResponse("An error occurred. Please try again." + error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div
			style={{
				padding: "20px",
				fontFamily: "Arial",
				maxWidth: "800px",
				margin: "0 auto",
			}}
		>
			<h1 style={{ textAlign: "center" }}>Chatbot App</h1>
			<div style={{ marginBottom: "20px" }}>
				<textarea
					value={message}
					onChange={(e) => setMessage(e.target.value)}
					placeholder="Type your message..."
					rows={4}
					cols={50}
					style={{
						width: "100%",
						padding: "10px",
						fontSize: "16px",
						borderRadius: "5px",
						border: "1px solid #ccc",
					}}
				/>
			</div>
			<button
				onClick={sendMessage}
				disabled={loading}
				style={{
					padding: "10px 20px",
					fontSize: "16px",
					backgroundColor: "#0070f3",
					color: "white",
					border: "none",
					borderRadius: "5px",
					cursor: loading ? "not-allowed" : "pointer",
				}}
			>
				{loading ? "Loading..." : "Send"}
			</button>
			<div style={{ marginTop: "20px", fontSize: "16px" }}>
				<strong>Response:</strong>
				<div
					style={{
						marginTop: "10px",
						padding: "10px",
						backgroundColor: "transparent",
						borderRadius: "5px",
						border: "1px solid #ddd",
						whiteSpace: "pre-wrap",
					}}
				>
					{response || "No response yet."}
				</div>
			</div>
		</div>
	);
}
