import { motion } from "framer-motion";
import { BRAND, DEMO_MESSAGES } from "./constants";

export function DemoSection() {
  return (
    <motion.div
      className="mt-20 max-w-2xl mx-auto"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
        <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span className="ml-2 text-sm text-neutral-500 dark:text-neutral-400">{BRAND.name} Chat</span>
        </div>
        <div className="p-6 space-y-4">
          {DEMO_MESSAGES.map((msg, index) => (
            <div key={index} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`px-4 py-2 rounded-2xl ${
                  msg.role === "user"
                    ? "bg-blue-600 text-white rounded-br-md max-w-xs"
                    : "bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white rounded-bl-md"
                } ${!msg.isList && msg.role === "assistant" ? "max-w-xs" : ""}`}
              >
                {msg.isList ? (
                  <>
                    <p className="mb-2">{msg.content}</p>
                    <ul className="text-sm space-y-1">
                      {msg.listItems?.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </>
                ) : (
                  msg.content
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
