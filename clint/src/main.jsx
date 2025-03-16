import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Auth from './pages/Auth/Auth.jsx'
import Home from './pages/Home/Home.jsx'
import Profile from './pages/Profile/Profile.jsx'
import { store } from './App/store.js'
import {Provider} from 'react-redux'
import { Hero } from './Components/index.js'
import HomeUser from './pages/HomeUser/HomeUser.jsx'
import ProfileUser from './pages/ProfileUser/ProfileUser.jsx'
import Chat from './pages/Chat/Chat.jsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '',
        element: <Hero />
      },
      {
        path: 'auth',
        element: <Auth />
      },
      {
        path: 'home',
        element: <Home />
      },
      {
        path: 'profile',
        element: <Profile />
      },
      {
        path: 'chat',
        element: <Chat />,
      },
      // {
      //   path: 'home/:id',
      //   element: <HomeUser />
      // },
      {
        path: 'profile/:id',
        element: <ProfileUser />
      }
    ]
  }
])

createRoot(document.getElementById('root')).render(
  // <StrictMode>
  <Provider store={store}>
    <RouterProvider router={router}/>
  </Provider>
  // </StrictMode>,
)
