import Link from "next/link";
import { Layout } from "../../../elements/Layout";

const Introduction = () => {
  return (
    <div className="container mx-auto">
      <h2 className="font-bold text-2xl">タスク説明ページ</h2>
      <div>説明です</div>
      <p>長々と文章を書く</p>
      <p>XX</p>

      <Link href="/workers/tasks">
        <button className="btn btn-primary">タスクを開始する</button>
      </Link>
    </div>
  );
};

Introduction.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Introduction;
