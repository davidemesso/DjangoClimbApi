import { useContext, useEffect, useState } from "react";
import { UserInfoContext } from "../App";
import { useNavigate } from "react-router-dom";
import { getAccessToken, getUserInfo } from "../utils/auth";
import axios from "axios";
import { Autocomplete, Box, Button, Card, CardContent, TextField } from "@mui/material";
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
          console.log(response.data)
        })
        .catch(error => {
          console.error(error);
        });
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
      const message = event.data;
      setMessages((messages: any) => [message, ...messages]);
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
      <Card className="p-2 m-4">
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
            const data = JSON.parse(e);
            return <CompletionCard key={i} name={data.name} difficulty={data.difficulty} username={data.username}></CompletionCard>
          })
        }
      </Box>
    </Box>
  )
}