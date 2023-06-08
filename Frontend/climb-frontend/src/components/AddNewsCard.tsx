import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { Avatar, Box, TextField } from '@mui/material';

export default function AddNewsCard() {
  return (
    <Card className="m-8 animate-in animate-out fade-in fade-out hover:scale-[101%] capitalize">
      <Box className="flex items-center">
        <Avatar className='m-2'>
          <AdminPanelSettingsIcon />
        </Avatar>
        <Typography>
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
            />
          </Box>
        </Box>
      </CardContent>
      <CardActions>
        <Button size="small">Aggiungi</Button>
        <Button size="small">Annulla</Button>
      </CardActions>
    </Card>
  );
}