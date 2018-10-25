import { Radio } from "@artsy/palette"
import { mount } from "enzyme"
import React from "react"
import { Provider } from "unstated"
import { ContextProvider } from "../../../../Artsy/SystemContext"
import { FilterState, initialState } from "../../../Collect/FilterState"
import { MediumFilter } from "../MediumFilter"

describe("Filter", () => {
  describe("MediumFilter", () => {
    const tracking = { trackEvent: jest.fn() }
    const filterState = new FilterState({ ...initialState, tracking })
    const mediator = { trigger: jest.fn() }

    const mediumFilter = mount(
      <ContextProvider mediator={mediator}>
        <Provider inject={[filterState]}>
          <MediumFilter />
        </Provider>
      </ContextProvider>
    )

    it("displays the correct number of Radio components", () => {
      expect(mediumFilter.find(Radio).length).toBe(12)
    })

    it("updates the state with the correct medium", done => {
      mediumFilter
        .find(Radio)
        .at(0)
        .simulate("click")

      mediumFilter.update()

      setTimeout(() => {
        expect(filterState.state.medium).toBe("prints")
        done()
      })
    })
  })
})
