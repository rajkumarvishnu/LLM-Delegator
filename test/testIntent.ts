import { classifyIntent } from "../utils/intentClassifier"; // Adjust the import path if needed

const testQuery = "What's the weather like in New York?";

classifyIntent(testQuery)
	.then((intent) => {
		console.log("Detected Intent:", intent);
	})
	.catch((error) => {
		console.error("Error during intent classification:", error);
	});
