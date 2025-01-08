This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.


# README

## Project Overview

This project implements a delegator model for handling various intents using Large Language Models (LLMs). The architecture is designed to classify user intents and delegate the processing to the appropriate module. The project is structured to be scalable and maintainable, allowing easy addition of new modules as needed.

## Project Structure

```
mia_core/
    .gitignore
    
    app/
        api/
        favicon.ico
        globals.css
        layout.tsx
        page.tsx
    eslint.config.mjs
    modules/
        fileManager.ts
        weather.ts
        stocks.ts
    next-env.d.ts
    next.config.ts
    package.json
    postcss.config.mjs
    public/
    tailwind.config.ts
    test/
    tsconfig.json
    utils/
        intentClassifier.ts
```

## Architecture

### 1. Intent Classification

The intent classification is handled by the `classifyIntent` function located in [`utils/intentClassifier.ts`](utils/intentClassifier.ts). This function takes a user message as input and returns the classified intent.

### 2. Modules

The project includes several modules that handle specific intents. Each module exports a function that processes the message related to its intent. The modules are located in the [`modules`](modules) directory:
- [`fileManager.ts`](modules/fileManager.ts)
- [`weather.ts`](modules/weather.ts)
- [`stocks.ts`](modules/stocks.ts)

### 3. Delegator

The delegator is implemented in the [`route.ts`](app/api/route.ts) file. It receives the user request, classifies the intent, and delegates the processing to the appropriate module based on the classified intent.

#### Example Code Snippet from `route.ts`

```typescript
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
        if (!intent || !modules[intent]) {
            return NextResponse.json({
                error: `Intent not recognized or unsupported: ${intent}`,
            });
        }

        // Call the respective module
        const response = await modules[intent](message);
        return NextResponse.json(response);
    } catch (error) {
        return NextResponse.json({ error: error.message });
    }
}
```

## Adding New Modules

To add a new module:
1. Create a new file in the [`modules`](modules) directory.
2. Export a function that processes the message related to the new intent.
3. Update the `modules` object in [`route.ts`](app/api/route.ts) to include the new module.

Example:

```typescript
import newModule from "@/modules/newModule";

const modules: Record<string, ModuleFunction> = {
    weather,
    stocks,
    fileManagement: fileManager,
    newIntent: newModule,
};
```

## Conclusion

This architecture allows for easy scalability and maintainability by separating the concerns of intent classification and intent handling. Each module is responsible for processing a specific intent, making the system modular and extensible.
