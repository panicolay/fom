import { useEffect } from 'react'
import { StructureList } from '../components/structures/StructureList'
import { signUpUser } from '../services/userService'

export function HomePage() {
  const handleSignup = async () => {
    try {
      const user = await signUpUser({
        email: 'test@gmail.com',
        password: 'password123',
        username: 'clarice123',
        bio: 'Dev en reconversion ✨',
      })
      console.log('User created :', user)
    } catch (error) {
      console.error('Error')
    }
  }

  useEffect(() => {
    handleSignup()
  }, [])

  return (
    <>
      <h1 className="font-display text-7xl font-semibold text-base-200">
        THE
        <br />
        FORM OF
        <br />
        MUSIC
      </h1>

      <StructureList />
    </>
  )
}
