import React from 'react'
import './ProfileSide.css'
import LogoSearch from '../LogoSearch/LogoSearch'
import ProfileCard from '../ProfileCard/ProfileCard'
import FollowersCard from '../FollowersCard/FollowersCard'
import { useSelector } from 'react-redux'

const ProfileSide = () => {
  const profileCardVisible = useSelector(state => state.home.profileCardVisible);
  // console.log("profileCardVisible", profileCardVisible);
  
  return (
    <div className='profileside'>
      <LogoSearch />
      {
        profileCardVisible &&  <ProfileCard />
      }
      <FollowersCard />
    </div>
  )
}

export default ProfileSide
