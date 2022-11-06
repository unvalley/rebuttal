interface DocumentProps {
  title: string;
  body: string;
  canEdit: boolean;
}

export const Document: React.FC<DocumentProps> = (props) => {
  return (
    <div className="bg-base-100">
      <div className="">
        <div className="font-bold">{props.title || "Untitled"}</div>
        {props.canEdit ? (
          <textarea
            className="textarea textarea-bordered w-full"
            rows={10}
            placeholder="Bio"
          />
        ) : (
          <p>{props.body}</p>
        )}
      </div>
    </div>
  );
};
