import React from 'react'
import { Card } from '../components/ui'
import { useAuth } from '../contexts'

const Dashboard: React.FC = () => {
  const { user } = useAuth()

  return (
    <div>
      <h1>Dashboard</h1>
      <Card>
        <h2>Welcome, {user?.name || user?.email}!</h2>
        <p>This is your dashboard. More features coming soon.</p>
      </Card>
    </div>
  )
}

export default Dashboard
