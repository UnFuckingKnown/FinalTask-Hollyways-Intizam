package models

import "time"

type User struct {
	ID        int       `json:"id" gorm:"primary_key:auto_increment"`
	Name      string    `json:"name" gorm:"type: varchar(255)"`
	Email     string    `json:"email" gorm:"type: varchar(255)"`
	Password  string    `json:"password" gorm:"type: varchar(255)"`
	Role      string    `json:"role" gorm:"type: varchar(255)"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
	Profile   Profile   `json:"profile"`
	Donated   []Donated `json:"donated"`
}

type UserProfile struct {
	ID int `json:"userId"`
}

func (UserProfile) TableName() string {
	return "users"
}

type UserDonate struct {
	ID int `json:"userId"`
}

func (UserDonate) TableName() string {
	return "users"
}
