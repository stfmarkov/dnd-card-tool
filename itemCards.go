package main

import (
	"crypto/md5"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"os"
	"path/filepath"
	"strings"

	"github.com/google/uuid"
)

const cardsDir = "item-cards"
const cardsArtDirName = "art"
const cardsJsonFileName = "cards.json"

// maxArtBytes caps uploaded artwork size when saving from the editor (dedup still uses full hash).
const maxArtBytes = 25 << 20 // 25 MiB

func createCardsJsonFile() error {
	userConfigDir, err := os.UserConfigDir()
	if err != nil {
		return err
	}

	err = os.MkdirAll(filepath.Join(userConfigDir, cardsDir), 0o755)
	if err != nil {
		return err
	}

	err = os.WriteFile(filepath.Join(userConfigDir, cardsDir, cardsJsonFileName), []byte("[]"), 0o644)
	if err != nil {
		return err
	}
	return nil
}

func saveCardsToJson(cards []CardData) error {
	jsonData, err := json.Marshal(cards)
	if err != nil {
		return err
	}
	userConfigDir, err := os.UserConfigDir()
	if err != nil {
		return err
	}
	return os.WriteFile(filepath.Join(userConfigDir, cardsDir, cardsJsonFileName), jsonData, 0o644)
}

// addCard appends a new card to cards.json and returns the new card's ID.
func addCard(card SaveCardDataRequest) (string, error) {
	cards, err := readCardsFromJson()
	if err != nil {
		return "", err
	}

	artwork := card.Artwork
	if len(card.ImageBytes) > 0 {
		name, err := saveArtIfMissing(card.ImageBytes, card.ImageExt)
		if err != nil {
			return "", err
		}
		artwork = name
	}

	newCard := CardData{
		ID:          uuid.New().String(),
		Name:        card.Name,
		TypeLine:    card.TypeLine,
		Description: card.Description,
		FooterText:  card.FooterText,
		Rarity:      card.Rarity,
		Artwork:     artwork,
	}
	cards = append(cards, newCard)
	return newCard.ID, saveCardsToJson(cards)
}

func readCardsFromJson() ([]CardData, error) {
	userConfigDir, err := os.UserConfigDir()
	if err != nil {
		return nil, err
	}
	jsonFile, err := os.Open(filepath.Join(userConfigDir, cardsDir, cardsJsonFileName))
	if err != nil {
		if errors.Is(err, os.ErrNotExist) {
			err = createCardsJsonFile()
			if err != nil {
				return nil, err
			}
			return []CardData{}, nil
		} else {
			return nil, err
		}
	}
	defer jsonFile.Close()

	byteValue, err := io.ReadAll(jsonFile)
	if err != nil {
		return nil, err
	}

	var cards []CardData

	err = json.Unmarshal(byteValue, &cards)
	if err != nil {
		return nil, err
	}

	return cards, nil
}

func updateCardById(id string, req UpdateCardDataRequest) error {
	cards, err := readCardsFromJson()
	if err != nil {
		return err
	}
	for i, cardData := range cards {
		if cardData.ID == id {
			artwork := req.Artwork
			if len(req.ImageBytes) > 0 {
				name, err := saveArtIfMissing(req.ImageBytes, req.ImageExt)
				if err != nil {
					return err
				}
				artwork = name
			}
			cards[i] = CardData{
				ID:          id,
				Name:        req.Name,
				TypeLine:    req.TypeLine,
				Description: req.Description,
				FooterText:  req.FooterText,
				Rarity:      req.Rarity,
				Artwork:     artwork,
			}
			return saveCardsToJson(cards)
		}
	}
	return errors.New("card not found")
}

// normalizeArtExt returns a lowercase extension including leading dot, restricted to common image types.
func normalizeArtExt(ext string) string {
	ext = strings.TrimSpace(strings.ToLower(ext))
	if ext == "" {
		return ".png"
	}
	if !strings.HasPrefix(ext, ".") {
		ext = "." + ext
	}
	switch ext {
	case ".jpg", ".jpeg", ".png", ".webp", ".gif":
		return ext
	default:
		return ".png"
	}
}

// saveArtIfMissing writes image bytes to userConfig/item-cards/art/{md5}{ext} when the file does not exist.
// Returns the basename (e.g. "d41d8cd98f00b204e9800998ecf8427e.png") or empty string when data is empty.
func saveArtIfMissing(data []byte, ext string) (string, error) {
	if len(data) == 0 {
		return "", nil
	}
	if len(data) > maxArtBytes {
		return "", errors.New("image exceeds maximum size")
	}
	ext = normalizeArtExt(ext)
	sum := md5.Sum(data)
	basename := fmt.Sprintf("%x%s", sum, ext)

	userConfigDir, err := os.UserConfigDir()
	if err != nil {
		return "", err
	}
	artDir := filepath.Join(userConfigDir, cardsDir, cardsArtDirName)
	if err := os.MkdirAll(artDir, 0o755); err != nil {
		return "", err
	}
	fullPath := filepath.Join(artDir, basename)
	if _, err := os.Stat(fullPath); err == nil {
		return basename, nil
	} else if !errors.Is(err, os.ErrNotExist) {
		return "", err
	}
	return basename, os.WriteFile(fullPath, data, 0o644)
}

func deleteCardById(id string) error {
	cards, err := readCardsFromJson()
	if err != nil {
		return err
	}
	for i, cardData := range cards {
		if cardData.ID == id {
			cards = append(cards[:i], cards[i+1:]...)
			return saveCardsToJson(cards)
		}
	}
	return errors.New("card not found")
}
