import React, { useState } from 'react';
import { Calendar } from '../calendar/Calendar';
import { TimeSlotForm } from './TimeSlotForm';
import { TimeSlotList } from './TimeSlotList';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export const AvailabilityCalendar: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [timeSlots, setTimeSlots] = useState<Array<{ date: Date; slots: string[] }>>([]);

  const handleAddTimeSlot = (slot: { startTime: string; endTime: string }) => {
    if (!selectedDate) return;

    setTimeSlots(prev => {
      const existingSlotIndex = prev.findIndex(s => 
        format(s.date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')
      );

      if (existingSlotIndex >= 0) {
        const newSlots = [...prev];
        newSlots[existingSlotIndex] = {
          date: selectedDate,
          slots: [...newSlots[existingSlotIndex].slots, `${slot.startTime}-${slot.endTime}`]
        };
        return newSlots;
      }

      return [...prev, {
        date: selectedDate,
        slots: [`${slot.startTime}-${slot.endTime}`]
      }];
    });
  };

  const handleRemoveTimeSlot = (date: Date, slotToRemove: string) => {
    setTimeSlots(prev => prev.map(slot => {
      if (format(slot.date, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')) {
        return {
          ...slot,
          slots: slot.slots.filter(s => s !== slotToRemove)
        };
      }
      return slot;
    }).filter(slot => slot.slots.length > 0));
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <Calendar
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
            availableTimeSlots={timeSlots}
          />
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg p-6 shadow">
            <h3 className="text-lg font-medium mb-4">
              {selectedDate 
                ? `Créneaux pour le ${format(selectedDate, 'dd MMMM yyyy', { locale: fr })}`
                : 'Sélectionnez une date'}
            </h3>

            {selectedDate && (
              <>
                <TimeSlotForm onAdd={handleAddTimeSlot} />
                <div className="mt-4">
                  <TimeSlotList
                    date={selectedDate}
                    slots={timeSlots.find(s => 
                      format(s.date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')
                    )?.slots || []}
                    onRemove={(slot) => handleRemoveTimeSlot(selectedDate, slot)}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};