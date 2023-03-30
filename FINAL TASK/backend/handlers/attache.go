package handlers

import (
	"context"
	"fmt"
	attachedto "hollyways/dto/attache"
	dto "hollyways/dto/result"
	"hollyways/models"
	"hollyways/repositories"
	"net/http"
	"os"
	"strconv"
	"time"

	"github.com/cloudinary/cloudinary-go/v2"
	"github.com/cloudinary/cloudinary-go/v2/api/uploader"
	"github.com/labstack/echo/v4"
)

type handlerAttache struct {
	AttacheRepository repositories.AttacheRepository
}

func HandlerAttache(AttacheRepository repositories.AttacheRepository) *handlerAttache {
	return &handlerAttache{
		AttacheRepository: AttacheRepository,
	}
}

func (h *handlerAttache) FindAttache(c echo.Context) error {
	attaches, err := h.AttacheRepository.FindAttache()
	if err != nil {
		return c.JSON(http.StatusInternalServerError, dto.ErrorResult{Code: http.StatusBadRequest, Message: err.Error()})
	}

	return c.JSON(http.StatusOK, dto.SuccesResult{Code: http.StatusOK, Data: attaches})
}

func (h *handlerAttache) GetAttache(c echo.Context) error {
	id, _ := strconv.Atoi(c.Param("id"))

	var attache models.Attache
	attache, err := h.AttacheRepository.GetAttache(id)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, dto.ErrorResult{Code: http.StatusBadRequest, Message: err.Error()})
	}

	return c.JSON(http.StatusOK, dto.SuccesResult{Code: http.StatusOK, Data: convertResponseAttache(attache)})
}

func (h *handlerAttache) CreateAttache(c echo.Context) error {

	filepath := c.Get("dataFile").(string)
	fmt.Println(filepath)

	title := c.FormValue("title")
	// image := c.Get("dataFile").(string)
	endDate := c.FormValue("endDate")
	donation := c.FormValue("donation")
	desc := c.FormValue("desc")
	layout := "2006-01-02"

	endDateTime, err := time.Parse(layout, endDate)
	donationInt, _ := strconv.Atoi(donation)

	var ctx = context.Background()
	var CLOUD_NAME = os.Getenv("CLOUD_NAME")
	var API_KEY = os.Getenv("API_KEY")
	var API_SECRET = os.Getenv("API_SECRET")

	fmt.Println(CLOUD_NAME)
	fmt.Println(API_KEY)
	fmt.Println(API_SECRET)

	cld, _ := cloudinary.NewFromParams(CLOUD_NAME, API_KEY, API_SECRET)

	resp, err := cld.Upload.Upload(ctx, filepath, uploader.UploadParams{Folder: "database"})

	if err != nil {
		return c.JSON(http.StatusInternalServerError, dto.ErrorResult{Code: http.StatusInternalServerError, Message: err.Error()})
	}

	attache := models.Attache{
		Title:    title,
		Image:    resp.SecureURL,
		EndDate:  endDateTime,
		Donation: donationInt,
		Desc:     desc,
	}

	attache, err = h.AttacheRepository.CreateAttache(attache)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, dto.ErrorResult{Code: http.StatusInternalServerError, Message: err.Error()})
	}

	attache, _ = h.AttacheRepository.GetAttache(attache.ID)

	if err != nil {
		fmt.Println(err.Error())
	}

	return c.JSON(http.StatusOK, dto.SuccesResult{Code: http.StatusOK, Data: convertResponseAttache(attache)})
}
func (h *handlerAttache) UpdateAttache(c echo.Context) error {

	id, _ := strconv.Atoi(c.Param("id"))

	attache, err := h.AttacheRepository.GetAttache(id)

	if err != nil {
		return c.JSON(http.StatusBadRequest, dto.ErrorResult{Code: http.StatusBadRequest, Message: err.Error()})
	}

	title := c.FormValue("title")
	image := c.Get("dataFile").(string)
	Donation := c.FormValue("donation")
	desc := c.FormValue("desc")
	donationInt, _ := strconv.Atoi(Donation)

	updateAttache := models.Attache{
		ID:       attache.ID,
		Title:    title,
		Image:    image,
		Donation: donationInt,
		Desc:     desc,
	}

	data, err := h.AttacheRepository.UpdateAttache(updateAttache)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, dto.ErrorResult{Code: http.StatusInternalServerError, Message: err.Error()})
	}

	return c.JSON(http.StatusOK, dto.SuccesResult{Code: http.StatusOK, Data: data})
}

func (h *handlerAttache) DeleteAttache(c echo.Context) error {
	id, _ := strconv.Atoi(c.Param("id"))

	attache, err := h.AttacheRepository.GetAttache(id)
	if err != nil {
		return c.JSON(http.StatusBadRequest, dto.ErrorResult{Code: http.StatusBadRequest, Message: err.Error()})
	}

	data, err := h.AttacheRepository.DeleteAttache(attache, id)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, dto.ErrorResult{Code: http.StatusInternalServerError, Message: err.Error()})
	}

	return c.JSON(http.StatusOK, dto.SuccesResult{Code: http.StatusOK, Data: convertResponseAttache(data)})
}

func convertResponseAttache(u models.Attache) attachedto.AttacheResponse {
	return attachedto.AttacheResponse{
		Title:    u.Title,
		Image:    u.Image,
		EndDate:  u.EndDate,
		Desc:     u.Desc,
		Donation: u.Donation,
	}
}
