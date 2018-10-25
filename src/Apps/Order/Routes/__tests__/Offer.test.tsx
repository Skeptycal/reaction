import { Input } from "Components/Input"
import { renderRelayTree } from "DevTools"
import React from "react"
import { graphql } from "react-relay"
import { UntouchedOrder } from "../../../__test__/Fixtures/Order"
import { TransactionSummary } from "../../Components/TransactionSummary"
import { OfferFragmentContainer as OfferRoute } from "../Offer"

jest.unmock("react-relay")

describe("Payment", () => {
  let wrapper
  beforeEach(async () => {
    console.error = jest.fn() // Silences component logging.

    wrapper = await renderRelayTree({
      Component: ({ order }: any) => (
        <OfferRoute order={order} {...defaultProps} />
      ),
      query: graphql`
        query OfferTestQuery {
          order: ecommerceOrder(id: "unused") {
            ...Offer_order
          }
        }
      `,
      mockResolvers: {
        Order: () => UntouchedOrder,
      },
    })
  })

  const defaultProps = {
    router: {
      push: jest.fn(),
    } as any,
    route: {
      onTransition: jest.fn(),
    } as any,
    relay: {
      environment: {},
    } as any,
    mediator: {
      trigger: jest.fn(),
    } as any,
  }

  it("renders", () => {
    const input = wrapper.find(Input)
    expect(input.text()).toContain("Your offer")
  })

  it("can receive input, which updates the transaction summary", () => {
    const input = wrapper.find(Input)
    const transactionSummary = wrapper.find(TransactionSummary)

    expect(transactionSummary.text()).toContain("Your offer—")

    input.props().onChange({ currentTarget: { value: "1" } } as any)
    expect(transactionSummary.text()).toContain("Your offer$1")

    input.props().onChange({ currentTarget: { value: "1.23" } } as any)
    expect(transactionSummary.text()).toContain("Your offer$1")

    input.props().onChange({ currentTarget: { value: "1023.23" } } as any)
    expect(transactionSummary.text()).toContain("Your offer$1,023")
  })
})
