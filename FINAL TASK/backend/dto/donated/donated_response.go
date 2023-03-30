package donateddto

import "time"

type DonatedResponse struct {
	// 25 mar
	TitleAttache string `json:"titleattache" form:"title" gorm:"type: varchar(255)"`
	// 25 mar
	Donated     int       `json:"donated" form:"donated" gorm:"type: int"`
	DonatedTime time.Time `json:"donatedTime"`
}
