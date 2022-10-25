import * as React from 'react';
import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineOppositeContent from '@mui/lab/TimelineOppositeContent';
import TimelineDot from '@mui/lab/TimelineDot';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import LaptopMacIcon from '@mui/icons-material/LaptopMac';
import HotelIcon from '@mui/icons-material/Hotel';
import RepeatIcon from '@mui/icons-material/Repeat';
import Typography from '@mui/material/Typography';
import TimelineCard from 'components/profile/TimelineCard';
import life from 'assets/data/life';

export default function () {

  return (
    <Timeline position="alternate">

      {
        life.map(
          (l) =>
            <TimelineCard
              period_start={l.period_start}
              period_end={l.period_end}
              title={l.title}
              description={l.description}
              sub_description={l.sub_description}
              color={l.color}
              variant={l.variant}
              icon={l.icon}
            />
        )
      }

    </Timeline>
  );
}
