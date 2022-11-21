import { Layout } from "../../../elements/Layout";

const Tasks = () => {
  return (
    <div className="container mx-auto">
      <h2 className="text-xl font-bold">執筆タスク</h2>
      <p>TODO: テキストを受け付けて，import可能にする</p>
    </div>
  );
};

Tasks.getLayout = function getLayout(page: React.ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Tasks;
