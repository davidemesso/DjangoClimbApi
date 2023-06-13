import { Box, Button, CardActions } from '@mui/material';
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

interface NewsCardProps {
  readonly title: string;
  readonly content: string;
  readonly insertDate: Date;
  readonly username: string;
  readonly id: number;
  readonly setRefresh : any;
  readonly refresh : any;
}

export default function NewsCard({title, content, insertDate, username, id, setRefresh, refresh} : NewsCardProps) {
  const {userInfo} = useContext(UserInfoContext);
  const [editable, setEditable] = useState<boolean>(false)
  const [error, setError] = useState<boolean>(false)
  
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
        <Typography id={"contentField"+id} 
          contentEditable={editable} 
          suppressContentEditableWarning={true} 
          variant="body2"
          whiteSpace="pre-wrap"
          textTransform="none"
          color={error? "red" : "text.primary"}
          className={editable ? "border-b-2 border-solid " + (error ? "border-red-500" : "") : ""}
        >
          {content}
        </Typography>
        <Box className="flex flex-col mt-2">
          <Typography variant="body2" color="text.secondary">
            {insertDate?.toString()}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {username}
          </Typography>
          {
            userInfo && userInfo.isStaff
            ? <CardActions className='flex flex-row-reverse'>
                <Button size="small" variant='contained' color="error"
                  onClick={async () => {
                    await axios.delete(
                      'http://localhost:8000/api/news', 
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
                    const newContent = document.getElementById("contentField"+id)?.innerText

                    const success = await axios.put(
                      'http://localhost:8000/api/news',
                      { 
                        title: newTitle,
                        content: newContent,
                        id: id
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
        </Box>
      </CardContent>
    </Card>
  );
}