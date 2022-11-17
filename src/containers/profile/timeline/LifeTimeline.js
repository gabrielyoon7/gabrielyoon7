import * as React from 'react';
import Timeline from '@mui/lab/Timeline';
import TimelineCard from 'components/profile/TimelineCard';
import life from 'assets/data/life';

export default function LifeTimelne() {

  return (
    <Timeline position="alternate">

      {
        life.map(
          (l) =>
            <TimelineCard
              key={l.title}
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
