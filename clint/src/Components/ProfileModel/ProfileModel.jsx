import { Modal } from '@mantine/core';
import './ProfileModel.css'
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUserDetails } from '../../Features/homeSlice';
// import { profile } from 'console';

function ProfileModel({modelOpened, setModelOpened, isMobile}) {

  const dispatch = useDispatch();

  const user = useSelector(state => state.home.user);
  
  // console.log("Profile user", user);
  

  const [inputDetails, setInputDetails] = useState({
    firstName: user?.firstName,
    lastName: user?.lastName,
    worksAt: user?.worksAt || '',
    livesIn: user?.livesIn || '',
    country: user?.country || '',
    relationship: user?.relationship || ''
  })
  const [image, setImage] = useState({
    profileImage: '',
    coverImage: ''
  })
  const [isUpdating, setIsUpdating] = useState(false);

  const onInputChange = (e) => {
    setInputDetails({...inputDetails, [e.target.name]: e.target.value})
  }

  const onImageChange = (e) => {
    console.log(e.target.files);
    
    setImage({...image, [e.target.name]: e.target.files[0]});
  }

  const handaleUpdate = async (e) => {
    e.preventDefault();

    setIsUpdating(true);

    const formData = new FormData();
    formData.append('profileImage', image.profileImage);
    formData.append('coverImage', image.coverImage);
    formData.append('firstName', inputDetails.firstName);
    formData.append('lastName', inputDetails.lastName);
    formData.append('worksAt', inputDetails.worksAt);
    formData.append('livesIn', inputDetails.livesIn);
    formData.append('country', inputDetails.country);
    formData.append('relationship', inputDetails.relationship);

    const responce = await fetch(`${import.meta.env.VITE_BASE_URL}/user/update-details/${user._id}`, {
      method: 'PUT',
      credentials: 'include',
      body: formData
    })
    const data = await responce.json();
    console.log(data);

    if(data.success == "false" || data.success === false ){
      setIsUpdating(false);
      setModelOpened(false);
      return alert(data.message);
    }

    setIsUpdating(false);
    dispatch(getUserDetails(sessionStorage.getItem('id')));

    setModelOpened(false);

    setInputDetails({
      firstName: user?.firstName,
      lastName: user?.lastName,
      worksAt: user?.worksAt || '',
      livesIn: user?.livesIn || '',
      country: user?.country || '',
      relationship: user?.relationship || ''
    })
    
  }

  return (
    <>
      <Modal
        opened={modelOpened}
        onClose={() => setModelOpened(false)}
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 3,
        }}
        size={`${isMobile ? "100%" : "50%"}`}
      >
        <form action="" className="profile-model-form">
          <div className="header">
            <h2>Your Info</h2>
          </div>
          <div className='input-fieldd'>
                <div className="full-namee">
                    <input 
                        type="text" 
                        placeholder='First Name'
                        name='firstName'
                        value={inputDetails.firstName}
                        onChange={onInputChange}
                    />
                    <input 
                        type="text"
                        placeholder='Last Name'
                        name='lastName'
                        value={inputDetails.lastName}
                        onChange={onInputChange}
                    />
                </div>
                <div className="workes-at">
                    <input 
                        type="text" 
                        placeholder='Works at'
                        name='worksAt'
                        value={inputDetails.worksAt}
                        onChange={onInputChange}
                    />
                </div>
                <div className="address">
                  <input 
                    type="text"
                    placeholder='Lives in' 
                    name="livesIn"
                    value={inputDetails.livesIn}
                    onChange={onInputChange}
                  />
                  <input 
                    type="text"
                    placeholder='Country' 
                    name='country'
                    value={inputDetails.country}
                    onChange={onInputChange}
                  />
                </div>
                <div className="relationship">
                  <input 
                    type="text" 
                    placeholder='RelationShip Status' 
                    name='relationship'
                    value={inputDetails.relationship}
                    onChange={onInputChange}
                  />
                </div>
                <div className="images">
                  <div className="profile-img">
                    <p>Profile Image</p>
                    <input type="file" accept="image/*" name="profileImage" id="" onChange={onImageChange}/>
                  </div>
                  <div className="cover-img">
                    <p>Cover Image</p>
                    <input type="file" accept="image/*" name="coverImage" id="" onChange={onImageChange}/>
                  </div>
                </div>
            </div>
            <div
            className='update-btn'>
              <button className="button" onClick={handaleUpdate} type='submit'>
                {
                  isUpdating ? "Updating..." : "Update"
                }
              </button>
            </div>
        </form>
      </Modal>
    </>
  );
}

export default ProfileModel
