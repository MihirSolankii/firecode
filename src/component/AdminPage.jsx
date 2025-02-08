import axios from 'axios';
import React from 'react'
import { useState,useEffect } from 'react';
import { Link } from 'react-router-dom';

const AdminPage = () => {
  const [empData, setEmpData] = useState(null);
  // const fetchUserData = async () => {
    
  //   try {
  //     // const userId = localStorage.getItem('userId');
  //     // const response = await axios.get(`http://localhost:3000/user/${userId}`);
  //     // setEmpData(response.data);
  //     // console.log(response.data);
  //   } catch (error) {
  //     console.error('Error fetching user data:', error);
  //   }
  // };
  // useEffect(() => {
  //   fetchUserData();
  // }, []);
  return (
    <div>
      hello admin!!
     {empData && <p>{empData.name}</p>}
      
      {empData ? (
            <img src={empData.image} alt="User" className="user-logo" />
          ) : (
            <span className="user-logo">User</span>
          )}
    </div>
  )
}

export default AdminPage;
