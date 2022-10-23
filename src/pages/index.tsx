import Link from "next/link";
import { Layout } from "../elements/Layout";

const Index = () => {
  const files = [
    "/",
    "/workers/documents/1",
    "/workers/tasks",
    "/writers/documents/1",
    "/writers/tasks/1",
    "/help",
    "/auth/login",
  ];

  return (
    <div>
      <ul>
        {files.map((file) => {
          return (
            <li key={file}>
              <Link href={file}>
                <a className="btn btn-ghost normal-case text-xl">{file}</a>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

Index.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Index;
