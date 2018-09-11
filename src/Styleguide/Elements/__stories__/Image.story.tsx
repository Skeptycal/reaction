import { BorderBox, Image, ResponsiveImage } from "@artsy/palette"
import React from "react"
import { storiesOf } from "storybook/storiesOf"
import { Section } from "Styleguide/Utils/Section"

storiesOf("Styleguide/Elements", module).add("Image", () => {
  return (
    <React.Fragment>
      <Section title="Default Image">
        <Image src="https://picsum.photos/110/110/?random" />
      </Section>
      <Section title="Custom size">
        <Image
          width="300px"
          height="200px"
          src="https://picsum.photos/300/300/?random"
        />
      </Section>
      <Section title="Responsive Image">
        <BorderBox maxWidth="400px" width="100%" height="auto" p={0}>
          <ResponsiveImage src="https://picsum.photos/400/250/?random" />
        </BorderBox>
      </Section>
    </React.Fragment>
  )
})
