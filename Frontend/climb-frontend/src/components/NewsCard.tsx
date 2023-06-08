import { Box, Button, CardActions } from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import DeleteIcon from '@mui/icons-material/Delete';
import { useContext } from 'react';
import { UserInfoContext } from '../App';

interface NewsCardProps {
  readonly title: string;
  readonly content: string;
  readonly insertDate: Date;
  readonly username: string;
}

export default function NewsCard({title, content, insertDate, username} : NewsCardProps) {
  const {userInfo} = useContext(UserInfoContext);
  
  return (
    <Card className="m-8 animate-in animate-out fade-in fade-out hover:scale-[101%] capitalize">
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {title}
        </Typography>
        <Typography variant="body2" color="text.primary">
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
                <Button size="small" variant='contained' color="error">
                  <DeleteIcon />
                </Button>
              </CardActions>
            : <></>
          }
        </Box>
      </CardContent>
    </Card>
  );
}