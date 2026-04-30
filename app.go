package main

import (
	"context"
	"encoding/base64"
	"os"
	"path/filepath"

	"github.com/wailsapp/wails/v2/pkg/runtime"
)

// App struct
type App struct {
	ctx context.Context
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

type CardData struct {
	ID          string `json:"id"`
	Name        string `json:"name"`
	TypeLine    string `json:"typeLine"`
	Description string `json:"description"`
	FooterText  string `json:"footerText"`
	Rarity      string `json:"rarity"`
	Artwork     string `json:"artwork"`
}

// SaveCardDataRequest is the payload for SaveCardData. When ImageBytes is non-empty, a hashed file is written under item-cards/art and the resulting basename is stored; otherwise Artwork is stored as-is.
type SaveCardDataRequest struct {
	Name        string `json:"name"`
	TypeLine    string `json:"typeLine"`
	Description string `json:"description"`
	FooterText  string `json:"footerText"`
	Rarity      string `json:"rarity"`
	Artwork     string `json:"artwork"`
	ImageBytes  []byte `json:"imageBytes"`
	ImageExt    string `json:"imageExt"`
}

// SaveCardPNG opens the OS save dialog and writes PNG bytes to the chosen path.
// If the user cancels the dialog, it returns nil.
func (a *App) SaveCardPNG(defaultFilename string, data []byte) error {
	path, err := runtime.SaveFileDialog(a.ctx, runtime.SaveDialogOptions{
		Title:           "Export card as PNG",
		DefaultFilename: defaultFilename,
		Filters: []runtime.FileFilter{
			{DisplayName: "PNG image", Pattern: "*.png"},
		},
	})
	if err != nil {
		return err
	}
	if path == "" {
		return nil
	}
	return os.WriteFile(path, data, 0o644)
}

func (a *App) SaveCardData(cardData SaveCardDataRequest) error {
	return addCard(cardData)
}

func (a *App) GetCardData() ([]CardData, error) {
	cards, err := readCardsFromJson()
	if err != nil {
		return nil, err
	}

	for i, card := range cards {
		userConfigDir, err := os.UserConfigDir()
		if err != nil {
			return nil, err
		}
		artwork, err := os.ReadFile(filepath.Join(userConfigDir, "item-cards", "art", card.Artwork))
		if err != nil {
			return nil, err
		}
		cards[i].Artwork = base64.StdEncoding.EncodeToString(artwork)
	}

	return cards, nil
}

func (a *App) DeleteCardData(id string) error {
	return deleteCardById(id)
}

func (a *App) UpdateCardData(id string, cardData CardData) error {
	return updateCardById(id, cardData)
}
