package routes

import (
	"hollyways/handlers"
	middleware "hollyways/package/middleware"
	"hollyways/package/mysql"
	"hollyways/repositories"

	"github.com/labstack/echo/v4"
)

func ProfileRoutes(e *echo.Group) {
	profileRepository := repositories.RepositoryProfile(mysql.DB)
	h := handlers.HandlerProfile(profileRepository)

	e.GET("/profiles", h.FindProfile)
	e.GET("/profile/:id", h.GetProfile)
	e.POST("/profile", middleware.Auth(middleware.UploadFile(h.CreateProfile)))
	e.PATCH("/profile/:id", middleware.Auth(middleware.UploadFile(h.UpdateProfile)))
	e.DELETE("/profile/:id", h.DeleteProfile)
}
