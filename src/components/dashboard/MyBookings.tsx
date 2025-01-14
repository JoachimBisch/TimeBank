const renderBookingCard = (booking: Booking) => (
  <div key={`${booking.id}-${booking.status}`} className="bg-white rounded-lg p-4 shadow-sm">
    {/* ... reste du code ... */}
  </div>
);