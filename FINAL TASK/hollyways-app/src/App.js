import { Routes, Route } from 'react-router-dom'
import DetailDOnation from './pages/DetailDonation';
import Fundraising from './pages/Fundraising';
import Home from './pages/Home';
import ListFundraising from './pages/ListFundraising';
import Profile from './pages/Profile';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';

import { UserContext } from './context/userContext';

import { useState } from 'react';
import { useEffect } from 'react';
import { API, setAuthToken } from './config/api';
import UpdateProfile from './pages/UpdateProfile';
import PrivateRoute from './private/PrivateRoute';
import Loading from './components/Loading';

function App() {

  let navigate = useNavigate();  
  const [state, dispatch] = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(true)


  useEffect(() => {

    if (!isLoading) {
      if (state.isLogin === false) {
        navigate('/');
      }
    }
  }, [isLoading]);

  useEffect(() => {
    if (localStorage.token) {
      setAuthToken(localStorage.token);
      checkUser();
    } else {

      setTimeout(() => {
        setIsLoading(false)
      }, 1400);


    }
  }, []);




  const checkUser = async () => {
    try {
      const response = await API.get('/check-auth');
      console.log("check user success : ", response)
      // Get user data
      let payload = response.data.data;
      // Get token from local storage
      payload.token = localStorage.token;
      // Send data to useContext
      dispatch({
        type: 'USER_SUCCESS',
        payload,
      });
      setTimeout(() => {
        setIsLoading(false)
      }, 1400);
    } catch (error) {
      console.log("check user failed : ", error);
      dispatch({
        type: 'AUTH_ERROR',
      });
      setTimeout(() => {
        setIsLoading(false)
      }, 1400);
    }
  };



  return (
    <>
      {isLoading ?
        <Loading />
        : (
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/makefundraising' element={<PrivateRoute><Fundraising /></PrivateRoute>} />
            <Route path='/listfundraising' element={<PrivateRoute><ListFundraising /></PrivateRoute>} />
            <Route path='/profile' element={<PrivateRoute><Profile /></PrivateRoute>} />
            <Route path='/detaildonation/:id' element={<PrivateRoute><DetailDOnation /></PrivateRoute>} />
            <Route path='/updateProfile' element={<PrivateRoute><UpdateProfile /></PrivateRoute>} />
          </Routes>
        )}
    </>

    
  );
}

export default App;
