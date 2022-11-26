export const MICROTASKS = {
  CHECK_OP_OR_FACT: "意見と事実の切り分け",
  CHECK_FACT_RESOURCE: "事実に対する文献情報の有無の確認",
  CHECK_OPINION_VALIDNESS:
    "意見に対して，それを裏付ける事実が書かれているかの確認",
} as const;

export type MicrotaskKinds =
  | "CHECK_OP_OR_FACT"
  | "CHECK_FACT_RESOURCE"
  | "CHECK_OPINION_VALIDNESS";
