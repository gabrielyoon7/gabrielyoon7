
import * as React from 'react';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import TimelineDot from '@mui/lab/TimelineDot';
import Typography from '@mui/material/Typography';
import { Box } from '@mui/material';


export default (
  {
    period_start,
    period_end,
    title,
    description,
    sub_description,
    color,
    variant,
    icon
  }) => {

  return (
    <TimelineItem>
      <TimelineOppositeContent
        sx={{ m: 'auto 0' }}
        variant="body2"
        color="text.secondary"
      >
        {period_start} ~ {period_end}
      </TimelineOppositeContent>
      <TimelineSeparator>
        <TimelineConnector sx={{ bgcolor: 'secondary.main' }} />
        <TimelineDot color={color} variant={variant}>
          {icon}
        </TimelineDot>
        <TimelineConnector sx={{ bgcolor: 'secondary.main' }} />
      </TimelineSeparator>
      <TimelineContent sx={{ py: '12px', px: 2 }}>
        <Box>
          <Typography variant="h6" component="span">
            {title}
          </Typography>
          <Typography>{description}</Typography>
          <Typography variant='caption'>{sub_description}</Typography>
        </Box>
      </TimelineContent>
    </TimelineItem>
  )
}
