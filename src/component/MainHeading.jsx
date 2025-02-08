import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaChevronLeft, FaChevronRight, FaUserCircle } from "react-icons/fa";
import { BsList } from "react-icons/bs";
import { Drawer, List, ListItem, ListItemText, IconButton, ListItemButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Timer from "../Timer/Timer";
import axios from "axios";
import Logout from "../Buttons/Logout.jsx";
import { UserPlus } from "lucide-react";
import { toast } from "react-toastify";
import {  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { Button } from "../components/ui/button";

import {  Link as LinkIcon, Copy as CopyIcon } from "lucide-react";

const MainHeading = ({ data }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [problems, setProblems] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const [joinLink, setJoinLink] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
console.log(data);

  const fetchUserData = async () => {
    try {
      const userId = localStorage.getItem('userId');
      const response = await axios.get(`https://leetcode-backend-1-5uw5.onrender.com/user/${userId}`);
      setUserData(response.data);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const fetchProblems = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('https://leetcode-backend-1-5uw5.onrender.com/leetcode/problems', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProblems(response.data.problems);
    } catch (error) {
      console.error('Error fetching problems:', error);
    }
  };

  useEffect(() => {
    fetchUserData();
    fetchProblems();
   
  }, []);

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleInviteClick = () => {
    console.log('Invite button clicked');
    const token = localStorage.getItem('token');
    axios.post('https://leetcode-backend-1-5uw5.onrender.com/create-room', {}, {
      headers: {Authorization: `Bearer ${token}` },
    })
    .then((response) => {
      console.log(response.data);
        toast.success("Room link successfully generated!");
        navigate(`/room-selection/${response.data.roomId}`);
    })
    .catch((error) => {
      console.error(error);
      toast.error("Failed to generate the room link. Please try again.");
    });
  };
  const handleCopyLink = () => {
    if (joinLink) {
      navigator.clipboard.writeText(joinLink);
      toast.success("Link copied to clipboard!");
    }
  };
  const handleProblemChange = (isForward) => {
    const currentProblemId = location.pathname.split('/').pop();
    const currentProblemIndex = problems.findIndex(p => p.main.id === currentProblemId);
    let nextIndex;

    if (isForward) {
      nextIndex = currentProblemIndex + 1 >= problems.length ? 0 : currentProblemIndex + 1;
    } else {
      nextIndex = currentProblemIndex - 1 < 0 ? problems.length - 1 : currentProblemIndex - 1;
    }

    const nextProblem = problems[nextIndex];
    if (nextProblem) {
      navigate(`/dashboard/${nextProblem.main.id}`);
    }
  };

  return (
    <>
      <div className="fixed w-full h-[60px] bg-[#1a1a1a] border-b border-[#3e3e3e] flex flex-row z-[100]">
        <Link to="/" className="select-none">
          <div className="inline-block text-[24px] font-bold italic mx-[36px] mt-[12px]">
            <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600 px-[1px]">
              Fire
            </span>
            <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600 px-[1px]">
              Code
            </span>
          </div>
        </Link>

        {data && (
          <div className="flex items-center gap-4 flex-1 justify-center">
            <div
              className="flex items-center justify-center rounded bg-[#2c2c2c] hover:bg-[#3e3e3e] h-8 w-8 cursor-pointer"
              onClick={() => handleProblemChange(false)}
            >
              <FaChevronLeft />
            </div>
            <div
              onClick={handleDrawerToggle}
              className="flex items-center gap-2 font-medium text-[#b3b3b3] hover:text-white cursor-pointer"
            >
              <BsList />
              <span>Problem List</span>
            </div>
            <div
              className="flex items-center justify-center rounded bg-[#2c2c2c] hover:bg-[#3e3e3e] h-8 w-8 cursor-pointer"
              onClick={() => handleProblemChange(true)}
            >
              <FaChevronRight />
            </div>
          </div>
        )}

        <div className="fixed flex flex-row right-[36px] items-center h-[60px]">
          <div className="inline-block p-[5px] text-[14px] text-[#b3b3b3] md:hidden">
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
          </div>
  
          
          {userData ? (
            <div className="flex items-center gap-4">
               <button
        onClick={handleInviteClick}
        className="flex items-center gap-2 bg-[#2c2c2c] py-1.5 px-3 rounded text-white hover:bg-[#3e3e3e] transition cursor-pointer"
      >
        <UserPlus className="text-white" />
        <span>Invite</span>
      </button>

      {/* <Dialog open={isModalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="bg-[#2c2c2c] text-white p-6 rounded-lg max-w-md mx-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Room Link Generated</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 mt-4 max-h-96 overflow-auto">
            <p className="text-gray-400">
              Here is your generated link. Copy and share it with others to join.
            </p>
            <div className="flex items-center justify-between bg-[#3e3e3e] rounded-lg px-4 py-2">
              <span className="truncate text-sm text-white">{joinLink}</span>
              <Button
                onClick={handleCopyLink}
                className="flex items-center gap-2 bg-[#2c2c2c] py-1.5 px-3 rounded text-white hover:bg-[#3e3e3e] transition cursor-pointer"
              >
                <CopyIcon className="h-4 w-4" />
                Copy
              </Button>
            </div>
          
          </div>

        </DialogContent>
      </Dialog> */}
              <div className="bg-[#2c2c2c] py-1.5 px-3 rounded text-orange-500 hover:bg-[#3e3e3e] cursor-pointer">
                Premium
              </div>
              {userData && data && <Timer/>}
              <div className="flex items-center gap-2">
               
                {/* <span className="text-[#b3b3b3]">{userData.email}</span> */}
              </div>

              {userData && (
	<div className="cursor-pointer group relative">
		<FaUserCircle className="w-8 h-8 text-[#b3b3b3]" /> {/* Grayish icon color */}
		<div
			className="absolute top-10 left-2/4 -translate-x-2/4 mx-auto bg-[#2c2c2c]  text-orange-500 p-3 rounded shadow-lg 
			z-40 group-hover:scale-100 scale-0 
			transition-all duration-300 ease-in-out"
		>
			<p className="text-sm font-medium">{userData.email}</p>
		</div>
	</div>
)}

              {userData && <Logout setUserData={setUserData}/>}
            </div>
            
          ) : (
            <div className="flex items-center gap-4">
              <Link
                to="/login"
                className="py-[6px] px-[16px] bg-[#1a1a1a] hover:bg-[#2c2c2c] border rounded-md border-[#3e3e3e] text-white text-[14px] font-bold"
              >
                Log In
              </Link>
              <Link
                to="/signup"
                className="py-[6px] px-[16px] bg-gradient-to-r from-orange-500 to-red-600 border rounded-md border-[#3e3e3e] text-black text-[14px] font-bold hover:opacity-90"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>

      <div className="h-[60px]"></div>

      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        PaperProps={{
          sx: {
            backgroundColor: "#1a1a1a",
            color: "#b3b3b3",
            width: 240,
          },
        }}
      >
        <div role="presentation" onClick={handleDrawerToggle} onKeyDown={handleDrawerToggle}>
          <List>
            {problems.map((problem) => (
              <ListItem 
                component="div" 
                key={problem.main.id} 
                onClick={() => navigate(`/dashboard/${problem.main.id}`)}
                selected={location.pathname === `/dashboard/${problem.main.id}`}
              >
                <ListItemButton
                  sx={{
                    '&.Mui-selected': {
                      backgroundColor: '#2c2c2c',
                      '&:hover': {
                        backgroundColor: '#3e3e3e',
                      },
                    },
                    '&:hover': {
                      backgroundColor: '#2c2c2c',
                    },
                  }}
                >
                  <ListItemText 
                    primary={problem.main.name} 
                    primaryTypographyProps={{ 
                      style: { 
                        color: location.pathname === `/dashboard/${problem.main.id}` ? '#ffffff' : '#b3b3b3'
                      } 
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </div>
      </Drawer>
    </>
  );
};

export default MainHeading;