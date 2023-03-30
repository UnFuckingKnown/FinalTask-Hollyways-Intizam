package database

import (
	"fmt"
	"hollyways/models"
	"hollyways/package/mysql"
)

func RunMigration() {
	err := mysql.DB.AutoMigrate(
		&models.User{},
		&models.Attache{},
		&models.Profile{},
		&models.Donated{},
		// &models.Fuckingtsc{},
	)

	if err != nil {
		fmt.Println(err)
		panic("migration error")
	}

	fmt.Println("migraion succes")
}
