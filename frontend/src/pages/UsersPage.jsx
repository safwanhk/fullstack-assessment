import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  InputAdornment,
  Skeleton,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import HomeWorkOutlinedIcon from '@mui/icons-material/HomeWorkOutlined'
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined'
import PersonSearchOutlinedIcon from '@mui/icons-material/PersonSearchOutlined'
import { DataGrid } from '@mui/x-data-grid'
import AppSnackbar from '../components/AppSnackbar.jsx'
import EmptyState from '../components/EmptyState.jsx'
import { getUsers } from '../services/api.js'

function UsersPageSkeleton() {
  return (
    <Stack spacing={2.5}>
      <Grid container spacing={2}>
        {[1, 2, 3].map((item) => (
          <Grid key={item} size={{ xs: 12, md: 4 }}>
            <Card>
              <CardContent>
                <Skeleton variant="text" width="45%" height={28} />
                <Skeleton variant="text" width="65%" />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Card>
        <CardContent>
          <Skeleton variant="rounded" height={36} sx={{ mb: 2 }} />
          <Skeleton variant="rounded" height={420} />
        </CardContent>
      </Card>
    </Stack>
  )
}

function UsersPage() {
  const navigate = useNavigate()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true)
      try {
        const response = await getUsers()
        setUsers(response)
      } catch (err) {
        setError(err?.response?.data || 'Failed to load users')
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) {
      return users
    }

    return users.filter((user) => {
      return (
        user.firstName.toLowerCase().includes(query) ||
        user.lastName.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query)
      )
    })
  }, [search, users])

  const columns = [
    {
      field: 'firstName',
      headerName: 'First Name',
      flex: 1,
      minWidth: 200,
      renderCell: (params) => (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            height: '100%',
            gap: 1.5,
          }}
        >
          <Avatar
            sx={{
              width: 32,
              height: 32,
              flexShrink: 0,
              bgcolor: 'primary.light',
              color: 'primary.dark',
              fontSize: 14,
            }}
          >
            {params.row.firstName?.charAt(0)}
            {params.row.lastName?.charAt(0)}
          </Avatar>
          <Typography variant="body2" sx={{ fontWeight: 600, lineHeight: 1.5 }}>
            {params.row.firstName}
          </Typography>
        </Box>
      ),
    },
    { field: 'lastName', headerName: 'Last Name', flex: 1, minWidth: 160 },
    { field: 'email', headerName: 'Email', flex: 1.4, minWidth: 240 },
    {
      field: 'actions',
      headerName: 'Actions',
      sortable: false,
      minWidth: 140,
      align: 'right',
      headerAlign: 'right',
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', height: '100%', width: '100%' }}>
          <Button size="small" variant="outlined" onClick={() => navigate(`/users/${params.row.id}`)}>
            Manage
          </Button>
        </Box>
      ),
    },
  ]

  if (loading) {
    return <UsersPageSkeleton />
  }

  const totalAddresses = users.reduce((count, user) => count + (user.addresses?.length ?? 0), 0)
  return (
    <Stack spacing={2.5}>
      <Box>
        <Typography variant="h4">Users Dashboard</Typography>
        <Typography color="text.secondary" sx={{ mt: 0.5 }}>
          Monitor users, update profiles, and manage addresses from a single workspace.
        </Typography>
      </Box>

      <Card
        sx={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          color: '#f8fafc',
        }}
      >
        <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
          <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" spacing={3}>
            <Box>
              <Typography variant="h6" sx={{ color: '#cbd5e1' }}>
                Dashboard Summary
              </Typography>
              <Typography variant="body2" sx={{ color: '#94a3b8', mt: 0.5 }}>
                Current snapshot of your platform data.
              </Typography>
            </Box>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ width: { xs: '100%', md: 'auto' } }}>
              <Card
                sx={{
                  flex: 1,
                  minWidth: { xs: '100%', sm: 180 },
                  bgcolor: 'rgba(148, 163, 184, 0.12)',
                  borderColor: 'rgba(148, 163, 184, 0.25)',
                }}
              >
                <CardContent sx={{ px: 2, py: 1.5, '&:last-child': { pb: 1.5 } }}>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography variant="overline" sx={{ color: '#94a3b8', display: 'block', lineHeight: 1.5 }}>
                        Users
                      </Typography>
                      <Typography variant="h4" sx={{ color: '#f8fafc', mt: 0.5, lineHeight: 1.2 }}>
                        {users.length}
                      </Typography>
                    </Box>
                    <Avatar sx={{ bgcolor: '#1d4ed8', width: 40, height: 40, flexShrink: 0 }}>
                      <GroupOutlinedIcon fontSize="small" />
                    </Avatar>
                  </Stack>
                </CardContent>
              </Card>

              <Card
                sx={{
                  flex: 1,
                  minWidth: { xs: '100%', sm: 180 },
                  bgcolor: 'rgba(148, 163, 184, 0.12)',
                  borderColor: 'rgba(148, 163, 184, 0.25)',
                }}
              >
                <CardContent sx={{ px: 2, py: 1.5, '&:last-child': { pb: 1.5 } }}>
                  <Stack direction="row" alignItems="center" spacing={2}>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography variant="overline" sx={{ color: '#94a3b8', display: 'block', lineHeight: 1.5 }}>
                        Addresses
                      </Typography>
                      <Typography variant="h4" sx={{ color: '#f8fafc', mt: 0.5, lineHeight: 1.2 }}>
                        {totalAddresses}
                      </Typography>
                    </Box>
                    <Avatar sx={{ bgcolor: '#15803d', width: 40, height: 40, flexShrink: 0 }}>
                      <HomeWorkOutlinedIcon fontSize="small" />
                    </Avatar>
                  </Stack>
                </CardContent>
              </Card>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Stack spacing={2}>
            <TextField
              fullWidth
              label="Search users"
              placeholder="Search by first name, last name, or email"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />

            <Box sx={{ height: 540 }}>
              <DataGrid
                rows={filteredUsers}
                columns={columns}
                rowHeight={52}
                pageSizeOptions={[5, 10, 25]}
                sx={{
                  '& .MuiDataGrid-cell': {
                    display: 'flex',
                    alignItems: 'center',
                  },
                }}
                initialState={{
                  pagination: {
                    paginationModel: { pageSize: 10, page: 0 },
                  },
                }}
                disableRowSelectionOnClick
                slots={{
                  noRowsOverlay: () => <EmptyState icon={<PersonSearchOutlinedIcon color="disabled" fontSize="large" />} title="No users found" description="Try a different search term." />,
                }}
              />
            </Box>
          </Stack>
        </CardContent>
      </Card>

      {users.length === 0 && (
        <Card>
          <CardContent>
            <Stack alignItems="center" spacing={1.25} sx={{ py: 3 }}>
              <PersonSearchOutlinedIcon color="disabled" fontSize="large" />
              <Typography variant="h6">No users found</Typography>
              <Typography color="text.secondary">No users are available right now.</Typography>
            </Stack>
          </CardContent>
        </Card>
      )}

      <AppSnackbar
        open={Boolean(error)}
        message={error}
        severity="error"
        autoHideDuration={4000}
        onClose={() => setError('')}
      />
    </Stack>
  )
}

export default UsersPage
