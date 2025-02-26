import { SelectHTMLAttributes, forwardRef } from 'react'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import { colors, dimensions, font } from '../../styles'

const SelectStyled = styled.select<TSelect>`
  border-radius: ${dimensions.borderRadius.base};
  border: 1px solid ${colors.gray.gray4};
  color: ${colors.gray.gray3};
  font-family: ${font.fontFamily};
  padding: ${dimensions.spacing.base};
  width: 100%;

  ${({ error }) => error && `border: 1px solid ${colors.error};`}

  &:focus {
    outline: 0 none;
  }
`
type TOption = {
  value: string
  label: string
  id?: string
}

type TSelect = SelectHTMLAttributes<HTMLSelectElement> & {
  options?: TOption[]
  error?: boolean | string
  placeholder?: string
}
const Select = forwardRef<HTMLSelectElement, TSelect>((props, ref) => {
  const { t } = useTranslation()

  const {
    options = [],
    error = false,
    placeholder = t('Opciones'),
    defaultValue = '',
    ...rest
  } = props
  
  return (
    <SelectStyled error={error} ref={ref} defaultValue={defaultValue} {...rest}>
      <option value="" disabled>
        {placeholder}
      </option>
      {options.map(({ value, label, id }) => (
        <option key={value} value={id}>
          {label}
        </option>
      ))}
    </SelectStyled>
  )
})

export { Select, type TSelect }
