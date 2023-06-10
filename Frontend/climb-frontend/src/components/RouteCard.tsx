import { CardHeader, IconButton, Collapse, IconButtonProps, styled, CardMedia, Tooltip, Box } from '@mui/material';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useState, useContext } from 'react';
import DifficultyRate from './DifficultyRate';
import { UserInfoContext } from '../App';
import axios from 'axios';
import { getAccessToken } from '../utils/auth';

interface RouteCardProps {
  readonly id: number;
  readonly title: string;
  readonly description: string;
  readonly endDate: string;
  readonly difficulty: number;
  readonly favoritesCount: number;
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

export default function RouteCard({id, title, description, endDate, difficulty, favoritesCount} : RouteCardProps) {
  const {userInfo} = useContext(UserInfoContext);
  const [expanded, setExpanded] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  async function handleFavorite(): Promise<void> {
    await axios.post(
      `http://localhost:8000/api/routes/${id}/favorites`,
      {},
      {
        headers: {
          'authorization': 'Bearer ' + await getAccessToken()
        }
      }
    );

    
  }

  return (
    <Card className="m-8 animate-in animate-out fade-in fade-out hover:scale-[101%] capitalize table">
      <CardHeader
        title={title}
        subheader={endDate ?? "Scadenza TBD"}
        action={<DifficultyRate rating={difficulty}/>}
      />
      <CardContent>
        <CardMedia
          component="img"
          height="194"
          image="/static/images/route.png"
          alt="Paella dish"
        />
      </CardContent>
      <CardActions disableSpacing>
        <Tooltip title={userInfo ? "Preferito" : "Accedi per selezionare"}>
          <Box className="flex items-center">
            <IconButton 
              className='hover:text-red-600' 
              aria-label="add to favorites" 
              disabled={userInfo == null}
              onClick={handleFavorite}
            >
              <FavoriteIcon/>
            </IconButton>
            <Typography>
              {favoritesCount}
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
          <Typography paragraph>
            {description}
          </Typography>
        </CardContent>
      </Collapse>
    </Card>
  );
}