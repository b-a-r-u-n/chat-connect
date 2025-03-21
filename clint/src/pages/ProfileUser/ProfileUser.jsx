import React, { useEffect } from 'react'
import { Error, InfoCard, Loading, LogoSearch, ProfileCard, ProfileCenter, ProfileLeft, RightSide } from '../../Components'
import { useDispatch, useSelector } from 'react-redux'
import { toggleAnotherUserProfile } from '../../Features/anotherUsersSlice';
import { getUserDetails, toggleProfilePage, toggleRightSideVisible } from '../../Features/homeSlice';
import { useParams } from 'react-router-dom';

const ProfileUser = () => {

  const dispatch = useDispatch();

  const rightSideVisible = useSelector(state => state.home.rightSideVisible);

  const isLoading = useSelector(state => state.home.isLoading);
  const isError = useSelector(state => state.home.isError);

  const id = useParams();
    // console.log(id.id);

    useEffect(() => {
        dispatch(getUserDetails(id.id));
        // dispatch(toggleProfilePage(false))
        // dispatch(toggleAnotherUserProfile(false));
        // dispatch(toggleAnotherUserPage(true));
        sessionStorage.setItem('tempId', id.id);
    },[id.id])

  useEffect(() => {
    dispatch(toggleAnotherUserProfile(true)); 
    dispatch(getUserDetails(sessionStorage.getItem('tempId')));  
    
    if(window.innerWidth < 1024)
      dispatch(toggleRightSideVisible(false));
  },[])


  return (
    <>
      {
          isLoading ? 
          <Loading /> 
          : 
          (
            isError ? 
            <Error /> 
            :
            <div className="profile">
              <div>
                  <LogoSearch />
                  <ProfileCard />
                  <InfoCard />
              </div>
              <ProfileCenter />
              {
                rightSideVisible && <RightSide />
              }
            </div>
          )
        }
    </>
  )
}

export default ProfileUser
