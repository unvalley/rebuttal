import { RoleKind, MicrotaskKinds } from "@prisma/client";
import { hash } from "argon2";

export const roleData = [
  {
    id: 1,
    kind: "ADMIN",
  },
  {
    id: 2,
    kind: "WRITER",
  },
  {
    id: 3,
    kind: "WORKER",
  },
] as { id: number; kind: RoleKind }[];

export const userData = async () => {
  return [
    {
      crowdId: "admin",
      roleId: 1,
      password: await hash("password"),
    },
    {
      crowdId: "writer",
      roleId: 2,
      password: await hash("password"),
    },
    {
      crowdId: "worker",
      roleId: 3,
      password: await hash("password"),
    },
  ];
};

export const documentData = [
  {
    id: 1,
    title:
      "「生産性」を定義し，志望企業の生産性向上に対して，AIよりもあなたが貢献できる点をアピールせよ",
    body: `
      ここでは一般的な定義にならい，生産性を「最小限の投資で最大限の事業成果を生み出すこと」と定義する．また志望企業を「SaaSを提供するソフトウェア企業」とし，募集ポジションをソフトウェア開発職とする．以下，生産性向上のために，AIよりも私が貢献できる点について述べる．
      まず第一に，私はAIと比較して，恒常的に事業成果を生み出すための業務活動ができる．具体的には，顧客のニーズを考慮したソフトウェアのコーディングや設計・デザインが可能である．SaaS領域において競争に勝つためには，プロダクトの成長が重視される．したがって，プロダクト成長への投資対効果が高まることは，生産性の向上につながる．確かに，プロダクト開発において，AIが有用な場面もある．例えば，製品需要の予測や画像生成などをはじめとしたタスクは，AIを用いることで達成可能である．しかし，業務において，AIが必要とされるタスクの数は，コーディングや設計・デザインのそれと比較すると相対的に少なくなるだろう．多くの場合，機械学習などをソフトウェア開発において利用する目的は，機能の提供である．したがって，その機能を含めたソフトウェア開発に貢献できる者を採用することは，AIを採用した場合と比較して企業の生産性が向上すると考えられる．
      第二に，私がAIを適切に活用した業務活動を行うことができる．昨今のAIの発展によってその技術を利用することばかりを重視する風潮がある．事業推進及び企業の生産性向上のために必要なことは，課題に沿ってAIを活用することだと考える．事業上の課題が，AIを使って解決すべきものかそうでないものかを判断するためには，その活用法を理解・実践できる人材が必要であろう．AIが，AIが必要な問題かどうかを判断するには，事例が未だ少なく，難易度が高いと考える．AIと事業を理解した人材となる可能性のある私を採用することは，企業の生産性向上に役立つであろう．
      上記の二点より，企業の生産性向上には，AIよりも私のほうが貢献できると考える．`,
    authorId: 2,
  },
  {
    id: 2,
    title: "若年層のSNS利用時間は制限すべきか",
    body: `
      若年層がSNSを使う時間は制限すべきだと考える．
      なぜなら，SNSを長時間利用して得られるメリットがデメリットよりも小さいからである．SNSを利用することで，世の中の情報をリアルタイムに得ることができる．最新の情報が必要な人にとって，これはSNSを利用する大きな理由となる．
      一方で，一般的なSNSは誰でも投稿できるため，情報の質は低いものが多い．フェイクニュースも問題となっている昨今で，質の高い情報をSNSから得ることは年々難しくなってきている．SNS上では，いいねやリツイートなどの他者からの承認が重視されており，良質な情報を発信することが必ずしもそれらにつながらない．言い換えるならば，良質な情報発信を行う利点が，
      他のメディアと比較して相対的に小さいと考えられる．
      以上の理由から，若年層に対しては強制的にSNSの利用時間を制限すべきだと考える`,
    authorId: 2,
  },
];

export const documentIds = documentData.map((d) => d.id);

export const deafultMicrotasks = (
  [
    {
      title: "意見と事実の切り分け",
      kind: MicrotaskKinds.CHECK_OP_OR_FACT,
    },
    {
      title: "事実に対する根拠の有無の確認",
      kind: MicrotaskKinds.CHECK_FACT_RESOURCE,
    },
    {
      title: "意見に対して，それを裏付ける事実が書かれているかの確認",
      kind: MicrotaskKinds.CHECK_OPINION_VALIDNESS,
    },
  ] as { title: string; kind: MicrotaskKinds }[]
).map(({ title, kind }) => {
  return { title, kind };
});
