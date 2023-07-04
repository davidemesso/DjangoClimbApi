import { useContext, useEffect, useState } from "react";
import { UserInfoContext } from "../App";
import { useNavigate } from "react-router-dom";
import { getAccessToken, getUserInfo } from "../utils/auth";
import axios from "axios";
import { Autocomplete, Box, Button, Card, CardContent, TextField, Typography } from "@mui/material";
import CompletionCard from "../components/CompletionCard";

interface Route {
  readonly id: number;
  readonly name: string;
  readonly difficulty: number;
}

export default function CompletionsSection() {
  const [error, setError] = useState<boolean>(false)
  const [routes, setRoutes] = useState<Array<Route>>([])
  const [messages, setMessages] = useState<any>([])
  const [socket, setSocket] = useState<any>()
  const [selectedRoute, setSelectedRoute] = useState<number | undefined>()
  const {userInfo} = useContext(UserInfoContext);
  const navigate = useNavigate()

  useEffect(() => {
    axios.get(`http://localhost:8000/api/routes?difficulty=0`)
    .then(response => {
      setRoutes(response.data);
    })
    .catch(error => {
      console.error(error);
    });

    const fetchData = async () => {
      const userInfo = await getUserInfo()
      if (userInfo == null)
        return navigate("/") 
    }

    fetchData()
      .catch(console.error);

    if(socket)
      socket.close()
    const ws = new WebSocket('ws://localhost:8000/ws');
    setSocket(ws)
  }, []);

  if(socket)
  {
    socket.onopen = () => {
      console.log('WebSocket connection established');
    };
    
    socket.onmessage = (event:any) => {
      const data = JSON.parse(event.data);
      if (data.type == "completion")
      {
        data.message.reactions = 0;
        setMessages((messages: any) => [data.message, ...messages]);
      }
      else if (data.type == "reaction")
      {
        const index = messages.findIndex((message: any) => 
          (message.id === data.message.id) && (message.random == data.message.random));
        const messagesCopy = [...messages]
        if (index !== -1)
        {
          messagesCopy[index].reactions += 1;
          setMessages(messagesCopy);
        }
      }
    };
    
    socket.onclose = () => {
      console.log('WebSocket connection closed');
    };
  }


  if (!userInfo)
    return <></>

  async function handleRouteCompletion(): Promise<void> {
    if (!selectedRoute)
    {
      setError(true);
      return;
    }
    setError(false);

    const accessToken = await getAccessToken()

    if(!accessToken)
      return;

    await axios.get(`http://localhost:8000/api/routes/${selectedRoute}/completion`,
    {
      headers: {
        'authorization': 'Bearer ' + accessToken
      }
    })
    .then(response => {
      console.log(response.data);
    })
    .catch(error => {
      setError(true);
      console.error(error);
    });
  }

  return (
    <Box>
      <Card className="m-8 p-4">
        <Typography variant="h6">
          Inserisci il percorso completato
        </Typography>
        <CardContent>
          <Box className="flex justify-between w-full">
            <Autocomplete
              isOptionEqualToValue={(option, value) => option.label == value.label}
              disablePortal
              className="w-[70%]"
              id="routeField"
              onChange={(_, value) => setSelectedRoute(value?.id)}
              options={routes.map(r => {
                return {label: r.name, id: r.id}
              })}
              renderInput={(params) => <TextField {...params} label="Percorso" error={error} />}
              />
            <Button size="small" variant="contained" onClick={handleRouteCompletion}>Completato</Button>
          </Box>
        </CardContent>
      </Card>
      <Box className="flex flex-col">
        {
          messages.map((e: any, i : number) => {
            const data = e;
            return <CompletionCard 
              key={i} 
              id={data.id}
              name={data.name} 
              difficulty={data.difficulty} 
              username={data.username}
              date={data.date}
              reactions={data.reactions ?? 0}
              random={data.random}
            ></CompletionCard>
          })
        }
      </Box>
    </Box>
  )
}