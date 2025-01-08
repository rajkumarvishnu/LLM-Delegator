import axios from "axios";

const fileManagerPrompt = `
You are a file management assistant. Help with uploading, downloading, and organizing files.
`;

export default async function fileManager(message: string) {
	const response = await axios.post("http://localhost:11434/api/chat", {
		model: "llama3.2:latest",

		messages: [
			{
				role: "system",
				content:
					"You are a file management assistant. Help with uploading, downloading, and organizing files.",
			},
			{
				role: "user",
				content: `${fileManagerPrompt}\n${message}`,
			},
		],
		stream: false,
	});
	console.log(response?.data);
	return response?.data?.message?.content;
	//return response.data.response; // Extract file management info from Ollama's API response
}
