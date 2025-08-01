/* eslint-disable unused-imports/no-unused-vars */
import type { UIMessagePart as BaseUIMessagePart } from "ai";

import * as z from "zod/v4";

const metadataSchema = z.object({});
const dataPartSchema = z.object({});

type Metadata = z.infer<typeof metadataSchema>;
type DataPart = z.infer<typeof dataPartSchema>;

export type UIMessagePart = BaseUIMessagePart<Metadata, DataPart>;
