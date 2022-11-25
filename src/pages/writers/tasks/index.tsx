import { useRouter } from "next/router";
import { useState } from "react";
import { Layout } from "../../../elements/Layout";
import { trpc } from "../../../lib/trpc";

const Tasks = () => {
  const [text, setText] = useState("");
  const router = useRouter();

  const mutation = trpc.documents.saveAndInsertMicrotasks.useMutation();

  // テキストの文字数チェック
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      mutation.mutate({ id: 1 });
      if (confirm("文書を送信しました")) {
        router.push("/writers/tasks/done");
      }
    } catch {
      alert("必須項目が入力されていません");
    }
  };

  return (
    <div className="container mx-auto">
      <h2 className="text-xl font-bold">執筆タスク</h2>
      <p>文章課題：若年層のSNS利用</p>

      <p>
        執筆が完了したら，以下に，文章をコピーして，送信ボタンを押してください．
      </p>
      <form onSubmit={handleSubmit}>
        <div className="form-control mt-4">
          <textarea
            className="textarea textarea-accent"
            name="textarea"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>
        <div className="mt-4">
          <button type="submit" className="btn">
            送信
          </button>
        </div>
      </form>
    </div>
  );
};

Tasks.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Tasks;
