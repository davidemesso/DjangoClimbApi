import { Box, Button, CardActions, TextField, Tooltip } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import UndoIcon from '@mui/icons-material/Undo';
import { useContext, useState } from 'react';
import { UserInfoContext } from '../App';
import axios from 'axios';
import { getAccessToken } from '../utils/auth';
import AddTaskIcon from '@mui/icons-material/AddTask';

interface CourseCardProps {
  readonly title: string;
  readonly description: string;
  readonly date: Date;
  readonly username: string;
  readonly id: number;
  readonly price: number;
  readonly maxPeople: number;
  readonly setRefresh : any;
  readonly refresh : any;
  readonly participantsCount : number;
  readonly participations : Array<number>;
}

export default function CourseCard({title, description, date, username, id, price, maxPeople, participantsCount, participations, setRefresh, refresh} : CourseCardProps) {
  const {userInfo} = useContext(UserInfoContext);
  const [editable, setEditable] = useState<boolean>(false)
  const [error, setError] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string | null>()
  const [participants, setParticipants] = useState<Array<any>>([])
  
  return (
    <Card className="m-8 animate-in animate-out fade-in fade-out hover:scale-[101%] capitalize">
      <CardContent>
        <Typography id={"titleField"+id} 
          contentEditable={editable} 
          suppressContentEditableWarning 
          gutterBottom 
          variant="h5" 
          component="div"
          textTransform="none"
          color={error? "red" : "text.primary"}
          className={editable ? "border-b-2 border-solid " + (error ? "border-red-500" : "") : ""}
        >
          {title}
        </Typography>
        <Typography id={"descriptionField"+id} 
          contentEditable={editable} 
          suppressContentEditableWarning={true} 
          variant="body1"
          whiteSpace="pre-wrap"
          textTransform="none"
          color={error? "red" : "text.primary"}
          className={editable ? "border-b-2 border-solid " + (error ? "border-red-500" : "") : ""}
        >
          {description}
        </Typography>
        <Typography
          variant="body2"
          whiteSpace="pre-wrap"
          textTransform="none"
          color="text.primary"
        >
          {price} €
        </Typography>
        <Box className="flex flex-col mt-2">
          <Typography variant="body2" color="text.secondary" textTransform="none">
            {date?.toString()}
          </Typography>
          <Typography variant="body2" color="text.secondary" textTransform="none">
            Tenuto da {username}
          </Typography>
          <Typography variant="body2" color="text.secondary" textTransform="none">
            Massimo {maxPeople} iscritti
          </Typography>
          <Typography variant="body2" color="text.secondary" textTransform="none">
            {maxPeople - participantsCount} posti rimasti
          </Typography>
          {
            editable &&
            <Box className="p-8">
              <TextField 
                id={"priceField"+id}
                label='Prezzo'
                placeholder='Inserisci prezzo' 
                defaultValue={price}
                error={error}
                InputProps={{ type:'number', inputProps: { min: 0 } }} 
                />
              <TextField 
                id={"maxPeopleField"+id}
                label='Iscritti massimi'
                placeholder='Inserisci massimo iscrizioni' 
                defaultValue={maxPeople}
                error={error}
                InputProps={{ type:'number', inputProps: { min: 0 } }} 
              />
            </Box>
          }
          {
            userInfo && userInfo.isStaff
            ? <CardActions className='flex flex-row-reverse'>
                <Button size="small" variant='contained' color="error"
                  onClick={async () => {
                    await axios.delete(
                      'http://localhost:8000/courses/', 
                      { 
                        data: {
                          id: id
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
                <Button size="small" variant='contained' color={editable ? "success" : "warning"} className='!mr-8'
                  onClick={async () => {
                    setEditable(true)
                    
                    if(!editable)
                      return

                    const newTitle = document.getElementById("titleField"+id)?.innerText
                    const newDescription = document.getElementById("descriptionField"+id)?.innerText
                    const newPrice = document.getElementById("priceField"+id) as HTMLInputElement
                    const newMaxPeople = document.getElementById("maxPeopleField"+id) as HTMLInputElement

                    const success = await axios.put(
                      'http://localhost:8000/courses/',
                      { 
                        title: newTitle,
                        description: newDescription,
                        id: id,
                        price: newPrice.value,
                        max_people: newMaxPeople.value
                      },
                      {
                        headers: {
                          'authorization': 'Bearer ' + await getAccessToken()
                        }
                      })
                      .then(_ => {
                        setRefresh(!refresh)
                        return true
                      })
                      .catch(_ => {
                        return false
                      });

                      setError(!success)
                      setEditable(!success)
                  }}
                >
                  {
                    editable 
                      ? <CheckIcon />
                      : <EditIcon />
                  }
                </Button>
                {
                  editable 
                    ? <Button size="small" variant='contained' color="warning" className='!mr-8'
                    onClick={() => {
                      setRefresh(!refresh)
                    }}
                  >
                    <UndoIcon />
                  </Button>
                  : <></> 
                }
              </CardActions>
            : <></>
          }
          <Tooltip title={!userInfo && "Accedi per poter partecipare"}>
            <Box className="w-[40%] !mt-4">
              <Button size="small" variant='contained' color="primary"
                disabled={!userInfo || (maxPeople - participantsCount <= 0 && !participations.includes(id))}
                onClick={async () => {
                  
                  const accessToken = await getAccessToken()
                  if (!accessToken)
                  return;
                  
                  setErrorMessage("")
                  await axios.post(
                    `http://localhost:8000/courses/${id}/participation`, 
                    {},
                    {
                      headers: {
                        'authorization': 'Bearer ' + accessToken
                      }
                    })
                    .then(_ => {
                      setRefresh(!refresh)
                    })
                    .catch(error => {
                      if (error.response.status == 400)
                        setErrorMessage("Partecipi già a questo corso")

                      if (error.response.status == 403)
                        setErrorMessage("Sono esauriti i posti")
                    });
                }}
              >
                  <AddTaskIcon className='p-1' />
                  {!participations.includes(id) ? "Partecipa" : "Annulla partecipazione"}
              </Button>
            </Box>
          </Tooltip>
          {
            userInfo && userInfo.isStaff &&
            <Box className="w-[40%] !mt-4">
              <Button size="small" variant='contained' color="primary"
                onClick={async () => {
                  
                  const accessToken = await getAccessToken()
                  if (!accessToken)
                  return;
                  
                  await axios.get(
                    `http://localhost:8000/courses/${id}/participation`,
                    {
                      headers: {
                        'authorization': 'Bearer ' + accessToken
                      }
                    })
                    .then(response => {
                      setParticipants(response.data)
                      console.log(response.data)
                    })
                    .catch(error => {
                      console.log(error)
                    });
                  }}
                  >
                  Visualizza partecipanti
              </Button>
            </Box>
          }
          <Typography textTransform={"none"} className='text-red-500 !m-2'>
            {errorMessage}
          </Typography>
          {
            participants.length != 0 && participants.map(p =>
              <Typography 
                textTransform={"none"} 
                className='!m-2'
                key={p.username}
              >
                {p.username}
              </Typography>
            )
          }
        </Box>
      </CardContent>
    </Card>
  );
}