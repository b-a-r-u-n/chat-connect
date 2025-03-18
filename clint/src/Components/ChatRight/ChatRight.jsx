import React, { useState, useEffect, useRef } from 'react'
import './ChatRight.css'
import {format} from 'timeago.js'
import InputEmoji from "react-input-emoji";
import {SendHorizontal, FilePlus2} from 'lucide-react'

const ChatRight = ({chat, setSendMessage, receiveMessage, online, setArrowClick}) => {
  // console.log("chat", chat);

  const scrollRef = useRef();

  const [chatUser, setChatUser] = useState(null);
  const [chatMessage, setChatMessage] = useState([]);
  const [inputMessage, setInputMessage] = useState("");


  // Get message from socket server
  useEffect(() => {
    // console.log("receiveMessage",receiveMessage);
    
    if(receiveMessage !== null && receiveMessage.chatId === chat._id)
      setChatMessage(prevMessages => [...prevMessages, receiveMessage]);
    // console.log(chatMessage);
    
  }, [receiveMessage])
  
  // Get Users from database 
  useEffect(() => {
    // Extract the chat partner's ID by filtering out the current user's ID from the chat members list
    const chatId = chat?.members?.find((chatId) => chatId !== sessionStorage.getItem('id'));
  
    // Function to fetch chat user details from the API
    const getChatUser = async (id) => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/user/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include', // Ensures cookies are included for authentication
        });
  
        const data = await response.json(); // Parse the JSON response
        
        if(data.success === 'false' || data.success === false)
          return;

        setChatUser(data?.data); // Update the state with fetched user details
  
      } catch (error) {
        console.log(error); // Log any errors that occur during the fetch request
      }
    };
  
    getChatUser(chatId); // Call the function with the extracted chatId
  
  }, [chat]); // Re-run this effect whenever the `chat` prop changes

  // Get Messages from database
  useEffect(() => {
    const userMessage = async (id) => {
      try {
        const responce = await fetch(`${import.meta.env.VITE_BASE_URL}/message/${id}`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          }
        })
        const data = await responce.json();

        if(data.success === 'false' || data.success === false){
          setChatMessage([]);
          return;
        }

        // console.log(data.data);
        
        setChatMessage(data?.data);
        
      } catch (error) {
        console.log(error);
      }
    }
    userMessage(chat?._id);
    
  },[chat])

  //Scroll to last message
  useEffect(() => {
    scrollRef.current?.scrollIntoView({behavior: "smooth"})
  }, [chatMessage])


  const handaleSend = async (e) => {
    e.preventDefault();
    if(!inputMessage.trim())
      return;
    const message = {
      chatId: chat._id,
      senderId: sessionStorage.getItem('id'),
      text: inputMessage
    }

    let data;

    try {
      const responce = await fetch(`${import.meta.env.VITE_BASE_URL}/message`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(message)
      })
      data = await responce.json();
      // console.log(data);
      
      setChatMessage([...chatMessage, data.data]);
    
      // console.log("ChatMessaege", chatMessage);
      
      setInputMessage('');
    } catch (error) {
      console.error(error);
    }

    //Find receiver id and message to socket server
    const receiverId = chat.members.find((chatId) => chatId !== sessionStorage.getItem('id'));
    setSendMessage({...data.data, receiverId});
  }

  
  return (
    <>
      <div className="chat-right-container">
        <div className="person-details chat-right-details">
          <div>
            <button 
              className='left-arrow'
              onClick={() => setArrowClick(true)}
            >
              <i className="fa-solid fa-arrow-left"></i>
            </button>
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
        {/* Chat Message */}
        <div className="chat-message-container">
          {
            chatMessage?.map((message) => (
              <div
                ref={scrollRef}
                className={message?.senderId === sessionStorage.getItem('id') ? "text-right" : "text-left"}
                key={message?._id}
              >
                <div 
                  className={`chat-message ${message?.senderId === sessionStorage.getItem('id') ? "message-right" : "message-left"}`} 
                >
                  <p>{message?.text}</p>
                  <span>{format(message?.createdAt)}</span>
                </div>
              </div>
            ))
          }
        </div>
        {/* Send Message */}
        <div className="send-message-container">
          <div>
            <FilePlus2 />
          </div>
          <div className="chat-input-emoji">
            <InputEmoji 
              value={inputMessage}
              onChange={(message) => setInputMessage(message)}
            />
          </div>
          {
            inputMessage && (
              <button
                onClick={handaleSend}
              >
              <SendHorizontal 
                size={30} 
                className="send-icon"
              />
            </button>
            )
          }
        </div>
      </div>
    </>
  )
}

export default ChatRight
