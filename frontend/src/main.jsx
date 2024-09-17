import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Auth0Provider } from '@auth0/auth0-react';
import { createBrowserRouter, createRoutesFromElements,Route, RouterProvider } from 'react-router-dom';
import SignIn from './components/SignIn/SignIn.jsx';
import Home from './components/Home/Home.jsx';
import MessageBoard from './components/SendMessage/SendMessage.jsx';


const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App/>}>
      <Route path='' element={<SignIn/>}></Route>
      <Route path='/home' element={<Home/>}></Route>
      <Route path='/sendmessages/:id' element={<MessageBoard/>}></Route>
    </Route>
  )
)

createRoot(document.getElementById('root')).render(
  <Auth0Provider
    domain={import.meta.env.VITE_G_DOMAIN}
    clientId={import.meta.env.VITE_G_CLIENTID}
    authorizationParams={{
      redirect_uri: "http://localhost:5173/home"
    }}
  >
    <RouterProvider router={router}/>
  </Auth0Provider>,
)
