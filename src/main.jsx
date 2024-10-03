import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Provider } from 'react-redux'
import store from './store/store.js'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import Home from './pages/home.jsx'
import { Authlayout, Login } from './components/index.js'


import AddPost from "./pages/addpost";
import Signup from './pages/signup.jsx'
import EditPost from "./pages/editpost.jsx";
import Post from "./pages/post";
import AllPosts from "./pages/allposts";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
        {
            path: "/",
            element: <Home />,
        },
        {
            path: "/login",
            element: (
                <Authlayout authentication={false}>
                    <Login />
                </Authlayout>
            ),
        },
        {
            path: "/signup",
            element: (
                <Authlayout authentication={false}>
                    <Signup />
                </Authlayout>
            ),
        },
        {
            path: "/all-posts",
            element: (
                <Authlayout authentication>
                    {" "}
                    <AllPosts />
                </Authlayout>
            ),
        },
        {
            path: "/add-post",
            element: (
                <Authlayout authentication>
                    {" "}
                    <AddPost />
                </Authlayout>
            ),
        },
        {
            path: "/edit-post/:slug",
            element: (
                <Authlayout authentication>
                    {" "}
                    <EditPost />
                </Authlayout>
            ),
        },
        {
            path: "/post/:slug",
            element: <Post />,
        },
    ],
},
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
    <RouterProvider router={router}/>
    </Provider>
  </React.StrictMode>,
)