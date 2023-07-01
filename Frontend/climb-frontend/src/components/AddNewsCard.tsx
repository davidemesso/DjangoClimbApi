import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { Avatar, Box, TextField } from '@mui/material';
import { useContext, useState } from 'react';
import { UserInfoContext } from '../App';
import axios from 'axios';
import { getAccessToken } from '../utils/auth';

interface AddNewsCardProps {
  readonly setRefresh : any
  readonly refresh : any
}

export default function AddNewsCard({setRefresh, refresh} : AddNewsCardProps) {
  const [error, setError] = useState(false)
  const {userInfo} = useContext(UserInfoContext);  

  async function handleAddNews(): Promise<void> {
    const title = document.getElementById("titleField") as HTMLInputElement
    const content = document.getElementById("contentField") as HTMLInputElement

    const success = await axios.post(
      'http://localhost:8000/api/news',
      {
        "title": title.value,
        "content": content.value,
        "posted_by": userInfo.id,
      },
      {
        headers: {
          'authorization': 'Bearer ' + await getAccessToken()
        }
      }
    )
    .then(_ => {
      return true
    })
    .catch(_ => {
      return false
    })

    setError(!success)

    if(!success)
      return

    handleClear()
    
    setRefresh(!refresh)
  }

  function handleClear(): void {
    const title = document.getElementById("titleField") as HTMLInputElement
    const content = document.getElementById("contentField") as HTMLInputElement

    title.value = ""
    content.value = ""
  }

  return (
    <Card className="m-8 p-4 animate-in animate-out fade-in fade-out hover:scale-[101%] capitalize">
      <Box className="flex items-center">
        <Avatar className='m-2'>
          <AdminPanelSettingsIcon />
        </Avatar>
        <Typography textTransform="none">
          Aggiungi una nuova notizia
        </Typography>
      </Box>
      <CardContent>
        <Box className="flex flex-col items-center my-0">
          <Box className='m-4 mt-0 w-full'>
            <TextField
              id="titleField"
              inputProps={{ maxLength: 100 }}
              label='Titolo'
              placeholder='Inserisci titolo' 
              variant="outlined"
              className='w-full'
              required 
              multiline
              error={error}
            />
          </Box>
          <Box className='m-4 mb-0 w-full'>
            <TextField
              id="contentField"
              label='Contenuto'
              inputProps={{ maxLength: 1500 }}
              placeholder='Inserisci contenuto' 
              variant="outlined"
              className='w-full'
              required 
              multiline
              error={error}
            />
          </Box>
        </Box>
      </CardContent>
      <CardActions>
        <Button size="small" onClick={handleAddNews}>Aggiungi</Button>
        <Button size="small" onClick={handleClear}>Annulla</Button>
      </CardActions>
    </Card>
  );
}