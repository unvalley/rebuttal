import React from "react";
// import { useRouter } from "next/router";
import { trpc } from "../../../lib/trpc";
import { Layout } from "../../../elements/Layout";
import { Document } from "../../../elements/Documents/Document";
import { DocumentTabs } from "../../../elements/Documents/DocumentTabs";
import NextError from "next/error";

const Documents = () => {
  // const router = useRouter();
  // const { id } = router.query;

  // const userId = 1;
  // const { data } = trpc.useSWR(["users.findById", { id: userId }]);

  const documentQuery = trpc.documents.findById.useQuery({ id: 1 });

  if (documentQuery.error) {
    return (
      <NextError
        title={documentQuery.error.message}
        statusCode={documentQuery.error.data?.httpStatus ?? 500}
      />
    );
  }

  if (documentQuery.status !== "success") {
    return <>Loading...</>;
  }

  const { data } = documentQuery;

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-xl font-bold">ドキュメント</h2>
      <div className="grid grid-cols-5 gap-2">
        {/* ドキュメント */}
        <div className="col-span-2">
          <Document
            title={""}
            body={`
            ${data.body}
          `}
            canEdit={false}
          />
        </div>
        {/* タブ */}
        <div className="col-span-2">
          <DocumentTabs />
        </div>
        <div className="col-span-1">
          <div className="bg-base-200 p-2">
            <span className="font-bold">タスク</span>
          </div>
          <div>
            {/* <div className=""></div> */}
            {/* {assignedTasks ? (
              <div>
                {assignedTasks.map((task) => (
                  <div key={task.id}>{task.title}</div>
                ))}
              </div>
            ) : ( */}
            <span>タスクが割り当てられていません。</span>
            {/* )} */}
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
