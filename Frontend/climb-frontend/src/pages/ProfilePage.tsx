import { useContext, useEffect } from 'react'
import { UserInfoContext } from '../App';
import { useNavigate } from 'react-router-dom';
import { Avatar, Box, Typography, Card, CardContent } from '@mui/material';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { getAccessToken } from '../utils/auth';
import axios from 'axios';

export default function ProfilePage() {
  const { userInfo } = useContext(UserInfoContext);
  const navigate = useNavigate()

  useEffect(() => {
    if (userInfo == undefined)
      navigate("/")

    const fetchData = async () => {
      const accessToken = await getAccessToken()

      if (!accessToken)
        return;

      await axios.get('http://localhost:8000/auth/account/certificate',
        {
          headers: {
            'authorization': 'Bearer ' + accessToken
          }
        })
        .then(response => {
          console.log(response.data)
        })
        .catch(error => {
          console.error(error);
        });
    }

    fetchData()
      .catch(console.error);
  }, []);

  return (
    <Card className="m-4 max-w-[90%] mx-auto">
      <CardContent>
        <Box className="flex items-center justify-center">
          {
            userInfo && userInfo.isStaff
              ? <Avatar className='m-2'>
                <AdminPanelSettingsIcon />
              </Avatar>
              : <></>
          }
          <Avatar className={`!bg-blue-700 capitalize`}>
            {userInfo && userInfo.username[0]}
          </Avatar>
          <Typography variant='h5' className='!mx-8'>
            {userInfo && userInfo.username}
          </Typography>
        </Box>
        <Box className="p-4">
          <Typography variant="body1">
            <span className="font-bold mr-1">Email: </span> {userInfo && userInfo.email}
          </Typography>
          <Typography variant="body1">
            <span className="font-bold mr-1">Nome: </span> 
            {userInfo && userInfo.firstName} {userInfo && userInfo.lastName}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  )
}