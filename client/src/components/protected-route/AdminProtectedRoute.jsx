import React from 'react'
import AdminLayout from '../layout/AdminLayout'
import { Outlet } from 'react-router-dom'

const AdminProtectedRoute = () => {
  return (
    <AdminLayout>
        <Outlet/>
    </AdminLayout>
  )
}

export default AdminProtectedRoute