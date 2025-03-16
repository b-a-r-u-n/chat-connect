import React from 'react'
import Post from '../Post/Post'
import './posts.css'
import { useSelector } from 'react-redux'

const Posts = () => {

  const timelinePost = useSelector(state => state.home.timelinePost);
  const profilePage = useSelector(state => state.home.profilePage);
  // console.log(timelinePost);

  const anotherUserProfile = useSelector(state => state.anotherUser.anotherUserProfile);
  
  return (
    <>
      <div className="posts">
        {
          timelinePost?.map((data) => {
            if(profilePage){
              if(data.userId === sessionStorage.getItem('id')){
                return <Post key={data._id} data={data} />
              }
            }
            else if(anotherUserProfile){
              if(data.userId === sessionStorage.getItem('tempId')){
                return <Post key={data._id} data={data} />
              }
            }
            else
              return (
                  <Post key={data._id} data={data} />
              )
          })
        }
      </div>
    </>
  )
}

export default Posts
