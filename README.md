# TimeBank

À faire :

- availibility
  - validation de réserver une fois qu'on a reservé une expérience
    for now missing or insufficient permission from dev tools in the web consol
    20/01 : les disponibilités maintenant s'ajoutent à la base de données, mais il est nécessaire de recharger la page pour les faire apparaître en dessous du calendrier où l'on détermine ses disponibilitées
    - erreur pour charger les disponibilités de quelqu'un quand un autre utilisateur essaie de réserver l'expérience de ce quelqu'un
- envoyer notification par mail lorsqu'on réserve
- checker que database ok pour 30 personnes

Logique quant à l

## à faire pour plus tard :

dans src/components/bookings/TimeSlotPicker.tsx => les timeslot devrait avoir un id, ce serait mieux, mais alors il faut aller modifier le type "TimeSlot"

## Cradotest modifications

- in src/components/layout/Header.tsx : line 43 the calendar is commented
- in src/components/experiences/ExperienceListItem.tsx : line 33 : the editing icon is commented
- in src/components/experiences/ExperienceListItem.tsx : line 42 : the trash icon is commented
- in src/components/experiences/ExperienceAvailabilityCalendar.tsx : line 68-74 : error message commented
- in src/components/experiences/ExperienceAvailabilityCalendar.tsx : line 41 : error message commented
