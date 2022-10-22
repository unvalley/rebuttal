import React from 'react'

interface Props {
  className?: string
  placeholder?: string
}

export const CommentBox: React.FC<Props> = ({ className, placeholder }) => {
  return (
    <div className={`${className} card card-bordered`}>
      <div className="card-body">
        <textarea
          className={'textarea textarea-bordered w-full'}
          placeholder={`${placeholder ?? 'Whats happening?'}`}
        ></textarea>
        {/* Button */}
        <div className="card-actions justify-end">
          <button className="btn btn-sm">送信</button>
        </div>
      </div>
    </div>
  )
}
