import React from 'react'
import PostShare from '../PostShare/PostShare'
import Posts from '../Posts/Posts'
import './PostSide.css'
import { useSelector } from 'react-redux'

const PostSide = () => {
  const isAnotherUserPage = useSelector(state => state.anotherUser.isAnotherUserPage);

    const profilePage = useSelector(state => state.home.profilePage);

    const anotherUserProfile = useSelector(state => state.anotherUser.anotherUserProfile);

  return (
    <>
        <div className={`post-side ${profilePage || anotherUserProfile ? "postside" : ""}`}>
            {
              isAnotherUserPage || anotherUserProfile ? "" : <PostShare />
            }
            <Posts />
        </div>
    </>
  )
}

export default PostSide
