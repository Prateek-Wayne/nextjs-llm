import {
  Message as VercelChatMessage,
  StreamingTextResponse,
  createStreamDataTransformer,
  OpenAIStream,
} from "ai";
import { ChatCohere } from "@langchain/cohere";
import { HumanMessage } from "@langchain/core/messages";
import { JSONLoader } from "langchain/document_loaders/fs/json";
import { CharacterTextSplitter } from "langchain/text_splitter";
import { RunnableLike } from "langchain/runnables";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { HttpResponseOutputParser } from "langchain/output_parsers";
import { AIMessageChunk } from "langchain/schema";
import { Snippet } from "next/font/google";

const loader = new JSONLoader("src/data/states.json", [
  "/state",
  "/code",
  "/nickname",
  "/website",
  "/admission_date",
  "/admission_number",
  "/capital_city",
  "/capital_url",
  "/population",
  "/population_rank",
  "/constitution_url",
  "/twitter_url",
]);

export const dynamic = "force-dynamic";

/**
 * Basic memory formatter that stringifies and passes
 * message history directly into the model.
 */
const formatMessage = (message: VercelChatMessage) => {
  return `${message.role}: ${message.content}`;
};

export async function POST(req: Request) {
  try {
    // Extract the `messages` from the body of the request
    const { messages } = await req.json();

    const formattedPreviousMessages = messages.slice(0, -1).map(formatMessage);

    const currentMessageContent = messages.at(-1).content;

    const model = new ChatCohere({
      apiKey: process.env.COHERE_API_KEY, // Default
      model: "command", // Default
    });
    console.log(`Messages: ${JSON.stringify(currentMessageContent)}`);

    // const documents = [
    //   {
    //     title: "Harrison's work",
    //     snippet: "Harrison worked at Kensho as an engineer.",
    //   },
    //   {
    //     title: "Harrison's work duration",
    //     snippet: "Harrison worked at Kensho for 3 years.",
    //   },
    //   {
    //     title: "Polar berars in the Appalachian Mountains",
    //     snippet:
    //       "Polar bears have surprisingly adapted to the Appalachian Mountains, thriving in the diverse, forested terrain despite their traditional arctic habitat. This unique situation has sparked significant interest and study in climate adaptability and wildlife behavior.",
    //   },
    // ];
    const documents = [
      {
        title: "Harrison's work",
        snippet: "Harrison worked at Twitch as an engineer.",
      },
      {
        title: "Harrison's work duration",
        snippet: "Harrison worked at Twitch for 3 years.",
      },
      {
        title:'Philips Healthcare',
        snippet:"Philips is a bangalore based startup"
      },
      {
          title: "MRI Scan Procedure",
          snippet: "An MRI scan uses powerful magnets and radio waves to create detailed images of the inside of the body. It is commonly used to examine the brain, spine, joints, and soft tissues.",
      },
      {
          title: "CT Scan Usage",
          snippet: "A CT scan combines X-ray images taken from different angles to create cross-sectional images of bones, blood vessels, and soft tissues. It is often used for diagnosing cancer, heart disease, and internal injuries.",
      },
      {
          title: "Ultrasound in Pregnancy",
          snippet: "Ultrasound imaging uses high-frequency sound waves to capture live images from the inside of the body. It is widely used in obstetrics to monitor the development of the fetus during pregnancy.",
      },
      {
          title: "Radiation Safety",
          snippet: "Radiologists and radiologic technologists follow strict safety protocols to minimize exposure to ionizing radiation. Protective measures include lead aprons, thyroid shields, and dosimeters to monitor radiation levels.",
      },
      {
          title: "X-ray Interpretation",
          snippet: "X-rays are a quick and painless procedure used to view the inside of the body, particularly bones and joints. Radiologists are trained to interpret X-ray images to diagnose fractures, infections, and other conditions.",
      },
  ];
  
    const prompt = ChatPromptTemplate.fromMessages([
      ["ai", "You are a helpful assistant"],
      ["human", "{input}"],
    ]);
    const parser = new HttpResponseOutputParser();

    // const chain = prompt.pipe(model).pipe(parser);
    const chain = prompt
      .pipe(model as RunnableLike<any, AIMessageChunk>)
      .pipe(parser);

    const response = await model.invoke(
      [new HumanMessage(currentMessageContent)],
      {
        documents,
      }
    );
    const stream = await chain.stream({
      chat_history: formattedPreviousMessages.join('\n'),
      input: currentMessageContent,
  });
    console.log("Imnside the Route4 ", JSON.stringify(response));
    return new StreamingTextResponse(
      stream.pipeThrough(createStreamDataTransformer())
    );
  } catch (e: any) {
    console.log(e);
    return new Response(JSON.stringify({ error: e.message }), {
      status: e.status ?? 500,
    });
  }
}
