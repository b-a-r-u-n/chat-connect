import React, { useRef, useState, useEffect } from 'react'
import {Link} from 'react-router-dom'
import {ArrowLeft} from 'lucide-react'
import './LogoSearch.css'
import SearchDetails from '../SearchDetails/SearchDetails'

const LogoSearch = () => {

  const inputRef = useRef();
  const buttonRef = useRef();

  const [isInputFocused, setIsInputFocused] = useState(false);
  const [inputText, setInputText] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    if(isInputFocused && inputRef.current)
      inputRef.current.focus();
    setInputText("")
    setSearchResults([]);
  }, [isInputFocused]);

  const handaleInputText = (e) => {
    setInputText(e.target.value);
    // if(inputText.length > 0)
    //   handaleSearch();
  }

  const handaleSearch = async () => {
    if(inputText === " " || inputText === "")
      return;

    const responce = await fetch(`${import.meta.env.VITE_BASE_URL}/user/search/${inputText}`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      }
    })

    const data = await responce.json();

    if(data.success === "false" || data.success === false){
      alert(data.message);
      setInputText("");
      return;
    }

    setSearchResults(data.data);
    setInputText("");
  }

  return (
    <>
      {
          isInputFocused  && <div className='margin'></div>
      }
      {
        isInputFocused ? 
        <div className="logosearch active-logosearch" >
          <div className='top'>
            <button 
              className="back-button"
              onClick={() => setIsInputFocused(false)}
            >
              <ArrowLeft />
            </button>
              <div className='search-container'>
                <input 
                  type="text" 
                  placeholder="Search"
                  // onFocus={() => setIsInputFocused(true)}
                  // onBlur={() => setIsInputFocused(false)}
                  ref={inputRef}
                  value={inputText}
                  onChange={handaleInputText}
                />
                <button
                  ref={buttonRef}
                  onClick={handaleSearch}
                >
                  <i className="fa-solid fa-magnifying-glass"></i>
                </button>  
              </div>
          </div>
          <div className='bottomm'>
            {
              searchResults?.map((result) => {
                return (
                  <SearchDetails 
                    key={result._id} 
                    result={result}
                    setIsInputFocused={setIsInputFocused}  
                  />
                )
              })
            }
          </div>
        </div>
        :
        <div className="logosearch" >
          <Link to="/home">
            <div className={`logo`}></div>
          </Link>
            <div className='search-container'>
                <input 
                  type="text" 
                  placeholder="Search"
                  onFocus={() => setIsInputFocused(true)}
                  // onBlur={() => setIsInputFocused(false)}
                  ref={inputRef}
                  value={inputText}
                  onChange={handaleInputText}
                />
                <button
                  ref={buttonRef}
                  // onClick={handaleSearch}
                >
                  <i className="fa-solid fa-magnifying-glass"></i>
                </button>  
            </div>
        </div>
      }
    </>
  )
}

export default LogoSearch
