import { Location, RedirectException, RouteConfig, Router } from "found"
import { get } from "Utils/get"
import { OrderApp } from "./OrderApp"

const LEAVE_MESSAGING =
  "Are you sure you want to refresh? Your changes will not be saved."

export const confirmRouteExit = (
  newLocation: Location,
  oldLocation: Location,
  router: Router
) => {
  // Refresh -- On refresh newLocation is null
  if (!newLocation || newLocation.pathname === oldLocation.pathname) {
    // Most browsers will ignore this and supply their own messaging for refresh
    return LEAVE_MESSAGING
  }

  // Attempting to navigate to another route in the orders app
  const match = router.matcher.match(newLocation)
  if (match) {
    const matchedRoutes: RouteConfig[] | null = router.matcher.getRoutes(match)
    if (matchedRoutes && matchedRoutes[0].Component === OrderApp) {
      return undefined
    }
  }

  return LEAVE_MESSAGING
}

export const shouldRedirect = props => {
  const { location, order, params } = props as any

  if (!order) {
    // error
    return false
  }

  if (order.state === "ABANDONED") {
    const artworkID = get(order, o => o.lineItems.edges[0].node.artwork.id)
    // If an artwork ID can't be found, redirect back to home page.
    throw new RedirectException(artworkID ? `/artwork/${artworkID}` : "/")
  }

  if (order.state !== "PENDING" && !location.pathname.includes("status")) {
    // Redirect to status page if the order is no longer PENDING (means it can't be edited anymore)
    throw new RedirectException(`/orders/${params.orderID}/status`)
  }

  if (location.pathname.includes("offer")) {
    // TODO: more validation
    return false
  }

  if (!order.requestedFulfillment && !location.pathname.includes("shipping")) {
    // Redirect to shipping page if no shipping info has been set
    throw new RedirectException(`/orders/${params.orderID}/shipping`)
  }

  if (
    !order.creditCard &&
    !(
      location.pathname.includes("payment") ||
      location.pathname.includes("shipping")
    )
  ) {
    // Redirect to payment page if there is shipping but _no_ credit card
    throw new RedirectException(`/orders/${params.orderID}/payment`)
  }

  return false
}
