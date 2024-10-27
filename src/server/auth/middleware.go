package auth

import (
	"net/http"
	"strings"
	"time"

	"github.com/nkanaev/yarr/src/assets"
	"github.com/nkanaev/yarr/src/server/router"
	"github.com/nkanaev/yarr/src/storage"
)

type Middleware struct {
	Username string
	Password string
	BasePath string
	Public   []string
	DB       *storage.Storage
}

func unsafeMethod(method string) bool {
	return method == "POST" || method == "PUT" || method == "DELETE"
}

func extendSessionIfNeeded(rw http.ResponseWriter, req *http.Request) {
	cookie, err := req.Cookie("auth")
	if err != nil {
		return
	}

	// Add a week to a session that will expire in the next 48 hours.
	if time.Until(cookie.Expires) < 48*time.Hour {
		http.SetCookie(rw, &http.Cookie{
			Name:    "auth",
			Value:   cookie.Value,
			Expires: time.Now().Add(7 * 24 * time.Hour),
			Path:    cookie.Path,
		})
	}
}

func (m *Middleware) Handler(c *router.Context) {
	for _, path := range m.Public {
		if strings.HasPrefix(c.Req.URL.Path, m.BasePath+path) {
			c.Next()
			return
		}
	}

	if IsAuthenticated(c.Req, m.Username, m.Password) {
		extendSessionIfNeeded(c.Out, c.Req)
		c.Next()
		return
	}

	rootUrl := m.BasePath + "/"

	if c.Req.URL.Path != rootUrl {
		c.Out.WriteHeader(http.StatusUnauthorized)
		return
	}

	if c.Req.Method == "POST" {
		username := c.Req.FormValue("username")
		password := c.Req.FormValue("password")
		if StringsEqual(username, m.Username) && StringsEqual(password, m.Password) {
			Authenticate(c.Out, m.Username, m.Password, m.BasePath)
			c.Redirect(rootUrl)
			return
		} else {
			c.HTML(http.StatusOK, assets.Template("login.html"), map[string]interface{}{
				"username": username,
				"error":    "Invalid username/password",
				"settings": m.DB.GetSettings(),
			})
			return
		}
	}
	c.HTML(http.StatusOK, assets.Template("login.html"), map[string]interface{}{
		"settings": m.DB.GetSettings(),
	})
}
