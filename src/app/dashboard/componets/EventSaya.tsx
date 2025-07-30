import { Button } from '@/components/ui/button';

const dummyEvents = [
  {
    id: 1,
    title: 'Workshop React',
    date: '12 Agustus 2025',
    location: 'Jakarta',
    image: '/images/sample-event.jpg'
  },
  {
    id: 2,
    title: 'Seminar Web3',
    date: '25 September 2025',
    location: 'Bandung',
    image: '/images/sample-event.jpg'
  },
  {
    id: 3,
    title: 'Tech Conference',
    date: '3 Oktober 2025',
    location: 'Surabaya',
    image: '/images/sample-event.jpg'
  }
];

const EventSaya = () => {
  return (
    <div className="w-full px-4 lg:px-12">
      {/* Tabs */}
      <div className="flex justify-center md:justify-between max-w-4xl mx-auto border-b-2 border-neutral-400">
        <p className="text-xl font-normal tracking-widest border-b-4 border-pink-600 p-2">
          Event Aktif
        </p>
        <p className="text-xl font-normal tracking-widest p-2">Event Draft</p>
        <p className="text-xl font-normal tracking-widest p-2">Event Lalu</p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
        {dummyEvents.map((event) => (
          <div
            key={event.id}
            className="bg-white border rounded-xl shadow-md overflow-hidden hover:shadow-lg transition"
          >
            <img
              src={event.image}
              alt={event.title}
              className="w-full h-40 object-cover"
            />
            <div className="p-4 space-y-1">
              <h3 className="text-lg font-semibold text-gray-800">
                {event.title}
              </h3>
              <p className="text-sm text-gray-500">{event.date}</p>
              <p className="text-sm text-gray-500">{event.location}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Buat Event */}
      <div className="flex justify-center my-20">
        <Button className="bg-pink-600 hover:bg-pink-700">
          + Buat Event Baru
        </Button>
      </div>
    </div>
  );
};

export default EventSaya;
