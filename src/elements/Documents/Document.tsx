type DocumentProps = {
  title: string
  body: string
  canEdit: boolean
}

export const Document: React.FC<DocumentProps> = (props) => {
  return (
    <div className="bg-base-100">
      <div className="">
        <h2 className="font-bold">{props.title || 'Untitled'}</h2>
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
  )
}
