import React from "react";
// import { useRouter } from "next/router";
import { trpc } from "../../../lib/trpc";
import { Layout } from "../../../elements/Layout";
import { Document } from "../../../elements/Documents/Document";
import NextError from "next/error";
import { useRouter } from "next/router";
import { MicrotaskStatus } from ".prisma/client";

const Documents = () => {
  const router = useRouter();
  const { id } = router.query;
  const documentId = Number(id);
  // TODO: more safety
  const documentQuery = trpc.documents.findById.useQuery({ id: documentId });
  if (documentQuery.error) {
    return (
      <NextError
        title={documentQuery.error.message}
        statusCode={documentQuery.error.data?.httpStatus ?? 500}
      />
    );
  }

  const microtasksQuery = trpc.microtasks.findManyByDocumentId.useQuery({
    documentId,
  });
  if (microtasksQuery.error) {
    return (
      <NextError
        title={microtasksQuery.error.message}
        statusCode={microtasksQuery.error.data?.httpStatus ?? 500}
      />
    );
  }

  if (documentQuery.isLoading || microtasksQuery.isLoading) {
    return <>Loading...</>;
  }

  const { data: document } = documentQuery;
  const { data: microtasks } = microtasksQuery;

  const microtaskCount = microtasks.length;
  const doneMicrotaskCount = microtasks.filter(
    (microtask) => microtask.status === MicrotaskStatus.DONE
  ).length;

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-xl font-bold">ワーカー用ドキュメントページ</h2>
      <div className="grid grid-cols-8 gap-2">
        <div className="col-span-2">
          <div className="bg-base-200 p-2">
            <div className="font-bold">情報</div>
          </div>
          <p>
            このページでは、学生が書いたレポートに対して、フィードバックタスクを行ってもらいます。
          </p>
          <p>他になにか必要な情報があれば、ここに書き加えます。</p>
        </div>

        <div className="col-span-4">
          <div className="bg-base-200 p-2">
            <div className="font-bold">レポート</div>
          </div>
          <Document
            title={document.title}
            body={`
            ${document.body}
            恥の多い生涯を送って来ました。自分には、人間の生活というものが、見当つかないのです。自分は東北の田舎に生れましたので、汽車をはじめて見たのは、よほど大きくなってからでした。自分は停車場のブリッジを、上って、降りて、そうしてそれが線路をまたぎ越えるために造られたものだという事には全然気づかず、ただそれは停車場の構内を外国の遊戯場みたいに、複雑に楽しく、ハイカラにするためにのみ、設備せられてあるものだとばかり思っていました。しかも、かなり永い間そう思っていたのです。ブリッジの上ったり降りたりは、自分にはむしろ、ずいぶん垢抜けのした遊戯で、それは鉄道のサーヴィスの中でも、最も気のきいたサーヴィスの一つだと思っていたのですが、のちにそれはただ旅客が線路をまたぎ越えるための頗る実利的な階段に過ぎないのを発見して、にわかに興が覚めました。また、自分は子供の頃、絵本で地下鉄道というものを見て、これもやは
          `}
            canEdit={false}
          />
        </div>

        <div className="col-span-2">
          <div className="bg-base-200 p-2">
            <div className="font-bold">
              タスク ({doneMicrotaskCount} / {microtaskCount})
            </div>
            {/* <span className="text-xs">
              このドキュメントのフィードバックを完成させるためには、あとXつのタスクをこなす必要があります。
            </span> */}
          </div>
          <div>
            <div>
              {microtasks.map((task) => (
                <div
                  key={task.id}
                  className="mt-2 card card-compact w-full bg-base-100 shadow-lg"
                >
                  <div className="card-body">
                    <div className="card-title font-semibold text-sm">
                      {task.title}
                    </div>
                    <div className="">
                      {task.assignee ? (
                        <span>
                          アサインされたユーザー:
                          {task.assignee.name}
                        </span>
                      ) : (
                        <span>
                          このタスクは、まだ誰にも割り当てられていません。
                        </span>
                      )}
                    </div>
                    {/* <div className="card-actions justify-end">
                      <button className="btn btn-primary">Buy Now</button>
                    </div> */}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

Documents.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Documents;
