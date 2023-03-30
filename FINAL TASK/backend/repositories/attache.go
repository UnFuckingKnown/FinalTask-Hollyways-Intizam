package repositories

import (
	"gorm.io/gorm"
	"hollyways/models"
)

type AttacheRepository interface {
	FindAttache() ([]models.Attache, error)
	GetAttache(ID int) (models.Attache, error)
	CreateAttache(attache models.Attache) (models.Attache, error)
	UpdateAttache(attache models.Attache) (models.Attache, error)
	DeleteAttache(attache models.Attache, ID int) (models.Attache, error)
}

func RepositoryAttache(db *gorm.DB) *repository {
	return &repository{db}
}

func (r *repository) FindAttache() ([]models.Attache, error) {
	var attache []models.Attache
	err := r.db.Preload("Donated").Find(&attache).Error
	return attache, err
}

func (r *repository) GetAttache(ID int) (models.Attache, error) {
	var attache models.Attache
	err := r.db.Preload("Donated").First(&attache, ID).Error
	return attache, err
}

func (r *repository) CreateAttache(attache models.Attache) (models.Attache, error) {
	err := r.db.Create(&attache).Error
	return attache, err
}
func (r *repository) UpdateAttache(attache models.Attache) (models.Attache, error) {
	err := r.db.Save(&attache).Error
	return attache, err
}

func (r *repository) DeleteAttache(attache models.Attache, ID int) (models.Attache, error) {
	err := r.db.Delete(&attache, ID).Scan(&attache).Error
	return attache, err
}
