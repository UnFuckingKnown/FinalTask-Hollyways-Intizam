package profiledto

type ProfileRequest struct {
	// Name   string `json:"name" form:"name" validate:"required"`
	// Email  string `json:"email" form:"email" validate:"required"`
	
	Phone string `json:"phone" form:"phone" gorm:"type: int"`
	// Addres string `json:"addres" form:"addres" validate:"required"`
	Image string `json:"image" form:"image" `
}

type UpdateProfileRequest struct {
	// Name   string `json:"name" form:"name"`
	// Email  string `json:"email" form:"email"`
	Phone string `json:"phone" form:"phone" gorm:"type: int"`
	// Addres string `json:"addres" form:"addres"`
	Image string `json:"image" form:"image" `
}
