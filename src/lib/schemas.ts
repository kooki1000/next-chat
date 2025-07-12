import * as z from "zod/v4";

import { DEFAULT_MAX_LENGTH } from "./constants";

export const createMessageSchema = z.object({
  content: z.string().max(DEFAULT_MAX_LENGTH, `Message content exceeds maximum length of ${DEFAULT_MAX_LENGTH} characters`),
});
