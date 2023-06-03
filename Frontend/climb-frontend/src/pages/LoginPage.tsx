import { Grid, Paper, Avatar, TextField, Button, Typography, Link, Box } from '@mui/material'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { login } from '../utils/login';
import { useNavigate } from 'react-router-dom';
import { useContext, useState } from 'react';
import { UserContext } from '../App';

export default function LoginPage() {
  const navigate = useNavigate()
  const { setUser } = useContext(UserContext)
  const [isError, setError] = useState<boolean | undefined>(false)

  const showFormError = () => {
    setError(true)
  }
  
  return (
    <Grid>
      <Paper elevation={10} className="p-12 h-[60%] w-[70%] m-auto mt-8 max-w-[50%]">
        <Grid 
          className='flex p-4 items-center justify-center' 
        >
          <Avatar className='mr-4'>
            <LockOutlinedIcon/>
          </Avatar>
          <h2>Sign In</h2>
        </Grid>
        <form
          onSubmit={async (e) => {
            e.preventDefault()
            const success = await login(
              (document.getElementById("usernameField") as HTMLInputElement).value,
              (document.getElementById("passwordField") as HTMLInputElement)?.value
            )
            if(!success)
              return showFormError()

            navigate("/")
            setUser(true)
          }}
        >
          <Box className="flex flex-col items-center mb-6">
            <Box className='m-4 w-full'>
              <TextField
                id="usernameField"
                label='Username'
                placeholder='Enter username' 
                variant="outlined"
                className='w-full'
                required 
              />
            </Box>
            <Box className='m-4 w-full'>
              <TextField
                id="passwordField"
                label='Password'
                error={isError}
                placeholder='Enter password' 
                variant="outlined"
                className='w-full'
                hidden
                type="password"
                required 
              />
            </Box>
            <Button 
              type='submit'
              color='primary' 
              variant="contained" 
              className='m-8'
            >
              Sign in
            </Button>
          </Box>
        </form>
        <Typography> Do you have an account?
          <Link href="#" className='pl-2' >
            Sign Up
          </Link>
        </Typography>
      </Paper>
    </Grid>
  )
}