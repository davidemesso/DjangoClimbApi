import React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import { logout } from '../utils/auth';
import { useContext } from "react";
import { UserContext } from '../App';
import { UserInfoContext } from '../App';
import { useNavigate } from 'react-router-dom';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';


export default function ClimbAppBar() {
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
  const { user, setUser } = useContext(UserContext);
  const { userInfo } = useContext(UserInfoContext);
  const navigate = useNavigate()

  const pages: { [key: string]: string } = {
    'Notizie': '/news',
    'Percorsi': '/routes',
    'Corsi': '/courses',
    'Prezzi': '/prices',
  };

  const options: { [key: string]: Function } = {
    'Profilo': () => {
      navigate("/profile")
    },
    'Logout': () => {
      logout()
      setUser(false)
    }
  };

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = (callback: Function) => {
    callback()
    setAnchorElUser(null);
  };

  return (
    <AppBar position="static" style={{ background: '#0080FF' }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            onClick={() => navigate("/")}
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            Climb
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {Object.entries(pages).map(([page, path]) => (
                <MenuItem
                  key={page}
                  onClick={() => {
                    handleCloseNavMenu()
                    navigate(path)
                  }}
                  href={path}
                >
                  <Typography textAlign="center">{page}</Typography>
                </MenuItem>
              ))}
              {
                userInfo &&
                <MenuItem
                  onClick={() => {
                    handleCloseNavMenu()
                    navigate("/completions")
                  }}
                  href={"/completions"}
                >
                  <Typography textAlign="center">Completamenti</Typography>
                </MenuItem>
              }
              {
                userInfo && userInfo.isStaff &&
                <MenuItem
                  onClick={() => {
                    handleCloseNavMenu()
                    navigate("/users")
                  }}
                  href={"/users"}
                >
                  <AdminPanelSettingsIcon />
                  <Typography textAlign="center">Utenti</Typography>
                </MenuItem>
              }
              {
                userInfo && userInfo.isAdmin &&
                <MenuItem
                  onClick={() => {
                    handleCloseNavMenu()
                    navigate("/admin")
                  }}
                  href={"/admin"}
                >
                  <AdminPanelSettingsIcon />
                  <Typography textAlign="center">Staff</Typography>
                </MenuItem>
              }
            </Menu>
          </Box>
          <Typography
            variant="h5"
            noWrap
            component="a"
            href=""
            onClick={() => navigate("/")}
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            Climb
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {Object.entries(pages).map(([page, path]) => (
              <Button
                key={page}
                onClick={handleCloseNavMenu}
                sx={{ my: 2, color: 'white', display: 'block' }}
                href={path}
              >
                {page}
              </Button>
            ))}
            {
              userInfo &&
              <Button
                onClick={handleCloseNavMenu}
                sx={{ my: 2, color: 'white', display: 'block' }}
                href={"/completions"}
              >
                Completamenti
              </Button>
            }
            {
              userInfo && userInfo.isStaff &&
              <Button
                onClick={handleCloseNavMenu}
                sx={{ my: 2, color: 'white', display: 'block' }}
                href={"/users"}
              >
                <AdminPanelSettingsIcon />
                Utenti
              </Button>
            }
            {
              userInfo && userInfo.isAdmin &&
              <Button
                onClick={handleCloseNavMenu}
                sx={{ my: 2, color: 'white', display: 'block' }}
                href={"/admin"}
              >
                <AdminPanelSettingsIcon />
                Staff
              </Button>
            }
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            {
              user
                ?
                <>
                  <Tooltip title="Open settings">
                    <IconButton onClick={handleOpenUserMenu}>
                      <Avatar className="!bg-blue-700 capitalize">
                        {userInfo && userInfo.username[0]}
                      </Avatar>
                    </IconButton>
                  </Tooltip>
                  <Menu
                    sx={{ mt: '45px' }}
                    id="menu-appbar"
                    anchorEl={anchorElUser}
                    anchorOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                    }}
                    open={Boolean(anchorElUser)}
                    onClose={() => handleCloseUserMenu(() => { })}
                  >
                    {Object.entries(options).map(([option, callback]) => (
                      <MenuItem
                        key={option}
                        onClick={() => handleCloseUserMenu(callback)}
                      >
                        <Typography textAlign="center">{option}</Typography>
                      </MenuItem>
                    ))}
                  </Menu>
                </>
                : <Button
                  color="inherit"
                  onClick={() => navigate("/login")}
                >
                  Login
                </Button>
            }
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}