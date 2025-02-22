package models

import (
	"auth2fa-api/internal/pkg/utils"
	"time"
)

type User struct {
    Username string
    Password string
    AuthDeviceToken string
}

func (u *User) NewAuthToken() (string, error) {
	jwtMngr := utils.NewJwtManager()
	return jwtMngr.NewToken(u.Username, time.Hour * 2)
}

func (u *User) NewRefreshToken() (string, error) {
	jwtMngr := utils.NewJwtManager()
	return jwtMngr.NewToken(u.Username, time.Hour * 24)
}
