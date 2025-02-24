package handlers

import (
	"auth2fa-api/internal/pkg/utils"
	"encoding/json"
	"fmt"
	"math/rand"
	"net/http"
	"time"
)

type VerificationResponse struct {
	Token  string `json:"token"`
	Expiry string `json:"expiry"`
}

type VerificationDTO struct {
	Token string
	Code  string
}

var jwtManager = utils.NewJwtManager()

func Code(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case http.MethodGet:
		code := fmt.Sprintf("%d", rand.Intn(99999-10000)+10000)
		tk, err := jwtManager.NewToken(code, time.Minute*3)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		data, err := json.Marshal(VerificationResponse{
			Token:  tk,
			Expiry: time.Now().Add(time.Minute * 3).String(),
		})

		w.Write(data)
	case http.MethodPost:
		var dto VerificationDTO
		err := json.NewDecoder(r.Body).Decode(&dto)
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}

		code, err := jwtManager.VerifyToken(dto.Token)
		if err != nil || dto.Code != code {
			http.Error(w, err.Error(), http.StatusUnauthorized)
			return
		}
	default:
		return
	}
}

func RevealCode(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case http.MethodGet:
		deviceToken := r.Header.Get("deviceToken")
		verificationToken := r.Header.Get("verificationToken")
		remoteAddress, err := jwtManager.VerifyToken(deviceToken)
		if err != nil || r.RemoteAddr != remoteAddress {
			http.Error(w, err.Error(), http.StatusUnauthorized)
			return
		}

		code, err := jwtManager.VerifyToken(verificationToken)
		if err != nil {
			http.Error(w, err.Error(), http.StatusUnauthorized)
			return
		}

		w.Write([]byte(code))
	default:
		return
	}
}
