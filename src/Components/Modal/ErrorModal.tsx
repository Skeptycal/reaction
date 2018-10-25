import { color, Flex, Sans } from "@artsy/palette"
import { ModalWidth, ModalWrapper } from "Components/Modal/ModalWrapper"
import React from "react"
import styled from "styled-components"

interface ErrorModalProps extends React.HTMLProps<HTMLDivElement> {
  show?: boolean
  headerText?: string
  detailText?: string
  contactEmail?: string // Used in default detailText if none is specified.
  closeText?: string
  onClose?: () => void
  ctaAction?: () => void
}

export class ErrorModal extends React.Component<ErrorModalProps> {
  static defaultProps = {
    headerText: "An error occurred",
    closeText: "Continue",
  }

  close = () => {
    this.props.onClose && this.props.onClose()
  }

  render() {
    const {
      show,
      onClose,
      headerText,
      detailText,
      contactEmail,
      closeText,
      ctaAction,
    } = this.props
    const emailAddress = contactEmail ? contactEmail : "support@artsy.net"

    return (
      <ModalWrapper show={show} onClose={onClose} width={ModalWidth.Narrow}>
        <Flex flexDirection="column" pt={2} px={2}>
          <Sans size="4" weight="medium" mb={10}>
            {headerText}
          </Sans>
          <Sans size="3" color="black60">
            {detailText || (
              <>
                Something went wrong. Please try again or contact{" "}
                <Link href={`mailto:${emailAddress}`}>{emailAddress}</Link>.
              </>
            )}
          </Sans>
        </Flex>

        <Flex
          mt={1}
          justifyContent="flex-end"
          onClick={ctaAction ? ctaAction : this.close}
        >
          <ModalButton>{closeText}</ModalButton>
        </Flex>
      </ModalWrapper>
    )
  }
}

// TODO: Generalize this button and move it to @artsy/palette
export const ModalButton = props => (
  <Sans
    p={2}
    size="3"
    color="purple100"
    weight="medium"
    style={{ cursor: "pointer" }}
    {...props}
  />
)

// TODO: Generalize this link and move it to @artsy/palette
const Link = styled.a`
  color: ${color("black60")};
`
