import { MapPin, Calendar, Settings2 } from "lucide-react";
import { Button } from "../../components/button";
import { useParams } from 'react-router-dom'
import { useEffect, useState } from "react";
import { api } from "../../lib/axios";
import { format } from "date-fns";
import { UpdateDestinationAndDateModal } from "./update-destination-and-date-modal";

interface Trip {
  id: string | undefined
  destination: string | undefined
  starts_at: Date | string | undefined
  ends_at: Date | string | undefined
  is_confirmed: boolean | undefined
}
interface InfosProps {
  destination: string | undefined
  starts_at: Date | string | undefined
  ends_at: Date | string | undefined
}

export function DestinationAndDateHeader() {
  const { tripId } = useParams()
  const [trip, setTrip] = useState<Trip | undefined>()
  const [isUpdateDestinationAndDateModal, setIsUpdateDestinationAndDateModal] = useState(false)

  useEffect(() => {
    api.get(`/trips/${tripId}`).then(response => setTrip(response.data.trip))
  }, [tripId])

  function openUpdateDestinationAndDateModal(){
    setIsUpdateDestinationAndDateModal(true)
  }

  function closeUpdateDestinationAndDateModal(){
    setIsUpdateDestinationAndDateModal(false)
  }

  function handleUpdateInformations(infos: InfosProps){
    const updateInformations = {
      id: trip?.id,
      destination: infos.destination,
      starts_at: infos.starts_at,
      ends_at: infos.ends_at,
      is_confirmed: trip?.is_confirmed
    }

    setTrip(updateInformations)
  }

  const displayedDate = trip && trip.starts_at && trip.ends_at ? `${format(trip.starts_at, "d 'de' LLL")} até ${format(trip.ends_at, "d 'de' LLL")}`: null
  
  return (
    <div className="px-4 h-16 rounded-xl bg-zinc-900 shadow-shape flex items-center justify-between">
      <div className="flex items-center gap-2">
        <MapPin className="size-5 text-zinc-400" />
        <span className=" text-zinc-100">{trip?.destination}</span>
      </div>

      <div className="flex items-center gap-5">
        <div className="flex items-center gap-2">
          <Calendar className="size-5 text-zinc-400" />
          <span className="text-zinc-100">{displayedDate}</span>
        </div>
        <div className='w-px h-6 bg-zinc-800' />
        <Button variant="secondary" onClick={openUpdateDestinationAndDateModal}>
          Alterar local/data
          <Settings2 className='size-5 text-zinc-200' />
        </Button>
      </div>

      {isUpdateDestinationAndDateModal && (
        <UpdateDestinationAndDateModal
        starts_at={trip?.starts_at}
        ends_at={trip?.ends_at}
        destination={trip?.destination} 
        displayedDate={displayedDate} 
        closeUpdateDestinationAndDateModal={closeUpdateDestinationAndDateModal}
        handleUpdateInformations={handleUpdateInformations}
        />
      )

      }
    </div>
  )
}