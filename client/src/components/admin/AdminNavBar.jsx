import React from 'react'
import { FaBell } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import "./AdminNavBar.css";


const AdminNavBar = () => {
  return (
    <div>


        <div className='main-adminnavbar'>
            <h3>Admin Control Panel</h3>
            <div className='right-anb'>
                <div className='icon'>
                    <FaBell />

                </div>
                <div className='sec-right-anb'>
                    <div className='icon2'>
                        <CgProfile />
                    </div>
                    <div className='writings-anb'>
                        <h4 >Admin User</h4>
                        <h5 className='mt-0'>super admin</h5>
                    </div>
                </div>
            </div>
        </div>


    </div>
  )
}

export default AdminNavBar