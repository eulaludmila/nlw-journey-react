import { FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { InviteGuestsModal } from './invite-guests-modal'
import { ConfirmTripModal } from './confirm-trip-modal'
import { DestinationAndDateStep } from './steps/destination-and-date-step'
import { InviteGuestsStep } from './steps/invite-guests-step'

export function CreateTripPage() {
  const navigate = useNavigate()
  const [isGuestInputOpen, setIsGuestInputOpen] = useState(false)
  const [isGuestModalOpen, setIsGuestModalOpen] = useState(false)
  const [isConfirmTripModalOpen, setIsConfirmTripModalOpen] = useState(false)
  const [emailsToInvite, setEmailsToInvite] = useState(['eula@gmail.com'])

  function openGuestsInput() {
    setIsGuestInputOpen(true)
  }
  function closeGuestsInput() {
    setIsGuestInputOpen(false)
  }
  function openGuestsModal() {
    setIsGuestModalOpen(true)
  }
  function closeGuestsModal() {
    setIsGuestModalOpen(false)
  }
  function openConfirmTripModal() {
    console.log('entrou')
    setIsConfirmTripModalOpen(true)
  }
  function closeConfirmTripModal() {
    setIsConfirmTripModalOpen(false)
  }
  function addNewEmailToInvite(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const data = new FormData(e.currentTarget)
    const email = data.get('email')?.toString()

    if (!email) {
      return
    }

    if (emailsToInvite.includes(email)) {
      return
    }
    setEmailsToInvite([...emailsToInvite, email])
    e.currentTarget.reset()
  }

  function removeEmailFromInvites(emailToRemove: string) {
    const newEmailList = emailsToInvite.filter(invited => invited !== emailToRemove)
    setEmailsToInvite(newEmailList)
  }

  function createTrip(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

    navigate('/trips/123')
  }

  return (
    <div className="h-screen flex items-center justify-center bg-pattern bg-no-repeat bg-center">
      <div className="max-w-3xl w-full px-6 text-center space-y-10">
        <div className='flex flex-col items-center gap-3'>
          <img src="/logo.svg" alt="plann.er" />
          <p className="text-zinc-300 text-lg">Convide seus amigos e planeje sua próxima viagem!</p>
        </div>

        <div className='space-y-4'>
         <DestinationAndDateStep 
         closeGuestsInput={closeGuestsInput} 
         isGuestInputOpen={isGuestInputOpen} 
         openGuestsInput={openGuestsInput}/>

          {
            isGuestInputOpen && (
              <InviteGuestsStep
              emailsToInvite={emailsToInvite}
              openConfirmTripModal={openConfirmTripModal}
              openGuestsModal={openGuestsModal}
              />
            )
          }
        </div>
        <p className="text-small text-zinc-500">Ao planejar sua viagem pela plann.er você automaticamente concorda <br />
          com nossos <a href="#" className="text-zincc-300 underline">termos de uso</a> e <a href="#" className="text-zincc-300 underline">políticas de privacidade</a>.</p>
      </div>

      {
        isGuestModalOpen && (
          <InviteGuestsModal
            addNewEmailToInvite={addNewEmailToInvite}
            emailsToInvite={emailsToInvite}
            closeGuestsModal={closeGuestsModal}
            removeEmailFromInvites={removeEmailFromInvites}
          />
        )
      }

      {isConfirmTripModalOpen && (
        <ConfirmTripModal closeConfirmTripModal={closeConfirmTripModal} createTrip={createTrip}/>
      )}
    </div >
  )
}