import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { PostSide, ProfileSide, RightSide } from '../../Components';
import { useDispatch } from 'react-redux';
import { getUserDetails, toggleProfilePage } from '../../Features/homeSlice';
import { toggleAnotherUserProfile, toggleAnotherUserPage } from '../../Features/anotherUsersSlice';

const HomeUser = () => {
    const id = useParams();
    // console.log(id.id);

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getUserDetails(id.id));
        dispatch(toggleProfilePage(false))
        dispatch(toggleAnotherUserProfile(false));
        dispatch(toggleAnotherUserPage(true));
        sessionStorage.setItem('tempId', id.id);
    },[id.id])

  return (
    <>
        <div
            className='home'
        >
        <ProfileSide />
        <PostSide />
        <RightSide />
      </div>
    </>
  )
}

export default HomeUser
