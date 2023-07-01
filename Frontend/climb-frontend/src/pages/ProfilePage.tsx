import { useContext, useEffect, useState } from 'react'
import { UserInfoContext } from '../App';
import { Link, useNavigate } from 'react-router-dom';
import { Avatar, Box, Typography, Card, CardContent, Button } from '@mui/material';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import Brightness1Icon from '@mui/icons-material/Brightness1';
import DeleteIcon from '@mui/icons-material/Delete';
import { getAccessToken, getUserInfo } from '../utils/auth';
import axios from 'axios';
import { BACKEND_URL } from '../utils/urls';

interface Certificate {
  readonly id: number,
  readonly file: string,
  readonly expire_date: string
}

export default function ProfilePage() {
  const { userInfo } = useContext(UserInfoContext);
  const [certificate, setCertificate] = useState<Certificate | null>(null)
  const [refresh, setRefresh] = useState<boolean>(false)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      const userInfo = await getUserInfo()
      if (userInfo == null)
        return navigate("/")
        
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
          setCertificate(response.data)
        })
        .catch(error => {
          console.error(error);
        });
    }

    fetchData()
      .catch(console.error);
  }, [refresh]);

  async function handleFileUpload(file: any): Promise<void> {
    const formData = new FormData()
    formData.append("file", file);

    const accessToken = await getAccessToken()

    if (!accessToken)
      return;

    const success = await axios.post(
      'http://localhost:8000/auth/account/certificate',
      formData,
      {
        headers: {
          'authorization': 'Bearer ' + accessToken,
          'Content-Type': 'multipart/form-data',
        }
      }
    )
      .then(_ => {
        return true
      })
      .catch(_ => {
        return false
      })

    if (success)
      setRefresh(!refresh)
  }

  function isExpired() {
    const expired = certificate && (new Date(certificate.expire_date) < new Date())
    return expired
  }

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
        {
          userInfo && !userInfo.isStaff
            ? certificate
              ?
              <Box>
                <Box>
                  <Brightness1Icon
                    className={isExpired() ? "text-yellow-400" : "text-green-500"}
                    />
                  <Link
                    className='text-blue-500 ml-2 align-bottom'
                    target='_blank'
                    to={`${BACKEND_URL}/${certificate.file}`}
                    >
                    Certificato medico
                  </Link>
                  <Button size="small" variant='contained' color="error"
                    className="float-right"
                    onClick={async () => {
                      await axios.delete(
                        'http://localhost:8000/auth/account/certificate',
                        {
                          data: {
                            id: certificate.id
                          },
                          headers: {
                            'authorization': 'Bearer ' + await getAccessToken()
                          }
                        })
                        .then(_ => {
                          setRefresh(!refresh)
                        })
                        .catch(error => {
                          console.error(error);
                        });
                      }}
                      >
                    <DeleteIcon />
                  </Button>
                </Box>
                <Typography>
                  Scadenza: {certificate && certificate.expire_date}
                </Typography>
              </Box>
              : <>
                <Typography>Nessun certificato medico</Typography>
                <Button
                  variant="contained"
                  component="label"
                  className='m-4'
                  size='small'
                >
                  Carica certificato
                  <input
                    id="image"
                    type="file"
                    name="file"
                    hidden
                    onChange={e => handleFileUpload(e.target?.files?.[0])}
                  />
                </Button>
              </>
            : <Typography>Utente staff</Typography>
        }
      </CardContent>
    </Card>
  )
}