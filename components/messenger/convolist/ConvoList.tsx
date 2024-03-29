import React from "react";
import useConversations from "@/hooks/useConversations";
import ConvoBox from "./ConvoBox";
import { useRouter } from "next/router";

const ConvoList = () => {
  const router = useRouter();

  const { conversationId } = router.query;

  const conversations = useConversations();

  return (
    <div className="fixed inset-y-0 left-0 w-full overflow-y-auto border-r border-gray-200 bg-white px-5 pb-20 lg:left-24 lg:w-80 lg:pb-0">
      <h1 className="py-4 text-xl font-bold text-neutral-800">Messages</h1>

      <div className="flex flex-col gap-1">
        {conversations.map((conversation) => (
          <ConvoBox
            key={conversation.id}
            conversation={conversation}
            selected={conversationId === conversation.id}
          />
        ))}
      </div>
    </div>
  );
};

export default ConvoList;
