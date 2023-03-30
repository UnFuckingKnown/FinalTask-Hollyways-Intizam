package repositories

import (
	"gorm.io/gorm"
	"hollyways/models"
)

type ProfileRepository interface {
	FindProfile() ([]models.Profile, error)
	GetProfile(ID int) (models.Profile, error)
	CreateProfile(profile models.Profile) (models.Profile, error)
	UpdateProfile(profile models.Profile) (models.Profile, error)
	DeleteProfile(profile models.Profile, ID int) (models.Profile, error)
}

func RepositoryProfile(db *gorm.DB) *repository {
	return &repository{db}
}

func (r *repository) FindProfile() ([]models.Profile, error) {
	var profile []models.Profile
	err := r.db.Find(&profile).Error
	return profile, err
}

func (r *repository) GetProfile(ID int) (models.Profile, error) {
	var profile models.Profile
	err := r.db.First(&profile, ID).Error
	return profile, err
}

func (r *repository) CreateProfile(profile models.Profile) (models.Profile, error) {
	err := r.db.Create(&profile).Error
	return profile, err
}

func (r *repository) UpdateProfile(profile models.Profile) (models.Profile, error) {
	err := r.db.Save(&profile).Error
	return profile, err
}

func (r *repository) DeleteProfile(profile models.Profile, ID int) (models.Profile, error) {
	err := r.db.Delete(&profile, ID).Scan(&profile).Error
	return profile, err
}
