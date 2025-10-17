import { format, formatDistanceToNow } from "date-fns";
import { z } from "zod";

type DateInput = Date | number | string;

const normalizeDate = (value: DateInput): Date | number =>
  typeof value === "string" ? new Date(value) : value;

export function formatDate(date: DateInput) {
  return format(normalizeDate(date), "dd MMM yyyy h:mm a");
}

export function timeAgo(date: DateInput) {
  return `${formatDistanceToNow(normalizeDate(date))} ago`;
}

export const requiredString = (fieldName: string) =>
  z
    .string()
    .trim()
    .min(1, { message: `${fieldName} is required` });
