import { NextResponse } from "next/server";
import { classifyIntent } from "../../../utils/intentClassifier";
import weather from "@/modules/weather";
import stocks from "@/modules/stocks";
import fileManager from "@/modules/fileManager";

type ModuleFunction = (message: string) => Promise<any>;

const modules: Record<string, ModuleFunction> = {
	weather,
	stocks,
	fileManagement: fileManager,
};

export async function POST(req: Request) {
	try {
		const { message } = await req.json();

		// Classify intent using Ollama
		const intent = await classifyIntent(message);
		console.log(intent);
		console.log(modules[intent]);
		if (!intent || !modules[intent]) {
			return NextResponse.json({
				error: `Intent not recognized or unsupported: ${intent}`,
			});
		}

		// Call the respective module
		const response = await modules[intent](message);
		console.log(response);
		return NextResponse.json({ response });
	} catch (error) {
		console.error("Error in /api/chat:", error);
		return NextResponse.json({
			error: "An error occurred while processing your request.",
		});
	}
}
