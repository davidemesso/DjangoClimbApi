import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { Avatar, Box, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { useState } from 'react';
import axios from 'axios';
import { getAccessToken } from '../utils/auth';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import dayjs, { Dayjs } from 'dayjs';
import DifficultyRate from './DifficultyRate';

interface AddRouteCardProps {
  readonly setRefresh : any
  readonly refresh : any
}

export default function AddRouteCard({setRefresh, refresh} : AddRouteCardProps) {
  const [error, setError] = useState(false)
  const [file, setFile] = useState<any>(null)
  const [date, setDate] = useState<Dayjs | null>(dayjs(Date()))
  const [difficulty, setDifficulty] = useState<string>("1");

  async function handleAdd(): Promise<void> {
    const name = document.getElementById("titleField") as HTMLInputElement
    const description = document.getElementById("descriptionField") as HTMLInputElement

    const formData = new FormData()
    formData.append("name", name.value)
    formData.append("description", description.value)
    formData.append("difficulty", difficulty)
    formData.append("image", file)
    formData.append("end_date", date?.format("YYYY-MM-DD") ?? "")


    const success = await axios.post(
      'http://localhost:8000/api/routes',
      formData,
      {
        headers: {
          'authorization': 'Bearer ' + await getAccessToken(),
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

    setError(!success)

    if(!success)
      return

    handleClear()

    setRefresh(!refresh)
  }

  function handleClear(): void {
    const title = document.getElementById("titleField") as HTMLInputElement
    const content = document.getElementById("descriptionField") as HTMLInputElement
    const difficulty = document.getElementById("difficultyField") as HTMLInputElement

    title.value = ""
    content.value = ""
    difficulty.value = ""
    setFile(null)
    setDate(dayjs(Date()))
  }

  const handleFileUpload = (file: any) => {
    console.log(file)
    setFile(file)
  };

  return (
    <Card className="m-8 p-4 animate-in animate-out fade-in fade-out hover:scale-[101%] capitalize">
      <Box className="flex items-center">
        <Avatar className='m-2'>
          <AdminPanelSettingsIcon />
        </Avatar>
        <Typography textTransform="none">
          Aggiungi un nuovo percorso
        </Typography>
      </Box>
      <CardContent>
        <Box className="flex flex-col items-center my-0">
          <Box className='m-4 mt-0 w-full'>
            <TextField
              id="titleField"
              inputProps={{ maxLength: 180 }}
              label='Titolo'
              placeholder='Inserisci titolo' 
              variant="outlined"
              className='w-full'
              required 
              multiline
              error={error}
            />
          </Box>
          <Box className='m-4 w-full'>
            <TextField
              id="descriptionField"
              label='Descrizione'
              inputProps={{ maxLength: 500 }}
              placeholder='Inserisci descrizione' 
              variant="outlined"
              className='w-full'
              required 
              multiline
              error={error}
            />
          </Box>
          <Box className='m-4 w-full'>
            <FormControl fullWidth>
              <InputLabel id="difficultyLabel">Difficoltà</InputLabel>
              <Select
                labelId="difficultyLabel"
                id="difficultyField"
                label="Difficoltà"
                value={difficulty}
                onChange={e => setDifficulty(e.target.value)}
              >
                <MenuItem value={1}><DifficultyRate rating={1}/></MenuItem>
                <MenuItem value={2}><DifficultyRate rating={2}/></MenuItem>
                <MenuItem value={3}><DifficultyRate rating={3}/></MenuItem>
                <MenuItem value={4}><DifficultyRate rating={4}/></MenuItem>
                <MenuItem value={5}><DifficultyRate rating={5}/></MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Box className="flex !justify-evenly w-full">
            <Box className="flex flex-col">
              <Button
                variant="contained"
                component="label"
                className='m-4'
                size='small'
                >
                  Immagine
                <input
                  id="image"
                  type="file"
                  name="file"
                  accept="image/*"
                  hidden
                  onChange={e => handleFileUpload(e.target?.files?.[0])}
                />
              </Button>
              <Typography className='!mb-4 mx-auto w-full'>
                {file?.name ?? "No file"}
              </Typography>
            </Box>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Seleziona data"
                value={date}
                minDate={dayjs(Date())}
                onChange={(newValue) => setDate(newValue)}
                />
            </LocalizationProvider>
          </Box>
        </Box>
      </CardContent>
      <CardActions>
        <Button size="small" onClick={handleAdd}>Aggiungi</Button>
        <Button size="small" onClick={handleClear}>Annulla</Button>
      </CardActions>
    </Card>
  );
}