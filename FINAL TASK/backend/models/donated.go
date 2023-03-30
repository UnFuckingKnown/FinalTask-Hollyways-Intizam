package models

import "time"

type Donated struct {
	ID int `json:"id" gorm:"primary_key:auto_increment"`

	// 25 mar
	TitleAttache string `json:"titleattache" form:"title" gorm:"type: varchar(255)"`
	// 25 mar

	Donated     int       `json:"donated" form:"donated" gorm:"type: int"`
	DonatedTime time.Time `json:"donatedTime"`
	UserID      int       `json:"userid"`
	AttacheID   int       `json:"attacheid"`
	User        User      `json:"user"`
	Status      string    `json:"status" gorm:"type : varchar(255)"`
}
