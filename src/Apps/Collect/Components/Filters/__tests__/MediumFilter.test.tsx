import { Radio } from "@artsy/palette"
import { mount } from "enzyme"
import React from "react"
import { ContextProvider } from "../../../../../Artsy/SystemContext"
import { FilterState, initialState } from "../../../FilterState"
import { MediumFilter } from "../MediumFilter"

describe("MediumFilter", () => {
  const tracking = { trackEvent: jest.fn() }
  const filterState = new FilterState({ ...initialState, tracking })
  const mediums = [
    { id: "photography", name: "photography" },
    { id: "print", name: "print" },
    { id: "painting", name: "painting" },
    { id: "design", name: "design" },
  ]
  const mediator = { trigger: jest.fn() }

  const mediumFilter = (mediumProps = []) => {
    return mount(
      <ContextProvider mediator={mediator}>
        <MediumFilter filters={filterState} mediums={mediumProps} />
      </ContextProvider>
    )
  }

  it("displays the correct number of Radio components", () => {
    const component = mediumFilter(mediums)
    expect(component.find(Radio).length).toBe(4)
  })

  it("Uses hardcoded mediums if none are returned", () => {
    const component = mediumFilter()
    expect(component.find(Radio).length).toBe(11)
  })

  it("updates the state with the correct medium", done => {
    const component = mediumFilter(mediums)
    component
      .find(Radio)
      .at(0)
      .simulate("click")

    component.update()

    setTimeout(() => {
      expect(filterState.state.medium).toBe("photography")
      done()
    })
  })
})
