import Link from "next/link";
import { Alert } from "./Alert";

type Props = {};

export const MyError: React.FC<Props> = () => {
  return (
    <div>
      <Alert
        message="エラーが発生しました．大変お手数をおかけしますが，以下のボタンからトップページへ戻り，タスクをリスタートしてください．"
        alertClass="alert-error"
      />
      <div className="mt-4">
        <Link href="/">
          <a className="btn btn-outline">トップページへ戻る</a>
        </Link>
      </div>
    </div>
  );
};
