import React, { useEffect, useRef, useState } from 'react'
import { NavLink } from 'react-router-dom'
import './Chat.css'
import {ChatLeft, ChatRight, Error, Loading, LogoSearch} from '../../Components'
import { useDispatch, useSelector } from 'react-redux'
import { getChats, toggleChatPage } from '../../Features/chatSlice'
import { io } from "socket.io-client";

const Chat = () => {

    const socketRef = useRef(null);

    const dispatch = useDispatch();

    const chats = useSelector(state => state.chat.chats);
    const loading = useSelector(state => state.chat.loading);
    const error = useSelector(state => state.chat.error);
    

    const [currentChat, setCurrentChat] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [sendMessage, setSendMessage] = useState(null);
    const [receiveMessage, setReceiveMessage] = useState(null);
    const [arrowClick, setArrowClick] = useState(false);
    const [hide, setHide] = useState(false);

    // Fetches chat data when the component mounts
    useEffect(() => {
        dispatch(getChats());        
        dispatch(toggleChatPage(true));
    },[])
    
    // Establishes a WebSocket connection and handles user connection events
    useEffect(() => {
        socketRef.current = io(`${import.meta.env.VITE_SOCKET_IO_URL}`);
    
        socketRef.current.on("connect", () => {
            console.log("Connected to the server", socketRef.current.id);
        });

        if(sessionStorage.getItem('id'))
            socketRef.current.emit('add-new-user', {userId: sessionStorage.getItem('id')});
        
        socketRef.current.on('get-users', (payload) => {
            setOnlineUsers(payload);
            // console.log(onlineUsers);
        })
    
        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
                socketRef.current = null; // Reset reference to avoid multiple connections
                console.log("Disconnected from server");
            }
        };
    }, []);

    // Emits a 'send-message' event whenever sendMessage state changes
    useEffect(() => {        
        if(sendMessage !== null){
            socketRef.current.emit('send-message', sendMessage);
        }
        // console.log("sendMessage",sendMessage);
        
    }, [sendMessage])

    // Listens for incoming messages from the server and updates receiveMessage state
    useEffect(() => {
        socketRef.current.on('receive-message', (payload) => {
            setReceiveMessage(payload);
            // console.log(receiveMessage);  
        })
    },[])

    const checkOnlineStatus = (chat) => {
        const chatMember = chat?.members?.find((id) => id !== sessionStorage.getItem('id'));
        const online = onlineUsers.find((user) => user.userId === chatMember);
        return online ? true : false;
    }

    const handaleHideDiv = () => {
        if(window.innerWidth < 1024){
            const chatLeft = document.querySelector('.chat-left');
            const chatRight = document.querySelector('.chat-right');

            chatLeft.classList.toggle('hide');
            chatRight.classList.toggle('hide')
            setArrowClick(false);
        }
    }

    useEffect(() => {
        if(!arrowClick)
            return;
        handaleHideDiv();
        console.log("Click");
        
    },[arrowClick])

    useEffect(() => {
        if(window.innerWidth < 1024){
            setHide(true);
        }
    },[])


  return (
    <>
      {
          loading ? 
            <Loading /> 
          : 
          (
            error ? 
                <Error /> 
            :
            <div className="chat">
                <div className="chat-header">
                    <LogoSearch />
                    <div className="icons">
                        <button>
                            <NavLink to="/home" className={({ isActive }) => isActive ? "active-link" : ""}>
                                <i className="fa-solid fa-house"></i>
                            </NavLink>
                        </button>
                        <button>
                            <i className="fa-solid fa-bell"></i>
                        </button>
                        <button>
                            <NavLink to="/chat" className={({isActive}) => isActive ? "active-link" : ""}>
                                <i className="fa-solid fa-comment"></i>
                            </NavLink>
                        </button>
                        <button>
                            <i className="fa-solid fa-gear"></i>
                        </button>
                    </div>
                </div>
                <div className="chat-section">
                    <div className="chat-left">
                        <h1>
                            Chats
                        </h1>
                        {
                            chats?.map((chat) => {
                                return (
                                    <ChatLeft 
                                        key={chat._id} 
                                        chat={chat}
                                        onClick={() => {
                                            setCurrentChat(chat);
                                            handaleHideDiv();
                                        }}
                                        online={checkOnlineStatus(chat)}
                                    />
                                )
                            })
                        }
                    </div>
                    <div className={`chat-right ${hide ? "hide" : ""}`}>
                        {
                            currentChat ? 
                            <ChatRight 
                                chat={currentChat}
                                setSendMessage={setSendMessage}
                                receiveMessage={receiveMessage}
                                online={checkOnlineStatus(currentChat)}
                                setArrowClick={setArrowClick}
                            />
                            :
                            <div className='empty-chat'>
                                <h1>
                                    Select a chat to start
                                </h1>
                            </div>  
                        }
                    </div>
                </div>
            </div>
          )
        }
    </>
  )
}

export default Chat