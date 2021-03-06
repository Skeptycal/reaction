import { Box, Flex, Sans, Spacer } from "@artsy/palette"
import { ArtistShows_artist } from "__generated__/ArtistShows_artist.graphql"
import React, { Component } from "react"
import { createRefetchContainer, graphql, RelayRefetchProp } from "react-relay"
import { PaginationFragmentContainer as Pagination } from "Styleguide/Components"
import { Col, Row } from "Styleguide/Elements/Grid"
import { Responsive } from "Utils/Responsive"
import { ArtistShowBlockItem } from "./ArtistShowBlockItem"
import { ArtistShowListItem } from "./ArtistShowListItem"

import {
  LoadingArea,
  LoadingAreaState,
} from "Apps/Artist/Components/LoadingArea"

interface ArtistShowsProps {
  relay: RelayRefetchProp
  artist: ArtistShows_artist
  status: string
  sort: string
  scrollTo: string
  heading: string
  my?: number
}

export const PAGE_SIZE = 4

class ArtistShows extends Component<ArtistShowsProps, LoadingAreaState> {
  static defaultProps = {
    my: 4,
  }

  state = {
    isLoading: false,
  }

  loadNext = () => {
    const {
      artist: {
        showsConnection: {
          pageInfo: { hasNextPage, endCursor },
        },
      },
    } = this.props

    if (hasNextPage) {
      this.loadAfter(endCursor)
    }
  }

  loadAfter = cursor => {
    this.toggleLoading(true)

    this.props.relay.refetch(
      {
        first: PAGE_SIZE,
        after: cursor,
        artistID: this.props.artist.id,
        before: null,
        last: null,
        status: this.props.status,
        sort: this.props.sort,
      },
      null,
      error => {
        this.toggleLoading(false)

        if (error) {
          console.error(error)
        }
      }
    )
  }

  toggleLoading = isLoading => {
    this.setState({
      isLoading,
    })
  }

  render() {
    if (
      !this.props.artist.showsConnection ||
      !this.props.artist.showsConnection.edges.length
    ) {
      return null
    }
    return (
      <Box my={this.props.my}>
        <Responsive>
          {({ xs }) => {
            const blockWidth = xs ? "100%" : "50%"
            const blockDirection = xs ? "column" : "row"
            const pr = xs ? 0 : 2
            const pb = pr

            return (
              <>
                <Row>
                  <Col>
                    <Row>
                      <Col>
                        {/* Negative margin bottom to make space 20px from bottom of
                    text to the image below */}
                        <Sans size="3" weight="medium" mb={-0.5}>
                          {this.props.heading}
                        </Sans>
                        <Spacer mb={2} />
                        <LoadingArea isLoading={this.state.isLoading}>
                          {this.props.status === "running" ? (
                            <Flex flexDirection={blockDirection} flexWrap>
                              {this.props.artist.showsConnection.edges.map(
                                ({ node }, index) => {
                                  return (
                                    <React.Fragment key={index}>
                                      <ArtistShowBlockItem
                                        blockWidth={blockWidth}
                                        imageUrl={node.cover_image.cropped.url}
                                        partner={
                                          node.partner && node.partner.name
                                        }
                                        name={node.name}
                                        exhibitionInfo={node.exhibition_period}
                                        pr={pr}
                                        pb={pb}
                                        href={node.href}
                                        city={node.city}
                                      />
                                      {xs && <Spacer mb={3} />}
                                    </React.Fragment>
                                  )
                                }
                              )}
                            </Flex>
                          ) : (
                            <Box>
                              {this.props.artist.showsConnection.edges.map(
                                ({ node }, index) => {
                                  return (
                                    <React.Fragment key={index}>
                                      <ArtistShowListItem
                                        key={index}
                                        city={node.city}
                                        partner={
                                          node.partner && node.partner.name
                                        }
                                        name={node.name}
                                        exhibitionInfo={node.exhibition_period}
                                        href={node.href}
                                      />

                                      {xs && <Spacer mb={3} />}
                                    </React.Fragment>
                                  )
                                }
                              )}
                            </Box>
                          )}
                        </LoadingArea>
                      </Col>
                    </Row>

                    <Row>
                      <Col>
                        <Box>
                          <Pagination
                            hasNextPage={
                              this.props.artist.showsConnection.pageInfo
                                .hasNextPage
                            }
                            pageCursors={
                              this.props.artist.showsConnection.pageCursors
                            }
                            onClick={this.loadAfter}
                            onNext={this.loadNext}
                            scrollTo={this.props.scrollTo}
                          />
                        </Box>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </>
            )
          }}
        </Responsive>
      </Box>
    )
  }
}

export const ArtistShowsRefetchContainer = createRefetchContainer(
  ArtistShows,
  {
    artist: graphql`
      fragment ArtistShows_artist on Artist
        @argumentDefinitions(
          first: { type: "Int", defaultValue: 4 }
          last: { type: "Int" }
          after: { type: "String" }
          before: { type: "String" }
          sort: { type: "PartnerShowSorts" }
          status: { type: "String" }
        ) {
        id
        showsConnection(
          first: $first
          after: $after
          before: $before
          last: $last
          sort: $sort
          status: $status
        ) {
          pageInfo {
            hasNextPage
            endCursor
          }
          pageCursors {
            ...Pagination_pageCursors
          }
          edges {
            node {
              partner {
                ... on ExternalPartner {
                  name
                }
                ... on Partner {
                  name
                }
              }
              name
              href
              exhibition_period
              cover_image {
                cropped(width: 800, height: 600) {
                  url
                }
              }
              city
            }
          }
        }
      }
    `,
  },
  graphql`
    query ArtistShowsQuery(
      $first: Int
      $last: Int
      $after: String
      $before: String
      $artistID: String!
      $sort: PartnerShowSorts
      $status: String!
    ) {
      artist(id: $artistID) {
        ...ArtistShows_artist
          @arguments(
            sort: $sort
            first: $first
            last: $last
            after: $after
            before: $before
            status: $status
          )
      }
    }
  `
)
