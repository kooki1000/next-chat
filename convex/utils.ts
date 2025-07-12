import { NoOp } from "convex-helpers/server/customFunctions";
import { zCustomMutation, zCustomQuery } from "convex-helpers/server/zod";

import { mutation, query } from "./_generated/server";

export const zodQuery = zCustomQuery(query, NoOp);
export const zodMutation = zCustomMutation(mutation, NoOp);
