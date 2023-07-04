import { Badge, Box, Button, Card, CardContent, Typography } from '@mui/material';
import DifficultyRate from './DifficultyRate';
import CelebrationIcon from '@mui/icons-material/Celebration';
import { useContext, useEffect, useState } from 'react';
import './AnimatedBadge.css';
import { getAccessToken } from '../utils/auth';
import axios from 'axios';
import { UserInfoContext } from '../App';

interface CompletionCardProps {
  readonly id: number;
  readonly name: string;
  readonly difficulty: number;
  readonly username: string;
  readonly date: any;
  readonly reactions: number;
  readonly random: number;
}

const CompletionCard = ({ id, name, username, difficulty, date, reactions, random}: CompletionCardProps) => {
  const [zoomIn, setZoomIn] = useState(false);
  const [reactionsCount, setReactionsCount] = useState(reactions);
  const {userInfo} = useContext(UserInfoContext);

  useEffect(() => {
    setReactionsCount(reactions)
    setZoomIn(true);
    const timeout = setTimeout(() => {
      setZoomIn(false);
    }, 200);
    return () => clearTimeout(timeout);
  }, [reactions]);

  async function handleSendCongrats(): Promise<void> {
    const accessToken = await getAccessToken()

    if(!accessToken)
      return;

    await axios.get(`http://localhost:8000/api/routes/${id}/completion/reaction?random=${random}`,
    {
      headers: {
        'authorization': 'Bearer ' + accessToken
      }
    })
    .then(response => {
      console.log(response.data);
    })
    .catch(error => {
      console.error(error);
    });
    
    setReactionsCount(reactionsCount+1)
    setZoomIn(true)
  }

  return (
    <Card className="m-8 p-4 animate-in animate-out fade-in fade-out hover:scale-[101%]">
      <CardContent>
        <DifficultyRate rating={difficulty} ></DifficultyRate>
        <Typography variant="body1">
          L'utente {username} ha completato il percorso {name}, congratulati con lui!
        </Typography>
        <Typography variant='subtitle1'>
          {date}
        </Typography>
        <Box className="flex flex-row justify-between">
          <Button size="small" variant="contained" onClick={handleSendCongrats} disabled={userInfo.username == username}>ALE!</Button>
          <Box className={zoomIn && reactionsCount > 0 ? 'zoom-in' : ''}>
            <Badge badgeContent={reactionsCount} color="primary">
              <CelebrationIcon className={zoomIn ? 'zoom-in' : '!text-red-500'}/>
            </Badge>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default CompletionCard;