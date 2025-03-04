package main

import (
	"auth2fa-api/internal/handlers"
	"fmt"
	"log"
	"net/http"
)

func mainHandler(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        w.Header().Set("Access-Control-Allow-Origin", "https://vault-auth.arthuralmeidadev.com")
		w.Header().Set("Access-Control-Allow-Methods", "OPTIONS, GET, POST, PUT, PATCH, PUT, DELETE")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With")
		w.Header().Set("Access-Control-Allow-Credentials", "true")

		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}
        next.ServeHTTP(w, r);
    })
}

func main()  {
    mux := http.NewServeMux()
    mux.HandleFunc("/login", handlers.Login)
    mux.HandleFunc("/auth", handlers.Auth)
    mux.HandleFunc("/device", handlers.Device)
    mux.HandleFunc("/code", handlers.Code)
    mux.HandleFunc("/code/reveal", handlers.RevealCode)
    port := 3000
    ctlChan := make(chan struct{})
    go func () {
        err := http.ListenAndServe(fmt.Sprintf(":%d", port), mainHandler(mux))
        if err != nil {
            ctlChan <- struct{}{}
            log.Fatal("Couldn't start server: \n%s", err)
        }
    }()
    log.Println("Server started successfully; listening on port", port)
    <-ctlChan
}
