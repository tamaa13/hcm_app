function timeToMinutes(t: string) {
   const [h, m] = t.split(':').map(Number);
   return h * 60 + m;
}

function minutesToTime(mins: number) {
   const h = String(Math.floor(mins / 60)).padStart(2, '0');
   const m = String(mins % 60).padStart(2, '0');
   return `${h}:${m}`;
}

// Check if two intervals overlap
function isOverlapping(startA: any, endA: any, startB: any, endB: any) {
   return startA < endB && startB < endA;
}

export function getTimeSlots(schedule: any, appointments: any, slotSize = 30) {
   const startMin = timeToMinutes(schedule.startTime);
   const endMin = timeToMinutes(schedule.endTime);

   const allSlots = [];
   for (let t = startMin; t + slotSize <= endMin; t += slotSize) {
      allSlots.push({
         start: t,
         end: t + slotSize,
      });
   }

   const mappedAppointments = appointments.map((appt: any) => ({
      start: timeToMinutes(appt.startTime),
      end: timeToMinutes(appt.endTime),
   }));

   const available = [];
   const unavailable = [];

   for (const slot of allSlots) {
      const overlaps = mappedAppointments.some((appt: any) =>
         isOverlapping(slot.start, slot.end, appt.start, appt.end),
      );

      const formattedSlot = {
         start: minutesToTime(slot.start),
         end: minutesToTime(slot.end),
      };

      if (overlaps) {
         unavailable.push(formattedSlot);
      } else {
         available.push(formattedSlot);
      }
   }

   return { available, unavailable };
}
