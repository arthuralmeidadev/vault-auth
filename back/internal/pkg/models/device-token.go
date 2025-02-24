package models

import "time"

type verificationCode struct {
	Code   string
	Expiry time.Time
}

type deviceTokenAuth struct {
	Token             string
	Username          string
	VerificationCodes []*verificationCode
}

func newDeviceToken() {

}
