import type { EntityTable } from "dexie";
import type { Message, Thread } from "@/types";

import Dexie from "dexie";

const localDb = new Dexie("NextChat") as Dexie & {
  threads: EntityTable<Thread, "userProvidedId">;
  messages: EntityTable<Message, "userProvidedId">;
};

localDb.version(1).stores({
  threads: "userProvidedId, _id, _creationTime, title, userId, createdAt, updatedAt",
  messages: "userProvidedId, _id, _creationTime, role, content, userId, threadId, userProvidedThreadId, version, createdAt",
});

export { localDb };
