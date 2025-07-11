import type { ClassValue } from "clsx";

import { clsx } from "clsx";
import { NoOp } from "convex-helpers/server/customFunctions";
import { zCustomMutation, zCustomQuery } from "convex-helpers/server/zod";
import { twMerge } from "tailwind-merge";

import { mutation, query } from "@/convex/_generated/server";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const zodQuery = zCustomQuery(query, NoOp);
export const zodMutation = zCustomMutation(mutation, NoOp);
