export const MICROTASKS = {
  DISTINGUISH_OPINION_AND_FACT: "意見と事実の切り分け",
  CHECK_FACT_RESOURCE: "事実に対する文献情報の有無の確認",
  CHECK_IF_OPINION_HAS_VALID_FACT:
    "意見に対して，それを裏付ける事実が書かれているかの確認",
  REVIEW_OTHER_WORKERS_RESULT: "",
} as const;

export type MicroTaskKinds =
  | "DISTINGUISH_OPINION_AND_FACT"
  | "CHECK_FACT_RESOURCE"
  | "CHECK_IF_OPINION_HAS_VALID_FACT"
  | "REVIEW_OTHER_WORKERS_RESULT";
