import { sanityFetch } from "@/lib/sanity/client";
import { CHATBOT_QUERY } from "@/lib/sanity/queries";
import { ChatbotConfig } from "./ChatBot";
import ChatBotClient from "./ChatBotClient";

/**
 * Server Component wrapper that fetches chatbot config from Sanity,
 * then passes it to the Client Component chat widget.
 */
export default async function ChatBotWrapper() {
  const config = await sanityFetch<ChatbotConfig>(
    CHATBOT_QUERY,
    undefined,
    ["chatbot"]
  );

  // If explicitly disabled in CMS, don't render
  if (config?.isEnabled === false) return null;

  return <ChatBotClient config={config || undefined} />;
}
