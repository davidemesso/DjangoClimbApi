import TerrainIcon from '@mui/icons-material/Terrain';
import { Box } from '@mui/material';

interface DifficultyRateProps {
  readonly rating: number
}

export default function DifficultyRate({ rating }: DifficultyRateProps) {
  return (
    <Box className="align-middle">
      {
        Array.from({ length: rating }, (_, i) => 
          <TerrainIcon key={i} className='text-red-500'/>)
      }
    </Box>
  )
}