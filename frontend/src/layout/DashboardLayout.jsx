import { useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Container,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Stack,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined'
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined'
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined'

const drawerWidth = 250

function DashboardLayout() {
  const theme = useTheme()
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'))
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)

  const isUsersListPage = location.pathname === '/users'

  const handleUsersNavigation = () => {
    navigate('/users')
  }

  const navItems = [
    {
      key: 'users',
      label: 'Users',
      icon: <PeopleAltOutlinedIcon fontSize="small" />,
      path: '/users',
    },
  ]

  const drawerContent = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', p: 1.5 }}>
      <Stack direction="row" spacing={1.25} alignItems="center" sx={{ px: 1, py: 1 }}>
        <Avatar sx={{ width: 34, height: 34, bgcolor: 'primary.main' }}>
          <DashboardOutlinedIcon fontSize="small" />
        </Avatar>
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            SaaS Console
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Full Stack Assessment
          </Typography>
        </Box>
      </Stack>

      <List sx={{ mt: 1 }}>
        {navItems.map((item) => {
          const selected = location.pathname.startsWith(item.path)
          return (
            <ListItemButton
              key={item.key}
              selected={selected}
              onClick={() => {
                if (location.pathname !== item.path) {
                  navigate(item.path)
                }
                setMobileOpen(false)
              }}
              sx={{
                borderRadius: 2,
                mb: 0.5,
                '&.Mui-selected': {
                  bgcolor: 'primary.main',
                  color: '#fff',
                  '& .MuiListItemIcon-root': { color: '#fff' },
                  '&:hover': { bgcolor: 'primary.dark' },
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 34 }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          )
        })}
      </List>

      <Box sx={{ flexGrow: 1 }} />
      <Paper variant="outlined" sx={{ p: 1.5, borderRadius: 3, bgcolor: '#f8fafc' }}>
        <Stack direction="row" spacing={1.25} alignItems="center">
          <Avatar sx={{ width: 32, height: 32 }}>
            <AccountCircleOutlinedIcon fontSize="small" />
          </Avatar>
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              Admin User
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Online
            </Typography>
          </Box>
        </Stack>
      </Paper>
    </Box>
  )

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: 'background.default' }}>
      <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}>
        <Drawer
          variant={isDesktop ? 'permanent' : 'temporary'}
          open={isDesktop || mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
              borderRight: '1px solid #e2e8f0',
              backgroundColor: '#ffffff',
            },
          }}
        >
          {drawerContent}
        </Drawer>
      </Box>

      <Box sx={{ flexGrow: 1, minWidth: 0 }}>
        <AppBar
          position="sticky"
          elevation={0}
          color="inherit"
          sx={{ borderBottom: '1px solid #e2e8f0', backgroundColor: 'rgba(255,255,255,0.92)' }}
        >
          <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
            <Stack direction="row" spacing={1.25} alignItems="center">
              {!isDesktop && (
                <IconButton onClick={() => setMobileOpen(true)} edge="start">
                  <MenuIcon />
                </IconButton>
              )}
              <Typography variant="h6" sx={{ fontWeight: 800 }}>
                User Operations
              </Typography>
            </Stack>

            {!isUsersListPage && (
              <Button
                variant="outlined"
                startIcon={<PeopleAltOutlinedIcon fontSize="small" />}
                onClick={handleUsersNavigation}
                sx={{
                  cursor: 'pointer',
                  '&:hover': {
                    backgroundColor: 'primary.main',
                    color: '#fff',
                    borderColor: 'primary.main',
                  },
                }}
              >
                Users
              </Button>
            )}
          </Toolbar>
        </AppBar>

        <Container maxWidth="xl" sx={{ py: { xs: 2, md: 4 }, px: { xs: 2, md: 3 } }}>
          <Outlet />
        </Container>
      </Box>
    </Box>
  )
}

export default DashboardLayout
