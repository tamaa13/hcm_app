import { getAvailableAppointmentStartTimes } from '@/services/nurses.service';

export default async function Page() {
   const response = await getAvailableAppointmentStartTimes(
      String(1),
      new Date(),
   );

   console.log({ response });

   return <h1>TESTING PAGE</h1>;
}
