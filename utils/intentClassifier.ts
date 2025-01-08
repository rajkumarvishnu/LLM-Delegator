import axios from "axios";

const intentClassifierPrompt = `You are an intent classifier for a chatbot. The chatbot has the following capabilities: Weather, Stocks, and File Management. Based on the user query, respond with a JSON object containing a single intent field (without quotes around 'intent') with one of these values: 'weather', 'stocks', 'fileManagement', or 'unknown'.\n\nUser Query: {query}\n\nRespond with only the JSON object in this format (without quotes around 'intent'): {intent: \"<intent>\"}`;

export async function classifyIntent(query: string): Promise<string> {
	try {
		const prompt = intentClassifierPrompt.replace("{query}", query);

		console.log("Prompt: ", prompt);

		const response = await axios.post("http://localhost:11434/api/chat", {
			model: "llama3.2:latest",
			messages: [
				{
					role: "system",
					content:
						"You are a JSON-only response bot. You must only respond with valid JSON, no other text or explanation.",
				},
				{
					role: "user",
					content: prompt,
				},
			],
			stream: false,
		});

		// Log the raw response for debugging
		console.log("Raw Response:", response.data);

		// Extract the result
		let result = response.data?.message?.content?.trim();
		console.log("Trimmed Response:", result);
		try {
			const parsedResult = JSON.parse(result);
			result = parsedResult.intent?.toLowerCase();
		} catch (error) {
			console.error("Error parsing JSON:", error);
			return "unknown";
		}
		console.log("Parsed Intent:", result);

		// Validate the result and return it
		if (
			!result ||
			!["weather", "stocks", "filemanagement", "unknown"].includes(result)
		) {
			console.warn(
				"Unexpected or blank response, defaulting to 'unknown'."
			);
			return "unknown";
		}
		console.log("Intent Result 2: ", result);
		return result;
	} catch (error) {
		console.error(
			"Error classifying intent:",
			error?.response?.data || error.message
		);
		return "unknown";
	}
}
