import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { Autocomplete, Avatar, Box, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { getAccessToken } from '../utils/auth';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import dayjs, { Dayjs } from 'dayjs';

interface AddCourseCardProps {
  readonly setRefresh : any
  readonly refresh : any
}

interface StaffMember {
  readonly id : number
  readonly username: string
}

export default function AddCourseCard({setRefresh, refresh} : AddCourseCardProps) {
  const [error, setError] = useState(false)
  const [staff, setStaff] = useState<Array<StaffMember>>([])
  const [selectedStaff, setSelectedStaff] = useState<number>()
  const [date, setDate] = useState<Dayjs | null>(dayjs(Date()))

  useEffect(() => {
    const fetchData = async () => {
      const accessToken = await getAccessToken()

      if (!accessToken)
        return;

      await axios.get('http://localhost:8000/api/users/staff',
      {
        headers: {
          'authorization': 'Bearer ' + accessToken
        }
      })
      .then(response => {
        setStaff(response.data)
      })
      .catch(error => {
        console.error(error);
      });
    }

    fetchData()
      .catch(console.error);
  }, []);

  async function handleAddCourse(): Promise<void> {
    const title = document.getElementById("titleField") as HTMLInputElement
    const description = document.getElementById("descriptionField") as HTMLInputElement
    const maxPeople = document.getElementById("maxPeopleField") as HTMLInputElement
    const price = document.getElementById("priceField") as HTMLInputElement

    const success = await axios.post(
      'http://localhost:8000/courses/',
      {
        "title": title.value,
        "description": description.value,
        "held_by": selectedStaff,
        "max_people": maxPeople.value,
        "date": date ?? "",
        "price": price.value,
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
    const description = document.getElementById("descriptionField") as HTMLInputElement

    title.value = ""
    description.value = ""
    setDate(dayjs(Date()))
  }

  return (
    <Card className="m-8 p-4 animate-in animate-out fade-in fade-out hover:scale-[101%] capitalize">
      <Box className="flex items-center">
        <Avatar className='m-2'>
          <AdminPanelSettingsIcon />
        </Avatar>
        <Typography textTransform="none">
          Aggiungi un nuovo corso
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
          <Box className='m-4 mt-0 w-full'>
            <TextField
              id="descriptionField"
              label='Descrizione'
              inputProps={{ maxLength: 1500 }}
              placeholder='Inserisci descrizione' 
              variant="outlined"
              className='w-full'
              required 
              multiline
              error={error}
            />
          </Box>
          <Autocomplete
            isOptionEqualToValue={(option, value) => option.label == value.label}
            disablePortal
            fullWidth
            id="staffField"
            onChange={(_, value) => setSelectedStaff(value?.id)}
            options={staff.map(user => {
              return {label: user.username, id: user.id}
            })}
            renderInput={(params) => <TextField {...params} label="Staff" />}
          />
          <Box className="my-4 flex justify-between w-full">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker
                label="Seleziona data"
                value={date}
                minDate={dayjs(Date())}
                onChange={(newValue) => setDate(newValue)}
                />
            </LocalizationProvider>
            <input
              id="priceField"
              type='number'
              step="0.1"
              min='0'
              placeholder='Inserisci prezzo'
              className={`border rounded p-2 border-solid ${error?"border-red-500":"border-[darkgrey]"}`}
            />
            <TextField 
              id="maxPeopleField"
              label='Iscritti massimi'
              placeholder='Inserisci massimo iscrizioni' 
              error={error}
              InputProps={{ type:'number', inputProps: { min: 0 } }} 
            />
          </Box>
        </Box>
      </CardContent>
      <CardActions>
        <Button size="small" onClick={handleAddCourse}>Aggiungi</Button>
        <Button size="small" onClick={handleClear}>Annulla</Button>
      </CardActions>
    </Card>
  );
}