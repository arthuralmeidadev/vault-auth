package providers

import "auth2fa-api/internal/pkg/models"

type userStore interface {
    GetUserByUsrn(usrn string) (*models.User, error)
    GetUserByTk(tk string) (*models.User, error)
    AddQRCodeLoginDevice(usrn, tk string) error
}

type userProvider struct {
    store userStore
}

func (pvd *userProvider) GetUserByUsrn(usrn string) (*models.User, error)  {
    usr, err := pvd.store.GetUserByUsrn(usrn) 
    if err != nil {
        return nil, err
    }

    return usr, nil
}

func (pvd *userProvider) GetUserByTk(tk string) (*models.User, error)  {
    usr, err := pvd.store.GetUserByTk(tk) 
    if err != nil {
        return nil, err
    }

    return usr, nil
}

func (pvd *userProvider) AddQRCodeLoginDevice(usrn, tk string) error {
    return pvd.store.AddQRCodeLoginDevice(usrn, tk)
}

func NewUserProvider(s userStore) *userProvider {
    return &userProvider{store: s}
}
