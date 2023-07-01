import axios from "axios";
import { useContext, useEffect, useState } from "react";
import RouteCard from "../components/RouteCard";
import { getAccessToken } from "../utils/auth";
import { Box, Button, Checkbox, FormControl, FormControlLabel, InputLabel, MenuItem, Select, Typography } from "@mui/material";
import { UserInfoContext } from "../App";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import AddRouteCard from "../components/AddRouteCard";
import DifficultyRate from "../components/DifficultyRate";

interface Route {
  readonly id: number;
  readonly name: string;
  readonly description: string;
  readonly end_date: string;
  readonly difficulty: number;
  readonly image: any;
  readonly favorites_count: number;
}

export interface Favorite {
  readonly route: number;
}

function RoutesSection() {
  const [routes, setRoutes] = useState<Array<Route>>([]);
  const [favorites, setFavorites] = useState<Array<Favorite>>([]);
  const [refresh, setRefresh] = useState<boolean>();
  const [difficulty, setDifficulty] = useState<string>("0");
  const [descending, setDescending] = useState<boolean>(true);
  const [showOld, setShowOld] = useState<boolean>(false);
  const {userInfo} = useContext(UserInfoContext);

  useEffect(() => {
    axios.get(`http://localhost:8000/api/routes?desc=${descending}&difficulty=${difficulty}&showOld=${showOld}`)
      .then(response => {
        setRoutes(response.data);
      })
      .catch(error => {
        console.error(error);
      });

    const fetchData = async () => {
      const accessToken = await getAccessToken()

      if(!accessToken)
        return;

      await axios.get('http://localhost:8000/api/user/favorites',
      {
        headers: {
          'authorization': 'Bearer ' + accessToken
        }
      })
      .then(response => {
        setFavorites(response.data);
      })
      .catch(error => {
        console.error(error);
      });
    }

    fetchData()
      .catch(console.error);
  }, [refresh, difficulty, descending, showOld]);

  const elements = routes.map((route: Route) =>
    <RouteCard 
      key={route.name + Math.random()}
      id={route.id}  
      title={route.name}
      description={route.description}  
      endDate={route.end_date}  
      difficulty={route.difficulty}  
      favoritesCount={route.favorites_count}
      favorites={favorites}
      image={route.image}
      refresh={refresh}
      setRefresh={setRefresh}
    />
  );

  return (
    <Box>
      {userInfo && userInfo.isStaff ? <AddRouteCard setRefresh={setRefresh} refresh={refresh}/> : <></>}
      <Box className="flex justify-evenly mt-4">
        <Button 
          variant="contained" 
          size="small"
          endIcon={descending ? <ArrowDropDownIcon /> : <ArrowDropUpIcon />} 
          onClick={() => setDescending(!descending)}
        >
          Ordina preferiti
        </Button>
        <FormControl className="w-[30%]">
          <InputLabel id="difficultyLabel">Difficoltà</InputLabel>
          <Select
            labelId="difficultyLabel"
            id="difficultyField"
            label="Difficoltà"
            value={difficulty}
            className="text-black"
            onChange={e => setDifficulty(e.target.value)}
            >
            <MenuItem value={0}>Tutte</MenuItem>
            <MenuItem value={1}><DifficultyRate rating={1}/></MenuItem>
            <MenuItem value={2}><DifficultyRate rating={2}/></MenuItem>
            <MenuItem value={3}><DifficultyRate rating={3}/></MenuItem>
            <MenuItem value={4}><DifficultyRate rating={4}/></MenuItem>
            <MenuItem value={5}><DifficultyRate rating={5}/></MenuItem>
          </Select>
        </FormControl>
        <FormControlLabel control={<Checkbox onChange={(e) => setShowOld(e.target.checked)}/>} label="Vecchi" />
      </Box>
      <Box className="flex flex-col w-full mx-auto h-fit">
        {elements}
        {elements.length == 0 && 
          <Typography className="mt-4 text-center">
            Nessun percorso trovato
          </Typography>
        }
      </Box>
    </Box>
  );
}
export default RoutesSection;