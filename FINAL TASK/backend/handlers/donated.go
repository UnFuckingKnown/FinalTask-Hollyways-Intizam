package handlers

import (
	"fmt"
	donateddto "hollyways/dto/donated"
	dto "hollyways/dto/result"
	"hollyways/models"
	"hollyways/repositories"
	
	"net/http"
	"os"
	"strconv"
	"time"

	"github.com/golang-jwt/jwt/v4"
	"github.com/labstack/echo/v4"
	"github.com/midtrans/midtrans-go"
	"github.com/midtrans/midtrans-go/snap"
)

type handleDonated struct {
	DonatedRepository repositories.DonatedRepository
}

func HandlerDonated(DonatedRepository repositories.DonatedRepository) *handleDonated {
	return &handleDonated{
		DonatedRepository: DonatedRepository,
	}
}

func (h *handleDonated) Notification(c echo.Context) error {

	var notificationPayload map[string]interface{}

	if err := c.Bind(&notificationPayload); err != nil {
		return c.JSON(http.StatusBadRequest, dto.ErrorResult{Code: http.StatusBadRequest, Message: err.Error()})
	}

	transactionStatus := notificationPayload["transaction_status"].(string)
	fraudStatus := notificationPayload["fraud_status"].(string)
	orderId := notificationPayload["order_id"].(string)

	// order_id, _ := strconv.Atoi(orderId)

	// donate,_ := h.DonatedRepository.GetDonated(order_id)

	fmt.Print("ini payloadnya", notificationPayload)

	if transactionStatus == "capture" {
		if fraudStatus == "challenge" {
			// TODO set transaction status on your database to 'challenge'
			// e.g: 'Payment status challenged. Please take action on your Merchant Administration Portal
			h.DonatedRepository.UpdateDonated("pending", orderId)
		} else if fraudStatus == "accept" {
			// TODO set transaction status on your database to 'success'
			h.DonatedRepository.UpdateDonated("success", orderId)
		}
	} else if transactionStatus == "settlement" {
		// TODO set transaction status on your databaase to 'success'
		h.DonatedRepository.UpdateDonated("success", orderId)
	} else if transactionStatus == "deny" {
		// TODO you can ignore 'deny', because most of the time it allows payment retries
		// and later can become success
		h.DonatedRepository.UpdateDonated("failed", orderId)
	} else if transactionStatus == "cancel" || transactionStatus == "expire" {
		// TODO set transaction status on your databaase to 'failure'
		h.DonatedRepository.UpdateDonated("failed", orderId)
	} else if transactionStatus == "pending" {
		// TODO set transaction status on your databaase to 'pending' / waiting payment
		h.DonatedRepository.UpdateDonated("pending", orderId)
	}

	return c.JSON(http.StatusOK, dto.SuccesResult{Code: http.StatusOK, Data: notificationPayload})
}

func (h *handleDonated) FindDonated(c echo.Context) error {
	donateds, err := h.DonatedRepository.FindDonated()
	if err != nil {
		return c.JSON(http.StatusInternalServerError, dto.ErrorResult{Code: http.StatusBadRequest, Message: err.Error()})
	}
	return c.JSON(http.StatusOK, dto.SuccesResult{Code: http.StatusOK, Data: donateds})
}

func (h *handleDonated) GetDonated(c echo.Context) error {
	id, _ := strconv.Atoi(c.Param("id"))
	var donated models.Donated
	donated, err := h.DonatedRepository.GetDonated(id)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, dto.ErrorResult{Code: http.StatusBadRequest, Message: err.Error()})
	}

	return c.JSON(http.StatusOK, dto.SuccesResult{Code: http.StatusOK, Data: convertResponseDonated(donated)})
}

func (h *handleDonated) CreateDonated(c echo.Context) error {

	var donatedIsMatch = false
	var donatedId int
	for !donatedIsMatch {
		donatedId = int(time.Now().Unix()) //1678180770
		donatedData, _ := h.DonatedRepository.GetDonated(donatedId)
		if donatedData.ID == 0 {
			donatedIsMatch = true
		}
	}

	userId := c.Get("userLogin").(jwt.MapClaims)["id"].(float64)
	donatedForm := c.FormValue("donated")
	titleAttache := c.FormValue("titleAttache")
	timeDonate := c.FormValue("donatedTime")
	fmt.Println("Donated value = ", donatedForm)
	layout := "2006-01-02"
	attacheid, _ := strconv.Atoi(c.FormValue("attacheid"))

	donatedTime, err := time.Parse(layout, timeDonate)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, dto.ErrorResult{Code: http.StatusInternalServerError, Message: err.Error()})
	}

	donatedint, _ := strconv.Atoi(donatedForm)
	// product, err := h.ProductRepository.GetAttache(cart.ProductID)

	donated := models.Donated{
		ID:           donatedId,
		UserID:       int(userId),
		TitleAttache: titleAttache,
		Donated:      donatedint,
		DonatedTime:  donatedTime,
		AttacheID:    attacheid,
		Status:       "waiting",
	}

	donated, err = h.DonatedRepository.CreateDonated(donated)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, dto.ErrorResult{Code: http.StatusInternalServerError, Message: err.Error()})
	}

	// 1. Initiate Snap client
	var s = snap.Client{}
	s.New(os.Getenv("SERVER_KEY"), midtrans.Sandbox)
	// Use to midtrans.Production if you want Production Environment (accept real transaction).

	// 2. Initiate Snap request param
	req := &snap.Request{
		TransactionDetails: midtrans.TransactionDetails{
			OrderID:  strconv.Itoa(donated.ID),
			GrossAmt: int64(donated.Donated),
		},
		CreditCard: &snap.CreditCardDetails{
			Secure: true,
		},
		CustomerDetail: &midtrans.CustomerDetails{
			FName: donated.User.Name,
			Email: donated.User.Email,
		},
	}

	// 3. Execute request create Snap transaction to Midtrans Snap API
	snapResp, _ := s.CreateTransaction(req)

	return c.JSON(http.StatusOK, dto.SuccesResult{Code: http.StatusOK, Data: snapResp})

	// donated, _ = h.DonatedRepository.GetDonated(donated.ID)

	// return c.JSON(http.StatusOK, dto.SuccesResult{Code: http.StatusOK, Data: convertResponseDonated(donated)})
}

// func (h *handleDonated) UpdateDonated(c echo.Context) error {
// 	request := new(donateddto.UpdateDonated)

// 	id, _ := strconv.Atoi(c.Param("id"))

// 	donatedNew, err := h.DonatedRepository.GetDonated(id)

// 	if err != nil {
// 		return c.JSON(http.StatusBadRequest, dto.ErrorResult{Code: http.StatusBadRequest, Message: err.Error()})
// 	}

// 	donatedForm := c.FormValue("donated")
// 	donatedint, _ := strconv.Atoi(donatedForm)

// 	request.Donated = donatedint

// 	if request.Donated != 0 {
// 		donatedNew.Donated = request.Donated
// 	}

// 	data, err := h.DonatedRepository.UpdateDonated(donatedNew)
// 	if err != nil {
// 		return c.JSON(http.StatusInternalServerError, dto.ErrorResult{Code: http.StatusInternalServerError, Message: err.Error()})
// 	}

// 	return c.JSON(http.StatusOK, dto.SuccesResult{Code: http.StatusOK, Data: convertResponseDonated(data)})
// }

func (h *handleDonated) DeleteDonated(c echo.Context) error {
	id, _ := strconv.Atoi(c.Param("id"))

	donated, err := h.DonatedRepository.GetDonated(id)
	if err != nil {
		return c.JSON(http.StatusBadRequest, dto.ErrorResult{Code: http.StatusBadRequest, Message: err.Error()})
	}

	data, err := h.DonatedRepository.DeleteDonated(donated, id)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, dto.ErrorResult{Code: http.StatusInternalServerError, Message: err.Error()})
	}

	return c.JSON(http.StatusOK, dto.SuccesResult{Code: http.StatusOK, Data: convertResponseDonated(data)})
}

func convertResponseDonated(u models.Donated) donateddto.DonatedResponse {
	return donateddto.DonatedResponse{
		// Name:   u.Name,
		// Email:  u.Email,
		// Phone:  u.Phone,
		// Addres: u.Addres,
		Donated:      u.Donated,
		TitleAttache: u.TitleAttache,
		DonatedTime:  u.DonatedTime,
	}
}


