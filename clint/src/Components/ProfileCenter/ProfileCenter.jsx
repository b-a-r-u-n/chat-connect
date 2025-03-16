import React from 'react'
import './ProfileCenter.css'
import ProfileCard from '../ProfileCard/ProfileCard'
import PostSide from '../PostSide/PostSide'

const ProfileCenter = () => {

  return (
    <>
        <div className="profile-center">
            {/* <ProfileCard /> */}
            <PostSide />
        </div>
    </>
  )
}

export default ProfileCenter
