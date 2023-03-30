package routes

import (
	"hollyways/handlers"
	middleware "hollyways/package/middleware"
	"hollyways/package/mysql"
	"hollyways/repositories"

	"github.com/labstack/echo/v4"
)

func DonatedRoutes(e *echo.Group) {
	donatedRepository := repositories.RepositoryDonated(mysql.DB)
	h := handlers.HandlerDonated(donatedRepository)

	e.GET("/donateds", h.FindDonated)
	e.GET("/donated/:id", h.GetDonated)
	e.POST("/donated", middleware.Auth(h.CreateDonated))
	// e.PATCH("/donated/:id", middleware.Auth(h.UpdateDonated))
	e.DELETE("/donated/:id", h.DeleteDonated)
	e.POST("/notification", h.Notification)
}
