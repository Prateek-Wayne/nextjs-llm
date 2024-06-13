import {
    StreamingTextResponse,
    createStreamDataTransformer
} from 'ai';
import { ChatCohere } from '@langchain/cohere';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { HttpResponseOutputParser } from 'langchain/output_parsers';
import { RunnableLike } from 'langchain/runnables';
import { AIMessageChunk } from 'langchain/schema';

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
    try {
        // Extract the `messages` from the body of the request
        const { messages } = await req.json();
        const message = messages.at(-1).content;

        // Create the prompt template with Cohere
        const prompt = ChatPromptTemplate.fromMessages([
            ["ai", "You are a helpful assistant"],
            ["human", "{input}"]
        ]);

        // Initialize the Cohere model
        const model = new ChatCohere({
            apiKey: process.env.COHERE_API_KEY!,
            model: 'command', // Default Cohere model
        });

        /**
         * Chat models stream message chunks rather than bytes, so this
         * output parser handles serialization and encoding.
         */
        const parser = new HttpResponseOutputParser();

        // const chain = prompt.pipe(model).pipe(parser);
        const chain=prompt.pipe(model as RunnableLike<any, AIMessageChunk>).pipe(parser);

        // Convert the response into a friendly text-stream
        const stream = await chain.stream({ input: message });

        // Respond with the stream
        return new StreamingTextResponse(
            stream.pipeThrough(createStreamDataTransformer()),
        );
    } catch (e: any) {
        return Response.json({ error: e.message }, { status: e.status ?? 500 });
    }
}
