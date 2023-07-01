import { CardHeader, IconButton, Collapse, IconButtonProps, styled, CardMedia, Tooltip, Box, Button } from '@mui/material';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useState, useContext } from 'react';
import DifficultyRate from './DifficultyRate';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import UndoIcon from '@mui/icons-material/Undo';
import { UserInfoContext } from '../App';
import axios from 'axios';
import { getAccessToken } from '../utils/auth';
import { Favorite } from '../sections/RoutesSection';
import { BACKEND_URL } from '../utils/urls';

interface RouteCardProps {
  readonly id: number;
  readonly title: string;
  readonly description: string;
  readonly endDate: string;
  readonly difficulty: number;
  readonly image: any;
  readonly favoritesCount: number;
  readonly favorites: Array<Favorite>;
  readonly refresh: any;
  readonly setRefresh: any;
  readonly disableFavorites: boolean;
}

interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

export default function RouteCard({
  id,
  title,
  description,
  endDate,
  difficulty,
  image,
  favoritesCount,
  favorites,
  refresh,
  setRefresh,
  disableFavorites = false
}: RouteCardProps) {
  const { userInfo } = useContext(UserInfoContext);
  const [expanded, setExpanded] = useState(false);
  const [clicked, setClicked] = useState<boolean | null>(null);
  const [count, setCount] = useState(favoritesCount);
  const [editable, setEditable] = useState<boolean>(false)
  const [error, setError] = useState<boolean>(false)

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  async function handleFavorite(): Promise<void> {
    const accessToken = await getAccessToken()

    if(!accessToken)
      return;

    const status = await axios.post(
      `http://localhost:8000/api/routes/${id}/favorites`,
      {},
      {
        headers: {
          'authorization': 'Bearer ' + accessToken
        }
      }
    ).then(data => {
      return data.status
    })
      .catch(_ => {
        return null
      });

    if (status == null)
      return

    if (status == 201) {
      setClicked(true)
      setCount(count + 1)
    }

    if (status == 204) {
      setClicked(false)
      setCount(count - 1)
    }
  }

  function containsFavorite(favorites: Favorite[], id: number): boolean {
    return favorites.some(obj => obj.route === id) && clicked == null
  }

  return (
    <Card className="m-8 animate-in animate-out fade-in fade-out hover:scale-[101%] capitalize table">
      <CardHeader
        title={
          <Typography
            id={"titleField"+id}
            gutterBottom 
            variant="h5"
            contentEditable={editable}
            suppressContentEditableWarning
            className={editable ? "border-b-2 border-solid " + (error ? "border-red-500" : "") : ""}
          >
            {title}
          </Typography>
        }
        subheaderTypographyProps={{textTransform: "none"}}
        subheader={`${new Date(endDate) < new Date() ? "Tolto il: ": "Fino al:"} ${endDate ?? "TBD"}`}
        action={<DifficultyRate rating={difficulty} />}
      />
      <CardContent>
        <CardMedia
          component="img"
          className='!object-contain max-h-80'
          image={BACKEND_URL + image}
          alt="Route img"
        />
      </CardContent>
      <CardActions disableSpacing>
        <Tooltip title={userInfo ? "Preferito" : "Accedi per aggiungere ai preferiti"}>
          <Box className="flex items-center">
            <IconButton
              className={clicked ? "!text-red-600" : "!text-gray-500"}
              aria-label="add to favorites"
              disabled={userInfo == null || disableFavorites}
              onClick={handleFavorite}
            >
              <FavoriteIcon className={containsFavorite(favorites, id) ? "text-red-600" : ""} />
            </IconButton>
            <Typography>
              {count}
            </Typography>
          </Box>
        </Tooltip>
        <ExpandMore
          expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </ExpandMore>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography
            whiteSpace="pre-wrap"
            textTransform="none"
            contentEditable={editable}
            id={"descriptionField"+id}
            suppressContentEditableWarning
            className={editable ? "border-b-2 border-solid " + (error ? "border-red-500" : "") : ""}
          >
            {description}
          </Typography>
        </CardContent>
      </Collapse>
      {
        userInfo && userInfo.isStaff && !disableFavorites
          ? <CardActions className='flex flex-row-reverse m-4 mt-0'>
            <Button size="small" variant='contained' color="error"
              onClick={async () => {
                await axios.delete(
                  'http://localhost:8000/api/routes',
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
                setExpanded(true)

                if (!editable)
                  return

                const newTitle = document.getElementById("titleField" + id)?.innerText
                const newDescription = document.getElementById("descriptionField" + id)?.innerText

                const success = await axios.put(
                  'http://localhost:8000/api/routes',
                  {
                    name: newTitle,
                    description: newDescription,
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
          </CardActions> : <></>
      }
    </Card>
  );
}