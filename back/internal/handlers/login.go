package handlers

import (
	"auth2fa-api/internal/pkg/providers"
	"auth2fa-api/internal/pkg/store"
	"encoding/json"
	"net/http"
	"time"
)

type LoginDTO struct {
    Username string
    Password string
}

func Login(w http.ResponseWriter, r *http.Request) {
    switch r.Method {
    case http.MethodPost:
        var dto LoginDTO
        err := json.NewDecoder(r.Body).Decode(&dto)
        if err != nil {
            http.Error(w, err.Error(), http.StatusBadRequest)
            return
        }

        storeInst, err := store.GetStore()
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		usrStore := providers.NewUserProvider(storeInst)
        usr, err := usrStore.GetUserByUsrn(dto.Username)
        if err != nil {
			http.Error(w, err.Error(), http.StatusNotFound)
			return
        }

        if dto.Password != usr.Password {
            http.Error(w, "Incorrect password", http.StatusUnauthorized)
            return
        } else {
            authTk, err := usr.NewAuthToken()
            if err != nil {
                http.Error(w, err.Error(), http.StatusInternalServerError)
                return
            }

            refTk, err := usr.NewRefreshToken()
            if err != nil {
                http.Error(w, err.Error(), http.StatusInternalServerError)
                return
            }

            http.SetCookie(w, &http.Cookie{
                Name:    "authenticationToken",
                Value:   string(authTk),
                Expires: time.Now().Add(time.Hour * 2),
                HttpOnly: true,
                Secure: true,
                SameSite: http.SameSiteNoneMode,
            })
            http.SetCookie(w, &http.Cookie{
                Name:    "refreshToken",
                Value:   string(refTk),
                Expires: time.Now().Add(time.Hour * 24),
                HttpOnly: true,
                Secure: true,
                SameSite: http.SameSiteNoneMode,
            })
            w.WriteHeader(200)
            return
        }
    default:
        return
    }
}
