import './App.css'
import '@mantine/core/styles.css';

import { MantineProvider } from '@mantine/core';
import { Outlet } from 'react-router-dom';

function App() {

  return (
    <>
      <MantineProvider>
        <div className="App">
          <div className="blur one"></div>
          <div className="blur two"></div>
          {/* {
            isLoading ? <Loading /> : (isError ? <Error /> : <Outlet />)
          } */}
          <Outlet />
        </div>
      </MantineProvider>
    </>
  )
}

export default App
