import { Document } from "../../../elements/Documents/Document";
import { Layout } from "../../../elements/Layout";
import { trpc } from "../../../lib/trpc";
import NextError from "next/error";
import { useRouter } from "next/router";
import { paragraphsToSentences } from "../../../utils";

const Documents = () => {
  const router = useRouter();
  const { id } = router.query;
  // TODO: more safety
  const documentQuery = trpc.documents.findWithSentencesById.useQuery({
    id: Number(id),
  });
  if (documentQuery.error) {
    return (
      <NextError
        title={documentQuery.error.message}
        statusCode={documentQuery.error.data?.httpStatus ?? 500}
      />
    );
  }

  if (documentQuery.status === "loading") {
    return <>Loading...</>;
  }

  const { data: document } = documentQuery;
  return (
    <div className="container mx-auto p-4">
      <h2 className="text-xl font-bold">Documents</h2>
      <div className="grid grid-cols-8 gap-2">
        <div className="col-span-2">
          <span>何かしらの情報</span>
        </div>

        <div className="col-span-4">
          <Document
            title={document.title}
            sentences={paragraphsToSentences(document.paragrahs)}
            body={document.body}
            canEdit={false}
          />
        </div>

        <div className="col-span-2">
          <div className="bg-base-200 p-2">
            <span className="font-bold">タスク</span>
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
