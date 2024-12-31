// Next Imports
import { redirect } from 'next/navigation'

export default function Page() {
  return (
    <>
      {redirect('/privacy-preservation')}
    </>
  )
}
