package main

import (
	"auth2fa-api/internal/handlers"
	"net/http"
)

func main()  {
    http.HandleFunc("/login", handlers.Login)
    http.ListenAndServe(":3000", nil)
}
