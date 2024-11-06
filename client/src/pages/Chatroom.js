// import React, { useState, useEffect, useRef } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { io } from 'socket.io-client';
// import axios from 'axios';
// import { Avatar, AvatarGroup, Badge, Box, Button, Input, Tooltip, Typography } from '@mui/material';
// import { styled } from '@mui/material/styles';

// const StyledBadge = styled(Badge)(({ theme }) => ({
//   '& .MuiBadge-dot': {
//     backgroundColor: '#44b700',
//     color: '#44b700',
//     borderRadius: '50%',
//   },
// }));

// const Chatroom = () => {
//   const [messages, setMessages] = useState([]);
//   const [message, setMessage] = useState('');
//   const [users, setUsers] = useState([]);
//   const socketRef = useRef();
//   const navigate = useNavigate();

//   const userName = localStorage.getItem('userName');
//   const token = localStorage.getItem('token');

//   useEffect(() => {
//     if (!userName) navigate('/');

//     socketRef.current = io('http://localhost:8000');

//     socketRef.current.emit('join', { userName });

//     socketRef.current.on('message', (newMessage) => {
//       setMessages((prevMessages) => [...prevMessages, newMessage]);
//     });

//     socketRef.current.on('updateUsers', (updatedUsers) => {
//       setUsers(updatedUsers);
//     });

//     socketRef.current.on('userJoined', (user) => {
//       setMessages((prevMessages) => [
//         ...prevMessages,
//         { content: `${user.userName} has joined the chat`, system: true },
//       ]);
//     });

//     socketRef.current.on('userLeft', (user) => {
//       setMessages((prevMessages) => [
//         ...prevMessages,
//         { content: `${user.userName} has left the chat`, system: true, time: new Date().toLocaleTimeString() },
//       ]);
//     });

//     return () => {
//       socketRef.current.emit('leave', { userName });
//       socketRef.current.disconnect();
//     };
//   }, [userName, navigate]);

//   const sendMessage = async () => {
//     if (message.trim()) {
//       const newMessage = {
//         userName,
//         content: message,
//         time: new Date().toLocaleTimeString(),
//       };

//       socketRef.current.emit('message', newMessage);
//       setMessage('');

//       await axios.post('http://localhost:8000/chat/send', { content: message }, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         }
//       });
//     }
//   };

//   const handleLogout = () => {
//     localStorage.removeItem('userName');
//     localStorage.removeItem('token');
//     navigate('/');
//   };

//   return (
//     <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#f0f2f5' }}>
//       <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, bgcolor: '#128C7E', color: 'white' }}>
//         <Typography variant="h5">Chatroom</Typography>
//         <Button variant="contained" color="secondary" onClick={handleLogout}>Logout</Button>
//       </Box>

//       <Box sx={{ display: 'flex', alignItems: 'center', p: 2, bgcolor: '#ededed', borderBottom: '1px solid #ddd' }}>
//         <Typography variant="subtitle1" sx={{ mr: 2 }}>Online Users:</Typography>
//         <AvatarGroup max={4}>
//           {users.map((user, index) => (
//             <Tooltip key={index} title={user.userName} arrow>
//               <StyledBadge
//                 overlap="circular"
//                 anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
//                 variant="dot"
//               >
//                 <Avatar alt={user.userName} src={`/static/images/avatar/${index + 1}.jpg`} />
//               </StyledBadge>
//             </Tooltip>
//           ))}
//         </AvatarGroup>
//       </Box>

//       <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 2 }}>
//         {messages.map((msg, index) => (
//           <Box
//             key={index}
//             sx={{
//               display: 'flex',
//               justifyContent: msg.system ? 'center' : msg.userName === userName ? 'flex-end' : 'flex-start',
//               alignItems: 'flex-start',
//               mb: 1,
//             }}
//           >
//             {!msg.system && (
//               <Avatar alt={msg.userName} src={`/static/images/avatar/${index % 5 + 1}.jpg`} sx={{ width: 32, height: 32, mx: 1 }} />
//             )}
//             <Box
//               sx={{
//                 maxWidth: '60%',
//                 p: 1.5,
//                 bgcolor: msg.system ? 'grey.300' : msg.userName === userName ? '#dcf8c6' : 'white',
//                 borderRadius: '10px',
//                 boxShadow: 1,
//                 textAlign: msg.system ? 'center' : 'left',
//               }}
//             >
//               <Typography variant="body2" fontWeight="bold">
//                 {msg.system ? <em>{msg.content}</em> : `${msg.userName} ${msg.time ? `[${msg.time}]` : ''}`}
//               </Typography>
//               {!msg.system && <Typography variant="body2">{msg.content}</Typography>}
//             </Box>
//           </Box>
//         ))}
//       </Box>

//       <Box sx={{ display: 'flex', p: 2, bgcolor: '#ededed' }}>
//         <Input
//           fullWidth
//           placeholder="Type a message..."
//           value={message}
//           onChange={(e) => setMessage(e.target.value)}
//           sx={{ bgcolor: 'white', borderRadius: '20px', px: 2 }}
//         />
//         <Button variant="contained" color="primary" onClick={sendMessage} sx={{ ml: 1, borderRadius: '20px' }}>
//           Send
//         </Button>
//       </Box>
//     </Box>
//   );
// };

// export default Chatroom;


import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import axios from 'axios';
import { Avatar, AvatarGroup, Badge, Box, Button, Input, Tooltip, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useUser } from '../context/userContext';

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-dot': {
    backgroundColor: '#44b700',
    color: '#44b700',
    borderRadius: '50%',
  },
}));

const Chatroom = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [users, setUsers] = useState([]);
  const socketRef = useRef();
  const navigate = useNavigate();

  const { user, logout } = useUser();

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!user) navigate('/');
    socketRef.current = io('http://localhost:8000');
    socketRef.current.emit('join', { userName: user });

    socketRef.current.on('message', (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    socketRef.current.on('updateUsers', (updatedUsers) => {
      setUsers(updatedUsers);
    });

    socketRef.current.on('userJoined', (user) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { content: `${user.userName} has joined the chat`, system: true },
      ]);
    });

    socketRef.current.on('userLeft', (user) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { content: `${user.userName} has left the chat`, system: true, time: new Date().toLocaleTimeString() },
      ]);
    });

    return () => {
      socketRef.current.emit('leave', { userName: user });
      socketRef.current.disconnect();
    };
  }, [user, navigate]);

  const sendMessage = async () => {
    if (message.trim()) {
      const newMessage = {
        userName: user,
        content: message,
        time: new Date().toLocaleTimeString(),
      };

      socketRef.current.emit('message', newMessage);
      setMessage('');

      await axios.post('http://localhost:8000/chat/send', { content: message }, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#f0f2f5' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, bgcolor: '#128C7E', color: 'white' }}>
        <Typography variant="h5">Chatroom</Typography>
        <Button variant="contained" color="secondary" onClick={handleLogout}>Logout</Button>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', p: 2, bgcolor: '#ededed', borderBottom: '1px solid #ddd' }}>
        <Typography variant="subtitle1" sx={{ mr: 2 }}>Online Users:</Typography>
        <AvatarGroup max={4}>
          {users.map((user, index) => (
            <Tooltip key={index} title={user.userName} arrow>
              <StyledBadge
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                variant="dot"
              >
                <Avatar alt={user.userName} src={`/static/images/avatar/${index + 1}.jpg`} />
              </StyledBadge>
            </Tooltip>
          ))}
        </AvatarGroup>
      </Box>

      <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 2 }}>
        {messages.map((msg, index) => (
          <Box
            key={index}
            sx={{
              display: 'flex',
              justifyContent: msg.system ? 'center' : msg.userName === user ? 'flex-end' : 'flex-start',
              alignItems: 'flex-start',
              mb: 1,
            }}
          >
            {!msg.system && (
              <Avatar alt={msg.userName} src={`/static/images/avatar/${index % 5 + 1}.jpg`} sx={{ width: 32, height: 32, mx: 1 }} />
            )}
            <Box
              sx={{
                maxWidth: '60%',
                p: 1.5,
                bgcolor: msg.system ? 'grey.300' : msg.userName === user ? '#dcf8c6' : 'white',
                borderRadius: '10px',
                boxShadow: 1,
                textAlign: msg.system ? 'center' : 'left',
              }}
            >
              <Typography variant="body2" fontWeight="bold">
                {msg.system ? <em>{msg.content}</em> : `${msg.userName} ${msg.time ? `[${msg.time}]` : ''}`}
              </Typography>
              {!msg.system && <Typography variant="body2">{msg.content}</Typography>}
            </Box>
          </Box>
        ))}
      </Box>

      <Box sx={{ display: 'flex', p: 2, bgcolor: '#ededed' }}>
        <Input
          fullWidth
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          sx={{ bgcolor: 'white', borderRadius: '20px', px: 2 }}
        />
        <Button variant="contained" color="primary" onClick={sendMessage} sx={{ ml: 1, borderRadius: '20px' }}>
          Send
        </Button>
      </Box>
    </Box>
  );
};

export default Chatroom;
