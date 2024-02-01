
import { Layout,Home, Category, Novel, RequestNovel, Dashboard, NovelsDahboard, Wishlist, Support, Profile, Privacy, ResetPassword } from "components";
import { createBrowserRouter } from "react-router-dom";


  const novels = [
    { id: 1, name: "novel1" },
    { id: 5, name: "novel2" },
    { id: 6, name: "novel3" },
  ];

  const requestRoutes = novels.map((novel,key) => ({
    path: `request/${novel.id}`,
    element: <RequestNovel NovelId={novel.id} key={key} />,
  }));

export const Router = createBrowserRouter([
    {
        path:"/",
        element:<Layout/>,
        children:[
            {
                path:"/",
                element: <Home/>,
                children:[
                  {
                    path:"/reset-password",
                    element:<ResetPassword/>
                  }
                ]
            },
            {
                path: "/home",
                element: <Home/>,
            },
            {
              path: "/register",
              element: <Home/>,
            },
            {
              path: "/privacy",
              element: <Privacy/>,
            },
            {
                path: "/category/:id",
                element: <Category/>
            },
            {
                path:"/novel",
                children: [
                  {
                    path:'/novel/:id',
                    element: <Novel/>
                  }
                ]
            },
            {
                path:"/request",
                children: requestRoutes.map((route) => ({
                    path:`/${route.path}`,
                    element:route.element
                }))
            }
        ]
    },
    {
      path:'/dashboard',
      element:<Dashboard/>,
      children:[
        {
          path:'/dashboard',
          element:<NovelsDahboard/>
        },
        {
          path:'/dashboard/novels',
          element:<NovelsDahboard/>,
        },
        {
          path:'/dashboard/wishlist',
          element:<Wishlist/>
        },
        {
          path:'/dashboard/support',
          element:<Support/>
        },
        {
          path:'/dashboard/profile',
          element:<Profile/>
        },
      ]
    },
]);

