import { Grid, Paper, Avatar, TextField, Button, Typography, Link, Box } from '@mui/material'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { register } from '../utils/auth';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function SignupPage() {
  const navigate = useNavigate()
  const [isError, setError] = useState<boolean | undefined>(false)

  const showFormError = () => {
    setError(true)
  }
  
  return (
    <Grid>
      <Paper elevation={10} className="px-12 py-4 h-[60%] w-[80%] m-auto my-8 md:max-w-[50%]">
        <Grid 
          className='flex p-4 items-center justify-center' 
        >
          <Avatar className='mr-4'>
            <LockOutlinedIcon/>
          </Avatar>
          <h2>Sign up</h2>
        </Grid>
        <form
          onSubmit={async (e) => {
            e.preventDefault()

            const password = (document.getElementById("passwordField") as HTMLInputElement).value
            const confirmation = (document.getElementById("confirmPasswordField") as HTMLInputElement).value

            if (password != confirmation)
              return setError(true);

            const success = await register(
              (document.getElementById("emailField") as HTMLInputElement).value,
              (document.getElementById("usernameField") as HTMLInputElement).value,
              (document.getElementById("nameField") as HTMLInputElement).value,
              (document.getElementById("surnameField") as HTMLInputElement).value,
              (document.getElementById("passwordField") as HTMLInputElement).value
            )
            if(!success)
              return showFormError()

            navigate("/login")
          }}
        >
          <Box className="flex flex-col items-center mb-6">
            <Box className='m-3 w-full'>
              <TextField
                id="emailField"
                label='Email'
                placeholder='Inserisci email' 
                variant="outlined"
                className='w-full'
                type="email"
                required 
              />
            </Box>
            <Box className='m-3 w-full'>
              <TextField
                id="usernameField"
                label='Username'
                placeholder='Inserisci username' 
                variant="outlined"
                className='w-full'
                required 
              />
            </Box>
            <Box className='m-3 w-full'>
              <TextField
                id="nameField"
                label='Nome'
                placeholder='Inserisci nome' 
                variant="outlined"
                className='w-full'
                required 
              />
            </Box>
            <Box className='m-3 w-full'>
              <TextField
                id="surnameField"
                label='Cognome'
                placeholder='Inserisci cognome' 
                variant="outlined"
                className='w-full'
                required 
              />
            </Box>
            <Box className='m-3 w-full'>
              <TextField
                id="passwordField"
                label='Password'
                error={isError}
                placeholder='Inserisci password' 
                variant="outlined"
                className='w-full'
                hidden
                type="password"
                required 
              />
            </Box>
            <Box className='m-3 w-full'>
              <TextField
                id="confirmPasswordField"
                label='Conferma password'
                error={isError}
                placeholder='Conferma password' 
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
              Registrati
            </Button>
          </Box>
        </form>
        <Typography> Hai già un account?
          <Link href="login" className='pl-2' >
            Login
          </Link>
        </Typography>
      </Paper>
    </Grid>
  )
}