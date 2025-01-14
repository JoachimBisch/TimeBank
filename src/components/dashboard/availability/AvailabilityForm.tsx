import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { WeeklySchedule, TimeRange } from '../../../types/availability';

const timeRangeSchema = z.object({
  start: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Format invalide (HH:mm)'),
  end: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Format invalide (HH:mm)')
});

const dayScheduleSchema = z.object({
  available: z.boolean(),
  slots: z.array(timeRangeSchema)
});

const weeklyScheduleSchema = z.object({
  monday: dayScheduleSchema,
  tuesday: dayScheduleSchema,
  wednesday: dayScheduleSchema,
  thursday: dayScheduleSchema,
  friday: dayScheduleSchema,
  saturday: dayScheduleSchema,
  sunday: dayScheduleSchema
});

type FormData = {
  weeklySchedule: WeeklySchedule;
};

interface AvailabilityFormProps {
  onSubmit: (data: FormData) => void;
  initialData?: FormData;
}

export const AvailabilityForm: React.FC<AvailabilityFormProps> = ({ onSubmit, initialData }) => {
  const { control, handleSubmit, watch } = useForm<FormData>({
    resolver: zodResolver(weeklyScheduleSchema),
    defaultValues: initialData || {
      weeklySchedule: {
        monday: { available: false, slots: [] },
        tuesday: { available: false, slots: [] },
        wednesday: { available: false, slots: [] },
        thursday: { available: false, slots: [] },
        friday: { available: false, slots: [] },
        saturday: { available: false, slots: [] },
        sunday: { available: false, slots: [] }
      }
    }
  });

  const days = [
    { key: 'monday', label: 'Lundi' },
    { key: 'tuesday', label: 'Mardi' },
    { key: 'wednesday', label: 'Mercredi' },
    { key: 'thursday', label: 'Jeudi' },
    { key: 'friday', label: 'Vendredi' },
    { key: 'saturday', label: 'Samedi' },
    { key: 'sunday', label: 'Dimanche' }
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {days.map(({ key, label }) => (
        <div key={key} className="border rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <span className="font-medium">{label}</span>
            <Controller
              name={`weeklySchedule.${key}.available`}
              control={control}
              render={({ field }) => (
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    {...field}
                    checked={field.value}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              )}
            />
          </div>

          {watch(`weeklySchedule.${key}.available`) && (
            <Controller
              name={`weeklySchedule.${key}.slots`}
              control={control}
              render={({ field }) => (
                <div className="space-y-2">
                  {field.value.map((slot, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        type="time"
                        value={slot.start}
                        onChange={(e) => {
                          const newSlots = [...field.value];
                          newSlots[index] = { ...slot, start: e.target.value };
                          field.onChange(newSlots);
                        }}
                        className="border rounded p-2"
                      />
                      <span>à</span>
                      <input
                        type="time"
                        value={slot.end}
                        onChange={(e) => {
                          const newSlots = [...field.value];
                          newSlots[index] = { ...slot, end: e.target.value };
                          field.onChange(newSlots);
                        }}
                        className="border rounded p-2"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const newSlots = field.value.filter((_, i) => i !== index);
                          field.onChange(newSlots);
                        }}
                        className="text-red-600 hover:text-red-800"
                      >
                        Supprimer
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      field.onChange([...field.value, { start: '09:00', end: '17:00' }]);
                    }}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    + Ajouter un créneau
                  </button>
                </div>
              )}
            />
          )}
        </div>
      ))}

      <div className="flex justify-end">
        <button
          type="submit"
          className="px-4 py-2 bg-black text-white rounded-full hover:bg-gray-900"
        >
          Enregistrer mes disponibilités
        </button>
      </div>
    </form>
  );
};