import Link from "next/link";
import { trpc } from "../../../lib/trpc";

const Top = () => {
  const docsQuery = trpc.documents.findAll.useQuery(
    {},
    {
      refetchOnWindowFocus: false,
      retry: false,
    }
  );

  const docs = docsQuery.data;
  if (!docs) {
    return <p>Loading...</p>;
  }

  return (
    <div className="container mx-auto my-8">
      <div>
        <h2 className="text-2xl font-bold">フィードバック対象の文書リスト</h2>
      </div>
      <div className="flex flex-row flex-wrap">
        {docs.map((doc, idx) => (
          <div
            key={idx}
            className="card card-compact w-96 bg-base-100 shadow-2xl m-4"
          >
            <div className="card-body">
              <h2 className="card-title text-lg">{doc.title}</h2>
              <p>文書ID: {doc.id}</p>
              <div className="card-actions justify-end">
                <Link href={`/teachers/tasks/?documentId=${doc.id}`}>
                  <button className="btn">タスクを開始</button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Top;
