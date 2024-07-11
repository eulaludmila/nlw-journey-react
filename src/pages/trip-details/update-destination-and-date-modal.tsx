import { Calendar, MapPin, X } from "lucide-react";
import { useState } from "react";
import { DateRange, DayPicker } from "react-day-picker";
import { Button } from "../../components/button";
import { format } from "date-fns";
import { api } from "../../lib/axios";
import { useParams } from "react-router-dom";

interface InfosProps {
  destination: string | undefined
  starts_at: Date | string | undefined
  ends_at: Date | string | undefined
}

interface UpdateDestinationAndDateModalProps {
  destination: string | undefined
  displayedDate: string | null
  closeUpdateDestinationAndDateModal: () => void
  starts_at: Date | string | undefined
  ends_at: Date | string | undefined
  handleUpdateInformations: (infos: InfosProps) => void
}


export function UpdateDestinationAndDateModal({
  starts_at,
  ends_at,
  destination,
  displayedDate,
  closeUpdateDestinationAndDateModal,
  handleUpdateInformations }: UpdateDestinationAndDateModalProps) {
  const { tripId } = useParams()
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false)
  const [eventStartAndDates, setEventStartAndDates] = useState<DateRange | undefined>()
  const [updateDestinationAndDate, setUpdateDestinationAndDate] = useState(destination)

  const uploadDisplayedDate = eventStartAndDates?.from && eventStartAndDates.to ?
    `${format(eventStartAndDates?.from, "d 'de' LLL")} até ${format(eventStartAndDates.to, "d 'de' LLL")}` : displayedDate

  function openDatePicker() {
    setIsDatePickerOpen(true)
  }
  function closeDatePicker() {
    setIsDatePickerOpen(false)
  }

  async function handleUpdateDestinationAndDate() {
    const updateInformations = {
      destination: updateDestinationAndDate,
      starts_at: eventStartAndDates?.from || starts_at,
      ends_at: eventStartAndDates?.to || ends_at
    }

    await api.put(`/trips/${tripId}`, updateInformations).then(() => {
      handleUpdateInformations(updateInformations)
      closeUpdateDestinationAndDateModal()
    })
  }

  return (
    <div className='fixed inset-0 bg-black/60 flex items-center justify-center'>
      <div className='rounded-xl py-5 px-6 shadow-shape bg-zinc-900 space-y-5'>
        <div className='space-y-2'>
          <div className='flex items-center justify-between'>
            <h2 className='text-lg font-semibold'>Atualizar local e data</h2>
            <button type="button" onClick={closeUpdateDestinationAndDateModal}>
              <X className='size-5 text-zinc-400' />
            </button>
          </div>
        </div>
        <div className='flex items-center gap-2 flex-1'>
          <MapPin className='size-5 text-zinc-400' />
          <input
            onChange={e => setUpdateDestinationAndDate(e.target.value)}
            type="text"
            value={updateDestinationAndDate}
            placeholder="Para onde você vai?"
            className="bg-transparent text-lg placeholder-zinc-400 outline-none flex-1" />
        </div>
        <button onClick={openDatePicker} className='flex items-center gap-2 text-left w-[240px]'>
          <Calendar className='size-5 text-zinc-400' />
          <span
            className="text-lg text-zinc-400 w-40 flex-1" >
            {uploadDisplayedDate}
          </span>
        </button>
        <Button size="full" onClick={handleUpdateDestinationAndDate}>
          Atualizar
        </Button>
      </div>

      {isDatePickerOpen && (<div className='fixed inset-0 bg-black/60 flex items-center justify-center'>
        <div className='rounded-xl py-5 px-6 shadow-shape bg-zinc-900 space-y-5'>
          <div className='space-y-2'>
            <div className='flex items-center justify-between'>
              <h2 className='text-lg font-semibold'>Selecione a data</h2>
              <button type="button" onClick={closeDatePicker}>
                <X className='size-5 text-zinc-400' />
              </button>
            </div>
          </div>

          <DayPicker mode="range" selected={eventStartAndDates} onSelect={setEventStartAndDates} />
        </div>
      </div>)}
    </div>
  )
}