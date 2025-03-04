package handlers

import (
	"auth2fa-api/internal/pkg/providers"
	"auth2fa-api/internal/pkg/store"
	"auth2fa-api/internal/pkg/utils"
	"net/http"
)

func Auth(w http.ResponseWriter, r *http.Request) {
    switch r.Method {
    case http.MethodGet:
		authCookie, err := r.Cookie("authenticationToken")
        println(err.Error())
		if err != nil {
			http.Redirect(w, r, "/login", http.StatusUnauthorized)
			return
		}

		authTk := authCookie.Value
		jwtMngr := utils.NewJwtManager()
		usrn, err := jwtMngr.VerifyToken(authTk)
		if err != nil {
			refCookie, err := r.Cookie("refreshToken")
			if err != nil {
				http.Error(w, "Missing refresh token", http.StatusUnauthorized)
				return
			}

			refTk := refCookie.Value
			usrn, err = jwtMngr.VerifyToken(refTk)
			if err != nil {
				http.Redirect(w, r, "/login", http.StatusUnauthorized)
				return
			}
		}

        storeInst, err := store.GetStore()
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		usrStore := providers.NewUserProvider(storeInst)
        _, err = usrStore.GetUserByUsrn(usrn)
        if err != nil {
			http.Error(w, err.Error(), http.StatusUnauthorized)
			return
        }

        w.WriteHeader(200)
    default:
        return
    }
}
