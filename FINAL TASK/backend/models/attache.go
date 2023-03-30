package models

import "time"

type Attache struct {
	ID       int       `json:"id" gorm:"primary_key:auto_increment"`
	Title    string    `json:"title" form:"title" gorm:"type: varchar(255)"`
	Image    string    `json:"image" form:"image" gorm:"type: varchar(255) "`
	EndDate  time.Time `json:"endDate"`
	Donation int       `json:"donation" form:"donation" gorm:"type: int"`
	Desc     string    `json:"desc" form:"desc" gorm:"type : text"`
	Donated  []Donated   `json:"donated"`
}

type AttacheDonated struct {
	ID int `json:"attacheid"`
}
