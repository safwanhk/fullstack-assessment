import { Box, CircularProgress, Typography } from '@mui/material'

function LoadingState({ label = 'Loading...' }) {
  return (
    <Box
      sx={{
        minHeight: 220,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
      }}
    >
      <CircularProgress />
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
    </Box>
  )
}

export default LoadingState
