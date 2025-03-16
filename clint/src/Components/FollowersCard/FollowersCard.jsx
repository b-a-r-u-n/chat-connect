import React, { useEffect, useState } from 'react'
import './FollowersCard.css'
// import {followers} from '../../Data/Data.js'
import { useDispatch, useSelector } from 'react-redux'
import { getUserDetails } from '../../Features/homeSlice';
import { Link } from 'react-router-dom';
const FollowersCard = () => {

  const dispatch = useDispatch();

  const followers = useSelector(state => state.home.followers)
  

  const followAndUnfollow = async (id, string) => {
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/user/${id}/${string}`, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    const data = await response.json();
    console.log(data);

    if(data.success === false || data.success === 'false'){
      alert(data.message);
      return;
    }
    
    dispatch(getUserDetails(sessionStorage.getItem('id')));

  }

  // const handaleUser = (id) => {
  //   dispatch(getUserDetails(id));
  // }

  return (
    <div className='followers-card'>
      <h3>People you may know</h3>
      <div>
        {
          followers.map((follower) => {
              return(
                  <div className='followers-details' key={follower._id}>
                      <Link to={`/profile/${follower._id}`}>
                        <img 
                          src={follower.profileImage} 
                          alt={follower.userName} 
                          // onClick={() => handaleUser(follower._id)}
                        />
                      </Link>
                      <div className='name'>
                          <h4>{follower.firstName + " " + follower.lastName}</h4>
                          <p>@{follower.userName}</p>
                      </div>
                      <div className="follow-button">
                        {
                          follower.isFollowed ? 
                          <button className='button' onClick={() => followAndUnfollow(follower._id, "unfollow")}>
                            Unfollow
                          </button> 
                          :
                          <button className='button' onClick={() => followAndUnfollow(follower._id, "follow")}>
                            Follow
                          </button>
                        }
                      </div>
                  </div>
              )
          })
        }
      </div>
    </div>
  )
}

export default FollowersCard
