import { useCallback, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Skeleton,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace'
import AddressManagement from '../components/AddressManagement.jsx'
import AppSnackbar from '../components/AppSnackbar.jsx'
import { getUserById, updateUser } from '../services/api.js'

function UserDetailSkeleton() {
  return (
    <Stack spacing={2.5}>
      <Skeleton variant="rounded" height={52} />
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 5 }}>
          <Card>
            <CardContent>
              <Skeleton variant="text" width="50%" height={28} />
              <Skeleton variant="text" width="70%" sx={{ mb: 1.5 }} />
              <Skeleton variant="rounded" height={40} sx={{ mb: 1 }} />
              <Skeleton variant="rounded" height={40} sx={{ mb: 1 }} />
              <Skeleton variant="rounded" height={40} sx={{ mb: 1 }} />
              <Skeleton variant="rounded" height={36} width={130} />
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 7 }}>
          <Card>
            <CardContent>
              <Skeleton variant="text" width="40%" height={28} />
              <Skeleton variant="rounded" height={320} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Stack>
  )
}

function UserDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
  })
  const [loading, setLoading] = useState(true)
  const [loadingAddresses, setLoadingAddresses] = useState(false)
  const [saving, setSaving] = useState(false)
  const [formErrors, setFormErrors] = useState({
    firstName: '',
    lastName: '',
    email: '',
  })
  const [touched, setTouched] = useState({
    firstName: false,
    lastName: false,
    email: false,
  })
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })

  const getFieldError = (name, value) => {
    const trimmedValue = value.trim()
    if (!trimmedValue) {
      if (name === 'firstName') return 'First Name is required'
      if (name === 'lastName') return 'Last Name is required'
      return 'Email is required'
    }
    if (name === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedValue)) {
      return 'Enter a valid email address'
    }
    return ''
  }

  const validateForm = () => {
    const nextErrors = {
      firstName: getFieldError('firstName', formData.firstName),
      lastName: getFieldError('lastName', formData.lastName),
      email: getFieldError('email', formData.email),
    }
    setFormErrors(nextErrors)
    return !nextErrors.firstName && !nextErrors.lastName && !nextErrors.email
  }

  const loadUser = useCallback(async (options = { showPageLoading: true, updateForm: true }) => {
    const { showPageLoading, updateForm } = options
    if (showPageLoading) {
      setLoading(true)
    }
    try {
      const response = await getUserById(id)
      setUser(response)
      if (updateForm) {
        setFormData({
          firstName: response.firstName,
          lastName: response.lastName,
          email: response.email,
        })
        setFormErrors({ firstName: '', lastName: '', email: '' })
        setTouched({ firstName: false, lastName: false, email: false })
      }
    } catch (err) {
      setSnackbar({
        open: true,
        message: err?.response?.data || 'Failed to load user details',
        severity: 'error',
      })
    } finally {
      if (showPageLoading) {
        setLoading(false)
      }
    }
  }, [id])

  const refreshAddresses = async () => {
    setLoadingAddresses(true)
    await loadUser({ showPageLoading: false, updateForm: false })
    setLoadingAddresses(false)
  }

  useEffect(() => {
    loadUser()
  }, [loadUser])

  const handleSaveUser = async () => {
    if (!user) {
      return
    }
    setTouched({ firstName: true, lastName: true, email: true })
    if (!validateForm()) {
      return
    }

    setSaving(true)
    try {
      const updatedUser = await updateUser(id, {
        id: Number(id),
        ...formData,
      })
      setUser(updatedUser)
      setSnackbar({ open: true, message: 'User updated successfully', severity: 'success' })
    } catch (err) {
      setSnackbar({
        open: true,
        message: err?.response?.data || 'Failed to update user',
        severity: 'error',
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <UserDetailSkeleton />
  }

  if (!user) {
    return (
      <Stack spacing={2}>
        <Button variant="text" startIcon={<KeyboardBackspaceIcon />} onClick={() => navigate('/users')}>
          Back to users
        </Button>
        <Alert severity="error">Unable to load user details.</Alert>
      </Stack>
    )
  }

  const isFormValid =
    formData.firstName.trim() &&
    formData.lastName.trim() &&
    formData.email.trim() &&
    !formErrors.firstName &&
    !formErrors.lastName &&
    !formErrors.email

  return (
    <Stack spacing={2.5}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={1}>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Avatar sx={{ width: 42, height: 42, bgcolor: 'primary.light', color: 'primary.dark' }}>
            {user.firstName?.charAt(0)}
            {user.lastName?.charAt(0)}
          </Avatar>
          <Box>
            <Typography variant="h5">
              {user.firstName} {user.lastName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              User ID: {id}
            </Typography>
          </Box>
        </Stack>
        <Button variant="outlined" startIcon={<KeyboardBackspaceIcon />} onClick={() => navigate('/users')}>
          Back to users
        </Button>
      </Stack>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 5 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6">User Information</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75, mb: 2.5 }}>
                Update profile fields and save your changes.
              </Typography>

              <Stack spacing={2}>
                <TextField
                  label="First Name"
                  value={formData.firstName}
                  onChange={(event) => {
                    const value = event.target.value
                    setFormData((prev) => ({ ...prev, firstName: value }))
                    if (touched.firstName) {
                      setFormErrors((prev) => ({ ...prev, firstName: getFieldError('firstName', value) }))
                    }
                  }}
                  onBlur={() => {
                    setTouched((prev) => ({ ...prev, firstName: true }))
                    setFormErrors((prev) => ({ ...prev, firstName: getFieldError('firstName', formData.firstName) }))
                  }}
                  error={touched.firstName && Boolean(formErrors.firstName)}
                  helperText={touched.firstName ? formErrors.firstName : ''}
                  fullWidth
                />
                <TextField
                  label="Last Name"
                  value={formData.lastName}
                  onChange={(event) => {
                    const value = event.target.value
                    setFormData((prev) => ({ ...prev, lastName: value }))
                    if (touched.lastName) {
                      setFormErrors((prev) => ({ ...prev, lastName: getFieldError('lastName', value) }))
                    }
                  }}
                  onBlur={() => {
                    setTouched((prev) => ({ ...prev, lastName: true }))
                    setFormErrors((prev) => ({ ...prev, lastName: getFieldError('lastName', formData.lastName) }))
                  }}
                  error={touched.lastName && Boolean(formErrors.lastName)}
                  helperText={touched.lastName ? formErrors.lastName : ''}
                  fullWidth
                />
                <TextField
                  label="Email"
                  value={formData.email}
                  onChange={(event) => {
                    const value = event.target.value
                    setFormData((prev) => ({ ...prev, email: value }))
                    if (touched.email) {
                      setFormErrors((prev) => ({ ...prev, email: getFieldError('email', value) }))
                    }
                  }}
                  onBlur={() => {
                    setTouched((prev) => ({ ...prev, email: true }))
                    setFormErrors((prev) => ({ ...prev, email: getFieldError('email', formData.email) }))
                  }}
                  error={touched.email && Boolean(formErrors.email)}
                  helperText={touched.email ? formErrors.email : ''}
                  fullWidth
                />
                <Button variant="contained" onClick={handleSaveUser} disabled={saving || !isFormValid}>
                  Save User
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 7 }}>
          <Card>
            <CardContent>
              <Typography variant="h6">Address Management</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75, mb: 2.5 }}>
                Add, edit, and delete addresses for this user.
              </Typography>

              <AddressManagement
                userId={id}
                addresses={user.addresses ?? []}
                loadingAddresses={loadingAddresses}
                onAddressesChanged={refreshAddresses}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <AppSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        autoHideDuration={snackbar.severity === 'success' ? 3000 : 4000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
      />
    </Stack>
  )
}

export default UserDetailPage
