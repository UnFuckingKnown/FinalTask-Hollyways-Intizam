package handlers

import (
	"context"
	"fmt"
	profiledto "hollyways/dto/profile"
	dto "hollyways/dto/result"
	"hollyways/models"
	"hollyways/repositories"
	"net/http"
	"os"
	"strconv"

	"github.com/cloudinary/cloudinary-go/v2"
	"github.com/cloudinary/cloudinary-go/v2/api/uploader"
	"github.com/golang-jwt/jwt/v4"
	"github.com/labstack/echo/v4"
)

type handleProfile struct {
	ProfileRepository repositories.ProfileRepository
}

func HandlerProfile(ProfileRepository repositories.ProfileRepository) *handleProfile {
	return &handleProfile{ProfileRepository}
}




func (h *handleProfile) FindProfile(c echo.Context) error {
	profiles, err := h.ProfileRepository.FindProfile()
	if err != nil {
		return c.JSON(http.StatusInternalServerError, dto.ErrorResult{Code: http.StatusBadRequest, Message: err.Error()})
	}

	return c.JSON(http.StatusOK, dto.SuccesResult{Code: http.StatusOK, Data: profiles})
}

func (h *handleProfile) GetProfile(c echo.Context) error {
	id, _ := strconv.Atoi(c.Param("id"))
	var profile models.Profile
	profile, err := h.ProfileRepository.GetProfile(id)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, dto.ErrorResult{Code: http.StatusBadRequest, Message: err.Error()})
	}

	return c.JSON(http.StatusOK, dto.SuccesResult{Code: http.StatusOK, Data: convertResponseProfile(profile)})
}

func (h *handleProfile) CreateProfile(c echo.Context) error {

	userId := c.Get("userLogin").(jwt.MapClaims)["id"].(float64)

	filepath := c.Get("dataFile").(string)
	fmt.Println(filepath)

	// image := c.Get("dataFile").(string)
	phone := c.FormValue("phone")

	var ctx = context.Background()
	var CLOUD_NAME = os.Getenv("CLOUD_NAME")
	var API_KEY = os.Getenv("API_KEY")
	var API_SECRET = os.Getenv("API_SECRET")

	fmt.Println(CLOUD_NAME)
	fmt.Println(API_KEY)
	fmt.Println(API_SECRET)

	cld, _ := cloudinary.NewFromParams(CLOUD_NAME, API_KEY, API_SECRET)

	resp, err := cld.Upload.Upload(ctx, filepath, uploader.UploadParams{Folder: "database"})

	profile := models.Profile{

		ID:     int(userId),
		UserID: int(userId),
		Image:  resp.SecureURL,
		Phone:  phone,
	}

	profile, err = h.ProfileRepository.CreateProfile(profile)

	if err != nil {
		return c.JSON(http.StatusInternalServerError, dto.ErrorResult{Code: http.StatusInternalServerError, Message: err.Error()})
	}

	profile, _ = h.ProfileRepository.GetProfile(profile.ID)

	return c.JSON(http.StatusOK, dto.SuccesResult{Code: http.StatusOK, Data: convertResponseProfile(profile)})
}

func (h *handleProfile) UpdateProfile(c echo.Context) error {
	request := new(profiledto.UpdateProfileRequest)

	id, _ := strconv.Atoi(c.Param("id"))

	profile, err := h.ProfileRepository.GetProfile(id)

	if err != nil {
		return c.JSON(http.StatusBadRequest, dto.ErrorResult{Code: http.StatusBadRequest, Message: err.Error()})
	}

	image := c.Get("dataFile").(string)

	request.Image = image

	if request.Image != "" {
		profile.Image = request.Image
	}

	data, err := h.ProfileRepository.UpdateProfile(profile)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, dto.ErrorResult{Code: http.StatusInternalServerError, Message: err.Error()})
	}

	return c.JSON(http.StatusOK, dto.SuccesResult{Code: http.StatusOK, Data: convertResponseProfile(data)})
}

func (h *handleProfile) DeleteProfile(c echo.Context) error {
	id, _ := strconv.Atoi(c.Param("id"))

	profile, err := h.ProfileRepository.GetProfile(id)
	if err != nil {
		return c.JSON(http.StatusBadRequest, dto.ErrorResult{Code: http.StatusBadRequest, Message: err.Error()})
	}

	data, err := h.ProfileRepository.DeleteProfile(profile, id)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, dto.ErrorResult{Code: http.StatusInternalServerError, Message: err.Error()})
	}

	return c.JSON(http.StatusOK, dto.SuccesResult{Code: http.StatusOK, Data: convertResponseProfile(data)})
}

func convertResponseProfile(u models.Profile) profiledto.ProfilResponse {
	return profiledto.ProfilResponse{
		// Name:   u.Name,
		// Email:  u.Email,
		// Phone:  u.Phone,
		// Addres: u.Addres,
		Phone: u.Phone,
		Image: u.Image,
	}
}
