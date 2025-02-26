import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { useAuth } from '../../context/AuthProvider'
import { colors, device, dimensions } from '../../styles'
import userAvatar from '../../assets/icons/profile-avatar.svg'
import defaultAvatar from '../../assets/icons/user.svg'
import Login from '../organisms/Login'
import Register from '../organisms/Register'
import { Modal } from './Modal'
import { paths } from '../../constants'

const AvatarImage = styled.img`
  padding: 1px;
  height: 40px;
  width: 40px;
  border-radius: ${dimensions.borderRadius.sm};
  background-color: ${colors.white};
  cursor: pointer;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.03);
  }

  @media only ${device.Tablet} {
    border-radius: ${dimensions.borderRadius.base};
    width: 48px;
  }
`

export const UserButton: React.FC = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [isRegisterOpen, setIsRegisterOpen] = useState(false)
  const [isLoginOpen, setIsLoginOpen] = useState(false)

  const avatarRef = useRef<HTMLImageElement>(null)

  const handleLoginModal = () => {
    setIsLoginOpen(!isLoginOpen)
  }
  const handleRegisterModal = () => {
    setIsRegisterOpen(!isRegisterOpen)
  }

  const handleProfileAccess = () => {
    navigate(paths.profile)
  }

  return (
    <>
      {!user && (
        <AvatarImage
          data-testid="avatarImage"
          src={defaultAvatar}
          alt="Avatar"
          onClick={handleLoginModal}
          ref={avatarRef}
        />
      )}
      {user && (
        <AvatarImage
          data-testid="avatarImageUser"
          src={user.avatarId ? user.avatarId : userAvatar}
          alt="Avatar"
          ref={avatarRef}
          onClick={handleProfileAccess}
        />
      )}
      <Modal
        isOpen={isLoginOpen || isRegisterOpen}
        toggleModal={() =>
          isLoginOpen ? setIsLoginOpen(false) : setIsRegisterOpen(false)
        }
      >
        {isLoginOpen && (
          <Login
            handleLoginModal={handleLoginModal}
            handleRegisterModal={handleRegisterModal}
          />
        )}
        {isRegisterOpen && (
          <Register
            handleLoginModal={handleLoginModal}
            handleRegisterModal={handleRegisterModal}
          />
        )}
      </Modal>
    </>
  )
}

export default styled(UserButton)``
