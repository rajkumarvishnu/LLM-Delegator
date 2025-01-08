import axios from "axios";

const stocksPrompt = `
Provide stock prices and trends for given symbols.
`;

export default async function stocks(message: string) {
	const response = await axios.post("http://localhost:11434/api/chat", {
		model: "llama3.2:latest",

		messages: [
			{
				role: "system",
				content: "You are a stock market assistant. ",
			},
			{
				role: "user",
				content: `${stocksPrompt}\n${message}`,
			},
		],
		stream: false,
	});
	console.log(response?.data?.message?.content);

	return response?.data?.message?.content; // Extract stock data from Ollama's API response
}
