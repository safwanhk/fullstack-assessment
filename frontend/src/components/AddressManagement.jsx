import { useState } from 'react'
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Skeleton,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import LocationOffOutlinedIcon from '@mui/icons-material/LocationOffOutlined'
import { addAddress, deleteAddress, updateAddress } from '../services/api.js'
import AppSnackbar from './AppSnackbar.jsx'
import EmptyState from './EmptyState.jsx'

const initialForm = {
  street: '',
  city: '',
  country: '',
}

function AddressManagement({ userId, addresses, onAddressesChanged, loadingAddresses = false }) {
  const [isDialogOpen, setDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [addressToDelete, setAddressToDelete] = useState(null)
  const [formData, setFormData] = useState(initialForm)
  const [editingAddress, setEditingAddress] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [formErrors, setFormErrors] = useState(initialForm)
  const [touched, setTouched] = useState({
    street: false,
    city: false,
    country: false,
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const getFieldError = (name, value) => {
    if (!value.trim()) {
      return `${name.charAt(0).toUpperCase()}${name.slice(1)} is required`
    }
    return ''
  }

  const validateForm = () => {
    const nextErrors = {
      street: getFieldError('street', formData.street),
      city: getFieldError('city', formData.city),
      country: getFieldError('country', formData.country),
    }
    setFormErrors(nextErrors)
    return !nextErrors.street && !nextErrors.city && !nextErrors.country
  }

  const openAddDialog = () => {
    setEditingAddress(null)
    setFormData(initialForm)
    setFormErrors(initialForm)
    setTouched({ street: false, city: false, country: false })
    setDialogOpen(true)
  }

  const openEditDialog = (address) => {
    setEditingAddress(address)
    setFormData({
      street: address.street,
      city: address.city,
      country: address.country,
    })
    setFormErrors(initialForm)
    setTouched({ street: false, city: false, country: false })
    setDialogOpen(true)
  }

  const closeDialog = () => {
    setDialogOpen(false)
    setEditingAddress(null)
    setFormData(initialForm)
    setFormErrors(initialForm)
    setTouched({ street: false, city: false, country: false })
  }

  const handleSaveAddress = async () => {
    setTouched({ street: true, city: true, country: true })
    if (!validateForm()) {
      return
    }

    setSubmitting(true)
    try {
      if (editingAddress) {
        await updateAddress(userId, editingAddress.id, formData)
        setSuccess('Address updated successfully')
      } else {
        await addAddress(userId, formData)
        setSuccess('Address created successfully')
      }
      closeDialog()
      await onAddressesChanged()
    } catch (err) {
      setError(err?.response?.data || (editingAddress ? 'Failed address update' : 'Failed address creation'))
    } finally {
      setSubmitting(false)
    }
  }

  const openDeleteDialog = (address) => {
    setAddressToDelete(address)
    setDeleteDialogOpen(true)
  }

  const closeDeleteDialog = () => {
    setAddressToDelete(null)
    setDeleteDialogOpen(false)
  }

  const confirmDelete = async () => {
    if (!addressToDelete) {
      return
    }

    setDeleting(true)
    try {
      await deleteAddress(userId, addressToDelete.id)
      await onAddressesChanged()
      setSuccess('Address deleted successfully')
      closeDeleteDialog()
    } catch (err) {
      setError(err?.response?.data || 'Failed to delete address')
    } finally {
      setDeleting(false)
    }
  }

  const columns = [
    { field: 'street', headerName: 'Street', flex: 1.2, minWidth: 210 },
    { field: 'city', headerName: 'City', flex: 1, minWidth: 150 },
    { field: 'country', headerName: 'Country', flex: 1, minWidth: 140 },
    {
      field: 'actions',
      headerName: 'Actions',
      minWidth: 170,
      sortable: false,
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
          <Button size="small" variant="outlined" onClick={() => openEditDialog(params.row)}>
            Edit
          </Button>
          <Button size="small" color="error" variant="outlined" onClick={() => openDeleteDialog(params.row)}>
            Delete
          </Button>
        </Stack>
      ),
    },
  ]

  const isFormValid =
    formData.street.trim() && formData.city.trim() && formData.country.trim() && !formErrors.street && !formErrors.city && !formErrors.country

  return (
    <>
      <Stack spacing={2}>
        <Stack direction="row" justifyContent="flex-end">
          <Button variant="contained" onClick={openAddDialog}>
            Add Address
          </Button>
        </Stack>

        <Box sx={{ height: 380 }}>
          <DataGrid
            rows={addresses}
            columns={columns}
            loading={loadingAddresses}
            disableRowSelectionOnClick
            pageSizeOptions={[5, 10]}
            initialState={{ pagination: { paginationModel: { pageSize: 5, page: 0 } } }}
            slots={{
              loadingOverlay: () => (
                <Stack sx={{ p: 2 }} spacing={1}>
                  <Skeleton variant="rounded" height={34} />
                  <Skeleton variant="rounded" height={34} />
                  <Skeleton variant="rounded" height={34} />
                </Stack>
              ),
              noRowsOverlay: () => (
                <EmptyState
                  icon={<LocationOffOutlinedIcon color="disabled" fontSize="large" />}
                  title="No addresses found for this user"
                  description="Add a new address to get started."
                />
              ),
            }}
          />
        </Box>
      </Stack>

      <Dialog open={isDialogOpen} onClose={closeDialog} fullWidth maxWidth="sm">
        <DialogTitle>{editingAddress ? 'Edit Address' : 'Add Address'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Street"
              value={formData.street}
              onChange={(event) => {
                const value = event.target.value
                setFormData((prev) => ({ ...prev, street: value }))
                if (touched.street) {
                  setFormErrors((prev) => ({ ...prev, street: getFieldError('street', value) }))
                }
              }}
              onBlur={() => {
                setTouched((prev) => ({ ...prev, street: true }))
                setFormErrors((prev) => ({ ...prev, street: getFieldError('street', formData.street) }))
              }}
              error={touched.street && Boolean(formErrors.street)}
              helperText={touched.street ? formErrors.street : ''}
              fullWidth
            />
            <TextField
              label="City"
              value={formData.city}
              onChange={(event) => {
                const value = event.target.value
                setFormData((prev) => ({ ...prev, city: value }))
                if (touched.city) {
                  setFormErrors((prev) => ({ ...prev, city: getFieldError('city', value) }))
                }
              }}
              onBlur={() => {
                setTouched((prev) => ({ ...prev, city: true }))
                setFormErrors((prev) => ({ ...prev, city: getFieldError('city', formData.city) }))
              }}
              error={touched.city && Boolean(formErrors.city)}
              helperText={touched.city ? formErrors.city : ''}
              fullWidth
            />
            <TextField
              label="Country"
              value={formData.country}
              onChange={(event) => {
                const value = event.target.value
                setFormData((prev) => ({ ...prev, country: value }))
                if (touched.country) {
                  setFormErrors((prev) => ({ ...prev, country: getFieldError('country', value) }))
                }
              }}
              onBlur={() => {
                setTouched((prev) => ({ ...prev, country: true }))
                setFormErrors((prev) => ({ ...prev, country: getFieldError('country', formData.country) }))
              }}
              error={touched.country && Boolean(formErrors.country)}
              helperText={touched.country ? formErrors.country : ''}
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={closeDialog} disabled={submitting}>
            Cancel
          </Button>
          <Button onClick={handleSaveAddress} variant="contained" disabled={submitting || !isFormValid}>
            {editingAddress ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onClose={closeDeleteDialog} fullWidth maxWidth="xs">
        <DialogTitle>Delete Address</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to permanently delete this address?</Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={closeDeleteDialog} disabled={deleting}>
            Cancel
          </Button>
          <Button onClick={confirmDelete} color="error" variant="contained" disabled={deleting}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <AppSnackbar
        open={Boolean(error)}
        message={error}
        severity="error"
        autoHideDuration={4000}
        onClose={() => setError('')}
      />
      <AppSnackbar open={Boolean(success)} message={success} severity="success" onClose={() => setSuccess('')} />
    </>
  )
}

export default AddressManagement
