import React from 'react';
import { useNavigate } from 'react-router-dom';
import TotalSales from './TotalSales';
import RegisteredUsers from './RegisteredUsers';
import CreatedItems from './ItemCount';
import './css/AdminPanel.css'


function AdminPanel() {
  const navigate = useNavigate();

  // Logout function
  const handleLogout = () => {
    // Call your logout logic here
    // For now, let's just redirect to the login page
    navigate('/login');
  };

  return (
    <body className="">
      <div
        id="view"
        x-data="{ sidenav: true }"
      >
        <button
        id='button'
        >
          <svg
            className="svg1"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
              clipRule="evenodd"
            ></path>
          </svg>
        </button>

        <div
          id="sidebar"
          x-show="sidenav"
        >
          <div id='sidebar2' >
            <h1 id = 'css1'>
            <span className="text-teal-600">.</span>
            </h1>
            <h1 id ='css2' >
              AdminPanel<span className="text-teal-600"></span>
            </h1>

            <div id="menu" >
              <a
                id='menu1'
                href=""
              >
                <svg
                  id='menu2'
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM14 11a1 1 0 011 1v1h1a1 1 0 110 2h-1v1a1 1 0 11-2 0v-1h-1a1 1 0 110-2h1v-1a1 1 0 011-1z"
                  ></path>
                </svg>
                <span >Dashboard</span>
              </a>
              <a
                id= 'menu3' 
                href="/admin/products"
              >
                <svg
                  id= 'menu4'
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M11 17a1 1 0 001.447.894l4-2A1 1 0 0017 15V9.236a1 1 0 00-1.447-.894l-4 2a1 1 0 00-.553.894V17zM15.211 6.276a1 1 0 000-1.788l-4.764-2.382a1 1 0 00-.894 0L4.789 4.488a1 1 0 000 1.788l4.764 2.382a1 1 0 00.894 0l4.764-2.382zM4.447 8.342A1 1 0 003 9.236V15a1 1 0 00.553.894l4 2A1 1 0 009 17v-5.764a1 1 0 00-.553-.894l-4-2z"
                  ></path>
                </svg>
                <span >Products</span>
              </a>
              <a
                id='menu5'
                href="/admin/users"
              >
                <svg 
                id= 'menu6' fill="none" height="24" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                <span>Users</span>
              </a>
            </div>
          </div>
        </div>

        <div id = 'css3' >
  <div id = 'css4'>
    <TotalSales className="css9" />
    <RegisteredUsers className="css9" />
    <CreatedItems className="css9" />
  </div>
</div>

      </div>

      {/* Logout button */}
    </body>
  );
}

export default AdminPanel;