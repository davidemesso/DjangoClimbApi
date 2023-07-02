import { Button, Card, CardContent, Typography } from '@mui/material';
import DifficultyRate from './DifficultyRate';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';

interface CompletionCardProps {
  readonly name: string;
  readonly difficulty: number;
  readonly username: string;
}

const CompletionCard = ({ name, username, difficulty }: CompletionCardProps) => {
  const [date, setDate] = useState<any>()
  
  useEffect(() => {
    setDate(dayjs(Date()).format("YYYY-MM-DD HH-mm"))
  }, [])
  
  function handleSendCongrats(): void {
    throw new Error('Function not implemented.');
  }

  return (
    <Card className="p-2 m-4">
      <CardContent>
        <DifficultyRate rating={difficulty} ></DifficultyRate>
        <Typography variant="body1">
          L'utente {username} ha completato il percorso {name}, congratulati con lui!
        </Typography>
        <Typography variant='subtitle1'>
          {date}
        </Typography>
        <Button size="small" variant="contained" onClick={handleSendCongrats}>ALE!</Button>
      </CardContent>
    </Card>
  );
};

export default CompletionCard;