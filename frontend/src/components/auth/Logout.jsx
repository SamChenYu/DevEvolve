import { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from '/Users/vishvamehta/Documents/swe_group16_project_copy_2/src/services/AuthenicationService.jsx';
import { UserContext } from '../../context/UserContext';

const Logout = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext); 

  useEffect(() => {
    const handleLogout = async () => {
      try {
        await logout(); 
        localStorage.clear(); 
        setUser(null); 
        navigate('/'); 
      } catch (error) {
        console.error("Logout failed:", error);
      }
    };

    handleLogout();
  }, [navigate, setUser]);

  return null; 
};

export default Logout;
