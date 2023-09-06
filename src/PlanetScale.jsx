import { useState, useEffect } from 'react';

function PlanetScale() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch('http://127.0.0.1:3000/example/edge-database-planetscale')
      .then((response) => response.json())
      .then((data) => {
        setUsers(JSON.parse(data.message));
      })
      .catch((error) => {
        console.error('Error fetching users:', error);
      });
  }, []);
  return (
    <>
      <h2>PlanetScale Example</h2>
      <div className="card">
        <h3>Greeting List</h3>
        <ol>
          {users.map((user) => (
            <li key={user.id}>{user.greeting}</li>
          ))}
        </ol>
      </div>
    </>
  );
}

export default PlanetScale;
