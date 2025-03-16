import React, { useEffect, useState } from 'react'
import './ChatLeft.css'

const ChatLeft = ({chat, onClick, online}) => {
  
  
  // console.log("chat", chat);
  const [chatUser, setChatUser] = useState(null);  

  useEffect(() => {
    const chatId = chat?.members.find((chatId) => chatId !== sessionStorage.getItem('id'));
    // console.log(chatId);
    const getChatUser = async (id) => {
      try {
        const responce = await fetch(`${import.meta.env.VITE_BASE_URL}/user/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include'
        })
        const data = await responce.json();
        setChatUser(data.data);
        
      } catch (error) {
        console.log(error);
      }
    }
    getChatUser(chatId);
    
  },[chat])
  
  return (
    <>
      <div className="chat-left-container" onClick={onClick}>
        <div className="person-details person-details-hover">
          <div>
            <div className="image">
              {
                online && <span></span>
              }
              <img src={`${chatUser?.profileImage}`} alt="" />
            </div>
            <div className="chat-info">
              <h3>{chatUser?.firstName + " " + chatUser?.lastName}</h3>
              <p>
                { 
                  online ? "Online" : "Offline"
                }
              </p>
            </div>
          </div>
          <span></span>
        </div>
      </div>
    </>
  )
}

export default ChatLeft
