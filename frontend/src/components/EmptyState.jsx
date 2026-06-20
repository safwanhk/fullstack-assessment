import { Stack, Typography } from '@mui/material'

function EmptyState({ icon, title, description }) {
  return (
    <Stack sx={{ height: '100%' }} alignItems="center" justifyContent="center" spacing={1.25}>
      {icon}
      <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
        {title}
      </Typography>
      {description ? (
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      ) : null}
    </Stack>
  )
}

export default EmptyState
