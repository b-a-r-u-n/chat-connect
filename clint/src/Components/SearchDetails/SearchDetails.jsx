import React from "react";
import './SearchDetails.css';
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const SearchDetails = ({result}) => {

    const chatPage = useSelector(state => state.chat.isChatPage); 

    const handaleClick = async () => {
        console.log("Click");
        const responce = await fetch(`${import.meta.env.VITE_BASE_URL}/chat/`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({anotherUserId: result._id.toString()})
        })
        const data = await responce.json();

        if(data.success === 'false' || data.success === false){
            alert(data.message);
            return;
        }

        window.location.reload();
    }

  return (
    <>
        {
            chatPage ? 
            <div className="search-details" onClick={handaleClick}>
                <div className="search-details-container">
                    <img
                        src={`${result.profileImage}`}
                        alt={"userName"}
                    // onClick={() => handaleUser(follower._id)}
                    />
                    <div className="name">
                        <h4>{result.firstName + " " + result.lastName}</h4>
                        <p>@{result.userName}</p>
                    </div>
                </div>
            </div>
            :
            <Link to={`/profile/${result._id}`} className="search-details">
                <div className="search-details-container">
                    <img
                        src={`${result.profileImage}`}
                        alt={"userName"}
                    // onClick={() => handaleUser(follower._id)}
                    />
                    <div className="name">
                        <h4>{result.firstName + " " + result.lastName}</h4>
                        <p>@{result.userName}</p>
                    </div>
                </div>
            </Link>
        }
    </>
  );
};

export default SearchDetails;
