import { Alert, Snackbar } from '@mui/material'

function AppSnackbar({ open, onClose, message, severity = 'success', autoHideDuration = 3000 }) {
  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    >
      <Alert severity={severity} variant="filled" onClose={onClose} sx={{ width: '100%' }}>
        {message}
      </Alert>
    </Snackbar>
  )
}

export default AppSnackbar
