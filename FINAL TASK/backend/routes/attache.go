package routes

import (
	"hollyways/handlers"
	"hollyways/package/middleware"
	"hollyways/package/mysql"
	"hollyways/repositories"

	"github.com/labstack/echo/v4"
)

func AttachetRoutes(e *echo.Group) {
	attacheRepository := repositories.RepositoryAttache(mysql.DB)
	h := handlers.HandlerAttache(attacheRepository)

	e.GET("/attache", h.FindAttache)
	e.GET("/attache/:id", h.GetAttache)
	e.POST("/attache", middleware.Auth(middleware.UploadFile(h.CreateAttache)))
	e.PATCH("/attacheUpdate/:id", middleware.Auth(middleware.UploadFile(h.UpdateAttache)))
	e.DELETE("/attacheDelete/:id", h.DeleteAttache)
}
