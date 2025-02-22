package store

import (
	"auth2fa-api/internal/pkg/models"
	"errors"
)

type store struct {
	users []*models.User
}

func (s *store) GetUserByUsrn(usrn string) (*models.User, error) {
	var foundUsr *models.User
	for _, usr := range s.users {
		if usr.Username == usrn {
			foundUsr = usr
		}
	}

	if foundUsr == nil {
		return nil, errors.New("User not found")
	}

	return foundUsr, nil
}

func (s *store) GetUserByTk(tk string) (*models.User, error) {
	var foundUsr *models.User
	for _, usr := range s.users {
		if usr.AuthDeviceToken == tk {
			foundUsr = usr
		}
	}

	if foundUsr == nil {
		return nil, errors.New("User not found")
	}

	return foundUsr, nil
}

func (s *store) AddQRCodeLoginDevice(usrn, tk string) error {
	var foundUsr *models.User
	for _, usr := range s.users {
		if usr.Username == usrn {
			usr.AuthDeviceToken = tk
		}
	}

	if foundUsr == nil {
		return errors.New("User not found")
	}

	return nil
}

func GetStore() (*store, error) {
	users := make([]*models.User, 0)
	users = append(users, &models.User{
		Username: "arthuralmeida",
		Password: "pass123",
	})

	return &store{users}, nil
}
