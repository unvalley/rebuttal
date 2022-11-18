import type { Microtask, Paragraph } from "@prisma/client";

export type MicrotaskWithParagraph = Microtask & { paragraph: Paragraph };
