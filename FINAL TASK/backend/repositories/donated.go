package repositories

import (
	"hollyways/models"

	"gorm.io/gorm"
)

type DonatedRepository interface {
	FindDonated() ([]models.Donated, error)
	GetDonated(ID int) (models.Donated, error)
	CreateDonated(donated models.Donated) (models.Donated, error)
	UpdateDonated(status string, ID string) error
	DeleteDonated(donated models.Donated, ID int) (models.Donated, error)
}

func RepositoryDonated(db *gorm.DB) *repository {
	return &repository{db}
}

// ori 27 mar
func (r *repository) FindDonated() ([]models.Donated, error) {
	var donated []models.Donated
	err := r.db.Preload("User").Find(&donated).Error
	return donated, err
}

// ori 27 mar

// baru 27

// func (r *repository) FindDonated() ([]models.Donated, error) {
// 	var donated []models.Donated
// 	err := r.db.Preload("User").Where("status = ?", "success").Find(&donated).Error
// 	return donated, err
// }

//27 mar

func (r *repository) GetDonated(ID int) (models.Donated, error) {
	var donated models.Donated
	err := r.db.Preload("User").First(&donated, ID).Error
	return donated, err
}

func (r *repository) CreateDonated(donated models.Donated) (models.Donated, error) {
	err := r.db.Create(&donated).Error
	return donated, err
}

// func (r *repository) UpdateDonated(donated models.Donated) (models.Donated, error) {
// 	err := r.db.Save(&donated).Error
// 	return donated, err
// }

func (r *repository) UpdateDonated(status string, ID string) error {
	var donated models.Donated
	r.db.First(&donated, ID)
	donated.Status = status
	err := r.db.Save(&donated).Error
	return err

}

// func (r *repository) UpdateDonated(status string, ID string) error {
// 	var donated models.Donated
// 	r.db.First(&donated, ID)

// 	err := r.db.Save(&donated).Error
// 	return err
// }

func (r *repository) DeleteDonated(donated models.Donated, ID int) (models.Donated, error) {
	err := r.db.Delete(&donated, ID).Scan(&donated).Error
	return donated, err
}
