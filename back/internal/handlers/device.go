package handlers

import (
	"auth2fa-api/internal/pkg/utils"
	"net/http"
	"time"
)

func Device(w http.ResponseWriter, r *http.Request) {
	jwtManager := utils.NewJwtManager()
	switch r.Method {
	case http.MethodGet:
		tk, err := jwtManager.NewToken(r.RemoteAddr, time.Hour*24*7)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		w.Write([]byte(tk))
	case http.MethodPost:
        tk := r.Header.Get("deviceToken")
        if len(tk) == 0{
            http.Error(w, "Missing device token",http.StatusBadRequest)
            return
        }

        _, err := jwtManager.VerifyToken(tk)
		if err != nil {
			http.Error(w, err.Error(), http.StatusUnauthorized)
			return
		}

		w.WriteHeader(200)
	default:
		return
	}
}
