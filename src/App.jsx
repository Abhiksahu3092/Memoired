import { useState,useEffect } from 'react'
import './App.css'
import {useDispatch} from 'react-redux'
import authobj from './appwrite/auth'
import {login,logout} from './store/authslice'
import {Header,Footer} from './components/index'
import { Outlet } from 'react-router-dom'

function App() {
  const [loading,setloading]=useState(true)
  const dispatch=useDispatch()

  useEffect(()=>{
    authobj.currentloginstatus()
    .then((userdata)=>{
      if(userdata){
        dispatch(login({userdata}))
      }
      else{
        dispatch(logout())
      }
    })
    .finally(()=>setloading(false))
  })

  
  return !loading ? (
    <div className='min-h-screen flex flex-wrap content-between bg-gray-400'>
      <div className='w-full block'>
        <Header />
          <main>
            <Outlet/>
          </main>
        <Footer />
      </div>
    </div>
  ) : null
  
}

export default App
