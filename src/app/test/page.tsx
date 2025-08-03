import { Ticket } from 'lucide-react';
import { EventDescription, TicketSection } from '../create/components';
import EventBasicInfo from '../create/components/EventBasicInfo';

const testing = () => {
  return (
    <>
      <div>
        <EventBasicInfo />
        <EventDescription />
        <TicketSection />
      </div>
    </>
  );
};

export default testing;
