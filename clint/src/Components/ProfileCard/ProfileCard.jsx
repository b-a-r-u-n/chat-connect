import React, { useEffect, useState } from 'react'
import './ProfileCard.css'
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getUserDetails } from '../../Features/homeSlice';

const ProfileCard = () => {

  const dispatch = useDispatch();

  const user = useSelector(state => state.home.user);
  const profilePage = useSelector(state => state.home.profilePage);

  const anotherUserProfile = useSelector(state => state.anotherUser.anotherUserProfile);
  const isAnotherUserPage = useSelector(state => state.anotherUser.isAnotherUserPage);
  // const followers = useSelector(state => state.home.followers);


  const [isMobile, setIsMobile] = useState(false);

  // console.log(user);

  const followAndUnfollow = async (id, string) => {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/user/${id}/${string}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      const data = await response.json();
      // console.log(data);
  
      if(data.success === false || data.success === 'false'){
        alert(data.message);
        return;
      }

      if(anotherUserProfile)
        dispatch(getUserDetails(sessionStorage.getItem('tempId')))
      else
        dispatch(getUserDetails(sessionStorage.getItem('id')));
  
    }

  useEffect(() => {
    if(window.innerWidth < 1024)
      setIsMobile(true);
  },[window.innerWidth < 1024])

  return (
    <>
      <div className="profile-card ">
        <div className={profilePage || anotherUserProfile ? "cover-image-profile" : "cover-image"} style={{backgroundImage: `url(${user?.coverImage})`}}>
            <div className="profile-image" style={{backgroundImage: `url(${user?.profileImage})`}}></div>
        </div>
        
        <div className="profile-info">
            <h2>
              {
                user?.firstName + " " + user?.lastName
              }
              <span>
                {
                  user?.isAdmin ? <i className="fa-solid fa-check-double"></i> : ""
                }
              </span>
            </h2>
            <p>
              {
                user?.workesAt || "Available for work"
              }
            </p>
        </div>
        <div className='hr-container'>
            <hr />
        </div>
        <div className="follow-details">
            <div className="followers">
                <h3>
                  {
                    user?.followersCount || 0
                  }
                </h3>
                <p>Followers</p>
            </div>
            <div className="vertical-line"></div>
            <div className="following">
                <h3>
                  {
                    user?.followedToCount || 0
                  }
                </h3>
                <p>Following</p>
            </div>
            {
              (profilePage || anotherUserProfile) && (
                <>
                  <div className="vertical-line"></div>
                  <div className="following">
                    <h3>
                      {
                        user?.totalPosts || 0
                      }
                    </h3>
                    <p>Posts</p>
                  </div>
                </>
              )
            }
        </div>
        <div className='hr-container'>
            <hr />
        </div>
        {
          sessionStorage.getItem('id') !== user?._id &&
          <div className='profile-follow-btn'>
          {
            isMobile && 
            <div>
              {
              user.isFollowed ? 
              <button className='button' onClick={() => followAndUnfollow(user?._id, "unfollow")}>
                Unfollow
              </button> 
              :
              <button className='button' onClick={() => followAndUnfollow(user?._id, "follow")}>
                Follow
              </button>
            }
            </div>
          }
        </div>
        }
        {
          profilePage || anotherUserProfile ? 
          "" 
          : 
          <h3>
            <Link to={isAnotherUserPage ? `/profile/${user?._id}` : "/profile"}>
              Visit Profile
            </Link>
          </h3>
        }
      </div>
    </>
  )
}

export default ProfileCard
