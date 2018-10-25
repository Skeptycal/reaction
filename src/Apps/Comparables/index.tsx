import { Box, Button, Spinner } from "@artsy/palette"
import { ComparablesQuery } from "__generated__/ComparablesQuery.graphql"
import { FilterState } from "Apps/Collect/FilterState"
import { ContextConsumer, ContextProps } from "Artsy"
import RelayGridItem from "Components/Artwork/GridItem"
import Input from "Components/Input"
import React, { Component } from "react"
import { graphql, QueryRenderer } from "react-relay"
import styled from "styled-components"
import { Provider as StateProvider } from "unstated"
import { Comparables } from "./ComparablesView"
import { CategoryToMediumGeneMap } from "./Filter/MediumFilter"

export interface Props extends ContextProps {
  artworkID?: string
}

interface State {
  artworkID: string
  searched: boolean
}

export class ComparablesContainer extends Component<Props, State> {
  state = {
    searched: false,
    artworkID: null,
  }
  // TODO: Currencies?
  priceAsRange(price, multiplier = 100) {
    const dollars = price / multiplier
    const min = Math.floor(Math.max(0, 0.9 * dollars))
    const max = Math.floor(1.1 * dollars)
    return `${min}-${max}`
  }
  artworkInput() {
    return (
      <>
        <Input
          onChange={event => {
            this.setState({
              searched: false,
              artworkID: event.currentTarget.value,
            })
          }}
        />
        <Button
          onClick={() => {
            this.setState({ searched: true })
          }}
        >
          Generate
        </Button>
      </>
    )
  }

  resultsForArtwork(artworkID: string) {
    return (
      <ContextConsumer>
        {({ relayEnvironment }) => {
          return (
            <QueryRenderer<ComparablesQuery>
              environment={relayEnvironment}
              query={graphql`
                query ComparablesQuery($artworkID: String!) {
                  artwork(id: $artworkID) {
                    artist {
                      id
                    }
                    category
                    attribution_class {
                      id
                      name
                    }
                    priceCents {
                      min
                    }
                    ...GridItem_artwork
                  }
                }
              `}
              variables={{ artworkID }}
              render={({ props }) => {
                if (props) {
                  const {
                    category,
                    artist,
                    attribution_class,
                    priceCents,
                  } = props.artwork
                  const medium = CategoryToMediumGeneMap[category]
                  const price = priceCents && priceCents.min
                  const priceRange = price ? this.priceAsRange(price) : "*-*"
                  const attributionClass = attribution_class && [
                    attribution_class.id,
                  ]
                  return (
                    <StateProvider
                      inject={[
                        new FilterState({
                          attribution_class: attributionClass,
                          price_range: priceRange,
                          medium,
                          artist_id: artist.id,
                        }),
                      ]}
                    >
                      <Box pt={3} pb={3}>
                        Viewing {artworkID} comparables
                        <div style={{ margin: "auto", width: "200px" }}>
                          <RelayGridItem artwork={props.artwork} />
                        </div>
                        <Comparables
                          attributionClass={attributionClass}
                          artistID={artist.id}
                          medium={medium}
                          priceRange={priceRange}
                        />
                      </Box>
                    </StateProvider>
                  )
                } else {
                  return (
                    <SpinnerContainer>
                      <Spinner />
                    </SpinnerContainer>
                  )
                }
              }}
            />
          )
        }}
      </ContextConsumer>
    )
  }

  render() {
    const { artworkID, searched } = this.state

    return (
      <>
        {this.artworkInput()}
        {searched && this.resultsForArtwork(artworkID)}
      </>
    )
  }
}

const SpinnerContainer = styled.div`
  width: 100%;
  height: 100px;
  position: relative;
`
