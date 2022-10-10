import React from 'react'

interface Props {
  className?: string
  placeholder?: string
}

export const CommentBox: React.FC<Props> = ({ className, placeholder }) => {
  return (
    <div className={`${className}`}>
      <textarea
        className={'textarea textarea-bordered w-full'}
        placeholder={`${placeholder ?? 'Whats happening?'}`}
      ></textarea>
      {/* Button */}
      <div className="flex justify-end">
        <button className="btn btn-sm">送信</button>
      </div>
    </div>
  )
}
