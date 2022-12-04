import { MicrotaskKinds, type Sentence } from ".prisma/client";
import { match } from "ts-pattern";

export const groupBy = <K, V>(
  array: readonly V[],
  getKey: (cur: V, idx: number, src: readonly V[]) => K
): [K, V[]][] =>
  Array.from(
    array.reduce((map, cur, idx, src) => {
      const key = getKey(cur, idx, src);
      const list = map.get(key);
      if (list) list.push(cur);
      else map.set(key, [cur]);
      return map;
    }, new Map<K, V[]>())
  );

export const uniq = <T>(array: T[]) => {
  return Array.from(new Set(array));
};

/**
 * kindに応じて sentence.isFact のフィルタリングを行う
 * - CHECK_FACT_RESOURCE: 事実文のみにフィルタリング
 * - CHECK_OPINION_VALIDNESS: 意見文のみにフィルタリング
 */
export const filterSentencesByKindAndIsFact = (
  kind: MicrotaskKinds,
  sentences: Array<Sentence & { isFact?: boolean | undefined }>
) => {
  return match(kind)
    .with(MicrotaskKinds.CHECK_OP_OR_FACT, () => sentences)
    .with(MicrotaskKinds.CHECK_FACT_RESOURCE, () =>
      sentences.filter((s) => s.isFact === true)
    )
    .with(MicrotaskKinds.CHECK_OPINION_VALIDNESS, () =>
      sentences.filter((s) => s.isFact === false)
    )
    .exhaustive();
};

export const isMicrotaskSecondOrThird = (kind: MicrotaskKinds) =>
  kind === MicrotaskKinds.CHECK_FACT_RESOURCE ||
  kind === MicrotaskKinds.CHECK_OPINION_VALIDNESS;
