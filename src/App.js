import React, { useEffect, useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

import Home from './Components/Home';
import Authenticate from './Components/Authenticate/Authenticate';
import { auth, getUserFromDatabase } from './firebase';
import Spinner from './Components/Spinner/Spinner';
import Account from './Components/Account/Account';


function App() {
  // Checking whether the user has logged in
  const [loginAuthenticated, setLoginAuthenticated] = useState(false);

  // Fetching the details of user from the users Firestore database
  const [userDetails, setUserDetails] = useState({});

  // Checking whether all the data is being loaded or not and displaying the Spinner meanwhile
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  // Now fetching the data from the database
  const fetchUserDetails = async (uid) => {
    const userDetails = await getUserFromDatabase(uid);
    setUserDetails(userDetails);
    // Once the Data is fetched then updating the state of setIsDataLoaded 
    setIsDataLoaded(true);
  };

  //Once the homepage loads applying the useEffect on the loginAuthenticated by adding the listener to check signup/login completion
  useEffect(() => {
    const listener = auth.onAuthStateChanged((user) => {
      // If no user is signed up then simply return
      if (!user) {
        setIsDataLoaded(true);
        // This is needed to be set to false because when there no user logged in it has to be brought back to false
        setLoginAuthenticated(false);
        return;
      };

      setLoginAuthenticated(true);
      fetchUserDetails(user.uid);
    });
    return () => listener();
  }, []);


  return (
    <div className="App">
      <Router>
        {/* Once the data is loaded then implement all the Routes */}
        {isDataLoaded ?
          (
            <Routes>

              {/* Adding the decision making condition to block the route to sign up and login page once the user has logged in */}
              {
                !loginAuthenticated && (
                  <>
                    <Route path='/login' element={<Authenticate />} />
                    <Route path='/signup' element={<Authenticate signup />} />
                  </>
                )
              }

              {/* Account page will have to fetch the details from the userDetails and will redirect non authorizedd users to another page*/}
              <Route path='/account' element={<Account userDetails={userDetails} auth={loginAuthenticated} />} />
              {/* Once the user log in then it should be using the auth as props as defined in the Home.js component */}
              <Route path='/' element={<Home auth={loginAuthenticated} />} />
              <Route path='/*' element={<Navigate to="/" />} />
            </Routes>
          ) :
          (
            <div className='spinner'>
              <Spinner />
            </div>
          )

        }
      </Router>
    </div>
  );
}

export default App;
