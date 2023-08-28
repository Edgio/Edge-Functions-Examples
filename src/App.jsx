import { useState, useEffect } from 'react'

function App() {
  const [users, setUsers] = useState([])

  useEffect(() => {
    fetch("http://127.0.0.1:3000/example/edge-database-turso")
      .then(response => response.json())
      .then(data => {
        setUsers(data.rows)
      })
      .catch(error => {
        console.error('Error fetching users:', error)
      })
  }, [])
  return (
    <>
      <h1>Turso Example</h1>
      <div className="card">
        <h2>User List</h2>
        <ol>
          {users.map(user => <li key={user[0]}>{user[1]}</li>)}
        </ol>
      </div>
    </>
  )
}

export default App
