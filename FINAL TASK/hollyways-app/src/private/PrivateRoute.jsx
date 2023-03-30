import { UserContext } from '../context/userContext';
import { useContext } from 'react';
import { Navigate } from 'react-router-dom';


export default function PrivateRoute(props) {
    const [state, _] = useContext(UserContext)
    const isLogin = state.isLogin

    if (isLogin === false) return <Navigate to="/" />

    return props.children;
}