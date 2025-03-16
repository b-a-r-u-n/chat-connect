import './App.css'
import '@mantine/core/styles.css';

import { Loader, MantineProvider } from '@mantine/core';
import { Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Error, Loading } from './Components';

function App() {

  const isLoading = useSelector(state => state.home.isLoading);
  const isError = useSelector(state => state.home.isError);

  return (
    <>
      <MantineProvider>
        <div className="App">
          <div className="blur one"></div>
          <div className="blur two"></div>
          {
            isLoading ? <Loading /> : (isError ? <Error /> : <Outlet />)
          }
        </div>
      </MantineProvider>
    </>
  )
}

export default App
