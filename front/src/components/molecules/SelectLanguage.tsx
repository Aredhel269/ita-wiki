import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { colors, device, dimensions, font } from '../../styles'

type Language = 'es' | 'cat' | 'en'

const DropdownLang = styled.select<{ selectedLanguage: Language }>`
  font-size: ${font.base};
  border: none;
  border-radius: ${dimensions.borderRadius.base};
  font-weight: ${font.regular};
  color: ${colors.black.black1};
  background-color: ${colors.white};
  height: 40px;
  width: ${({ selectedLanguage }) =>
    selectedLanguage === 'cat' ? '62px' : '46px'};
  transition: transform 0.3s ease;

  &:hover {
    cursor: pointer;
    transform: scale(1.03);
  }

  &:focus {
    outline: 0 none;
  }

  @media ${device.Mobile} {
    background-color: ${colors.white};
    margin: 0;
    padding: 0.47rem;
    color: ${colors.gray.gray3};
    width: ${({ selectedLanguage }) =>
      selectedLanguage === 'cat' ? '69px' : '55px'};
  }
`

export const SelectLanguage: React.FC = () => {
  const [selectedLanguage, setSelectedLanguage] = useState<Language | string>(
    localStorage.getItem('lng') ?? 'cat'
  )

  const {
    i18n: { changeLanguage },
  } = useTranslation()

  const handleLanguageChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setSelectedLanguage(event.target.value as Language)
    localStorage.setItem('lng', event.target.value)
    changeLanguage(event.target.value)
  }

  return (
    <DropdownLang
      selectedLanguage={selectedLanguage as Language}
      value={selectedLanguage}
      onChange={handleLanguageChange}
    >
      <option value="cat">CAT</option>
      <option value="es">ES</option>
      <option value="en">EN</option>
    </DropdownLang>
  )
}
