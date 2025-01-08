import axios from "axios";
/*
const weatherPrompt = `
You are a weather assistant. Provide detailed weather information for any given location.
`;
*/

const weatherPrompt = `
You'll get weather information of places.
`;

export default async function weather(message: string) {
	console.log("Weather func called");

	const response = await axios.post("http://localhost:11434/api/chat", {
		model: "llama3.2:latest",

		messages: [
			{
				role: "system",
				content: "You're a weather bot",
			},
			{
				role: "user",
				content: `${weatherPrompt}\n${message}`,
			},
		],
		stream: false,
	});
	console.log(response?.data?.message?.content);

	return response?.data?.message?.content; // Extract weather data from Ollama's API response
}
