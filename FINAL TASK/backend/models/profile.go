package models

type Profile struct {
	ID int `json:"id" gorm:"primary_key:auto_increment"`
	// Name   string      `json:"name" gorm:"type: varchar(255)"`
	// Email  string      `json:"email" gorm:"type: varchar(255)"`

	// Addres string      `json:"addres" gorm:"type: varchar(255)"`
	Image  string `json:"image" form:"image" gorm:"type: varchar(255) "`
	Phone  string `json:"phone" gorm:"type: varchar(255)"`
	UserID int    `json:"userid"`
}

// type ProfileUser struct {
// 	ID int `json:"profileid"`
// Name   string `json:"name"`
// Email  string `json:"email"`
// Phone  int    `json:"phone"`
// Addres string `json:"addres"`
// 	Image  string `json:"image"`
// 	UserID int    `json:"-"`
// }

// func (ProfileUser) TableName() string {
// 	return "profiles"
// }
