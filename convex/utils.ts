import { NoOp } from "convex-helpers/server/customFunctions";
import { zCustomMutation, zCustomQuery, zid } from "convex-helpers/server/zod";
import z from "zod";

import { mutation, query } from "./_generated/server";

export const zodQuery = zCustomQuery(query, NoOp);
export const zodMutation = zCustomMutation(mutation, NoOp);

export function convexIdSchema(tableName: string) {
  return zid(tableName).transform(val => ({
    type: "convexId" as const,
    value: val,
  }));
}

export const uuidSchema = z.string().uuid().transform(val => ({
  type: "uuid" as const,
  value: val,
}));
