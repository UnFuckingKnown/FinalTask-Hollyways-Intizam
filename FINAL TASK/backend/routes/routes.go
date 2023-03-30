package routes

import "github.com/labstack/echo/v4"

func RouteInit(e *echo.Group) {
	UserRoutes(e)
	AuthRoutes(e)
	AttachetRoutes(e)
	ProfileRoutes(e)
	DonatedRoutes(e)
}
